import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import WavEncoder from 'wav-encoder';
import VM from 'scratch-vm';

import { connect } from 'react-redux';

import {
    computeChunkedRMS,
    encodeAndAddSoundToVM,
    downsampleIfNeeded,
    dropEveryOtherSample
} from '../lib/audio/audio-util.js';
import AudioEffects from '../lib/audio/audio-effects.js';
import SoundEditorComponent from '../components/sound-editor/sound-editor.jsx';
import AudioBufferPlayer from '../lib/audio/audio-buffer-player.js';
import log from '../lib/log.js';
import confirmStyles from '../css/confirm-dialog.css';
import generateEffectIcon from '../components/sound-editor/icon--generate-effect.svg';

const UNDO_STACK_SIZE = 250;

const MAX_RMS = 1.2;

class SoundEditor extends React.Component {
    constructor(props) {
        super(props);
        bindAll(this, [
            'copy',
            'copyCurrentBuffer',
            'handleCopyToNew',
            'handleCutToNew',
            'handleStoppedPlaying',
            'handleChangeName',
            'handlePlay',
            'handleStopPlaying',
            'handleUpdatePlayhead',
            'handleDelete',
            'handleUpdateTrim',
            'handleEffect',
            'handleUndo',
            'handleRedo',
            'submitNewSamples',
            'handleCopy',
            'handlePaste',
            'handleCut',
            'paste',
            'handleKeyPress',
            'handleContainerClick',
            'setRef',
            'resampleBufferToRate',
            'handleModifyMenu',
            'handleGenerateEffectMenu',
            'handleGeneratedEffect',
            'addGenerateEffectButton',
            'handleFormatMenu',
            'handleBitCrushMenu',
            'getSelectionBuffer'
        ]);
        this.state = {
            copyBuffer: null,
            chunkLevels: computeChunkedRMS(this.props.samples),
            playhead: null,
            trimStart: null,
            trimEnd: null
        };
        this.redoStack = [];
        this.undoStack = [];
        this.ref = null;
    }
    componentDidMount() {
        this.audioBufferPlayer = new AudioBufferPlayer(this.props.samples, this.props.sampleRate);
        this.addGenerateEffectButton();
        // Do not register a document-level keyboard handler here. The Sound
        // Editor must never hijack Space or ordinary letter keys while a sound
        // is open.
    }
    componentDidUpdate() {
        this.addGenerateEffectButton();
    }
    addGenerateEffectButton() {
        if (!this.ref) return;
        const effects = this.ref.querySelector(`.${require('../components/sound-editor/sound-editor.css').effects}`);
        if (!effects || effects.querySelector('[data-generate-effect-button="true"]')) return;

        const button = document.createElement('button');
        button.type = 'button';
        button.setAttribute('data-generate-effect-button', 'true');
        button.title = 'Generate Effect';
        button.style.width = '32px';
        button.style.height = '32px';
        button.style.margin = '2px';
        button.style.border = '0';
        button.style.background = 'transparent';
        button.style.padding = '4px';
        button.style.cursor = 'pointer';

        const image = document.createElement('img');
        image.src = generateEffectIcon;
        image.alt = 'Generate Effect';
        image.draggable = false;
        image.style.width = '20px';
        image.style.height = '20px';
        button.appendChild(image);
        button.addEventListener('click', this.handleGenerateEffectMenu);
        effects.insertBefore(button, effects.firstChild);
    }
    componentWillReceiveProps(newProps) {
        if (newProps.soundId !== this.props.soundId) {
            this.redoStack = [];
            this.undoStack = [];
            this.resetState(newProps.samples, newProps.sampleRate);
            this.setState({ trimStart: null, trimEnd: null });
        }
    }
    componentWillUnmount() {
        this.audioBufferPlayer.stop();
        if (this.ref) {
            const button = this.ref.querySelector('[data-generate-effect-button="true"]');
            if (button) button.remove();
        }
    }
    handleKeyPress(event) {
        return event;
    }
    resetState(samples, sampleRate) {
        this.audioBufferPlayer.stop();
        this.audioBufferPlayer = new AudioBufferPlayer(samples, sampleRate);
        this.setState({ chunkLevels: computeChunkedRMS(samples), playhead: null });
    }
    submitNewSamples(samples, sampleRate, skipUndo) {
        return downsampleIfNeeded({ samples, sampleRate }, this.resampleBufferToRate)
            .then(({ samples: newSamples, sampleRate: newSampleRate }) =>
                WavEncoder.encode({ sampleRate: newSampleRate, channelData: [newSamples] }).then(wavBuffer => {
                    if (!skipUndo) {
                        this.redoStack = [];
                        if (this.undoStack.length >= UNDO_STACK_SIZE) this.undoStack.shift();
                        this.undoStack.push(this.getUndoItem());
                    }
                    this.resetState(newSamples, newSampleRate);
                    this.props.vm.updateSoundBuffer(
                        this.props.soundIndex,
                        this.audioBufferPlayer.buffer,
                        new Uint8Array(wavBuffer));
                    return true;
                })
            )
            .catch(e => {
                log.error(`Encountered error while trying to encode sound update: ${e.message}`);
                return false;
            });
    }
    handlePlay() {
        this.audioBufferPlayer.stop();
        this.audioBufferPlayer.play(
            this.state.trimStart || 0,
            this.state.trimEnd || 1,
            this.handleUpdatePlayhead,
            this.handleStoppedPlaying);
    }
    handleStopPlaying() {
        this.audioBufferPlayer.stop();
        this.handleStoppedPlaying();
    }
    handleStoppedPlaying() {
        this.setState({ playhead: null });
    }
    handleUpdatePlayhead(playhead) {
        this.setState({ playhead });
    }
    handleChangeName(name) {
        this.props.vm.renameSound(this.props.soundIndex, name);
    }
    handleDelete() {
        const { samples, sampleRate } = this.copyCurrentBuffer();
        const sampleCount = samples.length;
        const startIndex = Math.floor(this.state.trimStart * sampleCount);
        const endIndex = Math.floor(this.state.trimEnd * sampleCount);
        const firstPart = samples.slice(0, startIndex);
        const secondPart = samples.slice(endIndex, sampleCount);
        const newLength = firstPart.length + secondPart.length;
        let newSamples;
        if (newLength === 0) newSamples = new Float32Array(1);
        else {
            newSamples = new Float32Array(newLength);
            newSamples.set(firstPart, 0);
            newSamples.set(secondPart, firstPart.length);
        }
        this.submitNewSamples(newSamples, sampleRate).then(() => this.setState({ trimStart: null, trimEnd: null }));
    }
    handleDeleteInverse() {
        const { samples, sampleRate } = this.copyCurrentBuffer();
        const sampleCount = samples.length;
        const startIndex = Math.floor(this.state.trimStart * sampleCount);
        const endIndex = Math.floor(this.state.trimEnd * sampleCount);
        let clippedSamples = samples.slice(startIndex, endIndex);
        if (clippedSamples.length === 0) clippedSamples = new Float32Array(1);
        this.submitNewSamples(clippedSamples, sampleRate).then(success => {
            if (success) this.setState({ trimStart: null, trimEnd: null });
        });
    }
    handleUpdateTrim(trimStart, trimEnd) {
        this.setState({ trimStart, trimEnd });
        this.handleStopPlaying();
    }
    effectFactory(name) {
        return () => this.handleEffect({ preset: name });
    }
    copyCurrentBuffer() {
        return {
            samples: this.audioBufferPlayer.buffer.getChannelData(0),
            sampleRate: this.audioBufferPlayer.buffer.sampleRate
        };
    }
    handleEffect(options) {
        const trimStart = this.state.trimStart === null ? 0.0 : this.state.trimStart;
        const trimEnd = this.state.trimEnd === null ? 1.0 : this.state.trimEnd;
        if (this.audioBufferPlayer.buffer.length < 2) return;
        const effects = new AudioEffects(this.audioBufferPlayer.buffer, options, trimStart, trimEnd);
        effects.process((renderedBuffer, adjustedTrimStart, adjustedTrimEnd) => {
            const samples = renderedBuffer.getChannelData(0);
            const sampleRate = renderedBuffer.sampleRate;
            this.submitNewSamples(samples, sampleRate).then(success => {
                if (success) {
                    if (this.state.trimStart === null) this.handlePlay();
                    else this.setState({ trimStart: adjustedTrimStart, trimEnd: adjustedTrimEnd }, this.handlePlay);
                }
            });
        });
    }
    handleGeneratedEffect(options) {
        const trimStart = this.state.trimStart === null ? 0 : this.state.trimStart;
        const trimEnd = this.state.trimEnd === null ? 1 : this.state.trimEnd;
        const sourceBuffer = this.audioBufferPlayer.buffer;
        if (!sourceBuffer || sourceBuffer.length < 2) return;
        const sampleRate = sourceBuffer.sampleRate;
        const context = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(1, sourceBuffer.length, sampleRate);
        const source = context.createBufferSource();
        const buffer = context.createBuffer(1, sourceBuffer.length, sampleRate);
        buffer.getChannelData(0).set(sourceBuffer.getChannelData(0));
        source.buffer = buffer;

        const input = context.createGain();
        const output = context.createGain();
        const dry = context.createGain();
        const wet = context.createGain();
        const bandpassAmount = Math.max(0, Math.min(1, Number(options.bandpass) || 0));
        const distortionAmount = Math.max(0, Math.min(1, Number(options.distortion) || 0));
        const echoAmount = Math.max(0, Math.min(1, Number(options.echo) || 0));
        const reverbAmount = Math.max(0, Math.min(1, Number(options.reverb) || 0));
        const chorusAmount = Math.max(0, Math.min(1, Number(options.chorus) || 0));
        const bassAmount = Math.max(0, Math.min(1, Number(options.bass) || 0));
        const trebleAmount = Math.max(0, Math.min(1, Number(options.treble) || 0));

        dry.gain.value = 1 - (Math.min(0.72, (bandpassAmount + distortionAmount + echoAmount + reverbAmount + chorusAmount) * 0.1));
        wet.gain.value = 0.65;
        input.connect(dry);
        dry.connect(output);
        let node = input;

        if (bandpassAmount > 0) {
            const filter = context.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = 700 + bandpassAmount * 3800;
            filter.Q.value = 0.5 + bandpassAmount * 5;
            node.connect(filter);
            node = filter;
        }
        if (bassAmount > 0) {
            const bass = context.createBiquadFilter();
            bass.type = 'lowshelf';
            bass.frequency.value = 180;
            bass.gain.value = bassAmount * 12;
            node.connect(bass);
            node = bass;
        }
        if (trebleAmount > 0) {
            const treble = context.createBiquadFilter();
            treble.type = 'highshelf';
            treble.frequency.value = 4200;
            treble.gain.value = trebleAmount * 10;
            node.connect(treble);
            node = treble;
        }
        if (distortionAmount > 0) {
            const shaper = context.createWaveShaper();
            const curve = new Float32Array(2048);
            const amount = 1 + distortionAmount * 26;
            for (let i = 0; i < curve.length; i++) {
                const x = i * 2 / (curve.length - 1) - 1;
                curve[i] = ((Math.PI + amount) * x) / (Math.PI + amount * Math.abs(x));
            }
            shaper.curve = curve;
            shaper.oversample = '4x';
            node.connect(shaper);
            node = shaper;
        }
        node.connect(wet);

        if (chorusAmount > 0) {
            const chorus = context.createDelay(0.2);
            chorus.delayTime.value = 0.015 + chorusAmount * 0.03;
            const lfo = context.createOscillator();
            const depth = context.createGain();
            lfo.frequency.value = 0.45 + chorusAmount * 1.5;
            depth.gain.value = 0.004 + chorusAmount * 0.012;
            lfo.connect(depth);
            depth.connect(chorus.delayTime);
            wet.connect(chorus);
            chorus.connect(output);
            lfo.start();
            lfo.stop(Math.max(0.01, sourceBuffer.duration));
        }
        if (echoAmount > 0) {
            const delay = context.createDelay(2);
            const feedback = context.createGain();
            delay.delayTime.value = 0.08 + echoAmount * 0.48;
            feedback.gain.value = Math.min(0.72, echoAmount * 0.7);
            wet.connect(delay);
            delay.connect(feedback);
            feedback.connect(delay);
            delay.connect(output);
        }
        if (reverbAmount > 0) {
            const delay = context.createDelay(2);
            const feedback = context.createGain();
            delay.delayTime.value = 0.12 + reverbAmount * 0.5;
            feedback.gain.value = Math.min(0.68, reverbAmount * 0.62);
            wet.connect(delay);
            delay.connect(feedback);
            feedback.connect(delay);
            delay.connect(output);
        }
        wet.connect(output);
        output.connect(context.destination);

        const selectionStart = trimStart * sourceBuffer.duration;
        const selectionEnd = trimEnd * sourceBuffer.duration;
        source.start(0);
        context.startRendering();
        context.oncomplete = ({ renderedBuffer }) => {
            const rendered = renderedBuffer.getChannelData(0);
            this.submitNewSamples(rendered, renderedBuffer.sampleRate).then(success => {
                if (success) {
                    this.setState({
                        trimStart: selectionStart / (renderedBuffer.duration || 1),
                        trimEnd: selectionEnd / (renderedBuffer.duration || 1)
                    }, this.handlePlay);
                }
            });
        };
    }
    handleGenerateEffectMenu() {
        const menu = this.displayPopup('Generate Effect', 380, 440, 'Generate', 'Cancel', () => {
            const options = {};
            for (const control of controls) options[control.name] = Number(control.input.value) / 100;
            this.handleGeneratedEffect(options);
        });
        menu.textarea.style = 'padding: 14px; overflow-y: auto;';
        const controls = [];
        const addControl = (name, defaultValue = 0) => {
            const label = document.createElement('label');
            label.style = 'display:block;margin:10px 0;font-size:13px;';
            label.innerHTML = `<strong>${name}</strong> <span class="generate-effect-value">${defaultValue}%</span>`;
            const input = document.createElement('input');
            input.type = 'range';
            input.min = 0;
            input.max = 100;
            input.step = 1;
            input.value = defaultValue;
            input.style = 'width:100%;display:block;margin-top:6px;';
            input.oninput = () => {
                label.querySelector('.generate-effect-value').textContent = `${input.value}%`;
            };
            label.appendChild(input);
            menu.textarea.appendChild(label);
            controls.push({ name: name.toLowerCase(), input });
        };
        addControl('Bandpass', 0);
        addControl('Distortion', 0);
        addControl('Echo', 0);
        addControl('Reverb', 0);
        addControl('Chorus', 0);
        addControl('Bass', 0);
        addControl('Treble', 0);

        const hint = document.createElement('p');
        hint.style = 'font-size:12px;opacity:0.65;margin-top:12px;';
        hint.textContent = 'Mix several effects together. Higher percentages make that effect stronger.';
        menu.textarea.appendChild(hint);
    }
    handleUndo() {
        this.redoStack.push(this.getUndoItem());
        const { samples, sampleRate, trimStart, trimEnd } = this.undoStack.pop();
        if (samples) return this.submitNewSamples(samples, sampleRate, true).then(success => {
            if (success) this.setState({ trimStart: trimStart, trimEnd: trimEnd }, this.handlePlay);
        });
    }
    handleRedo() {
        const { samples, sampleRate, trimStart, trimEnd } = this.redoStack.pop();
        if (samples) {
            this.undoStack.push(this.getUndoItem());
            return this.submitNewSamples(samples, sampleRate, true).then(success => {
                if (success) this.setState({ trimStart: trimStart, trimEnd: trimEnd }, this.handlePlay);
            });
        }
    }
    handleCopy() { this.copy(); }
    copy(callback) {
        const trimStart = this.state.trimStart === null ? 0.0 : this.state.trimStart;
        const trimEnd = this.state.trimEnd === null ? 1.0 : this.state.trimEnd;
        const newCopyBuffer = this.copyCurrentBuffer();
        newCopyBuffer.samples = newCopyBuffer.samples.slice(trimStart * newCopyBuffer.samples.length, trimEnd * newCopyBuffer.samples.length);
        this.setState({ copyBuffer: newCopyBuffer }, callback);
    }
    getSelectionBuffer() {
        const trimStart = this.state.trimStart === null ? 0.0 : this.state.trimStart;
        const trimEnd = this.state.trimEnd === null ? 1.0 : this.state.trimEnd;
        const newCopyBuffer = this.copyCurrentBuffer();
        newCopyBuffer.samples = newCopyBuffer.samples.slice(trimStart * newCopyBuffer.samples.length, trimEnd * newCopyBuffer.samples.length);
        return newCopyBuffer;
    }
    handleCopyToNew() {
        this.copy(() => encodeAndAddSoundToVM(this.props.vm, this.state.copyBuffer.samples, this.state.copyBuffer.sampleRate, this.props.name));
    }
    handleCut() { this.copy(); this.handleDelete(); }
    handleCutToNew() {
        this.copy(() => encodeAndAddSoundToVM(this.props.vm, this.state.copyBuffer.samples, this.state.copyBuffer.sampleRate, this.props.name));
        this.handleDelete();
    }
    resampleBufferToRate(buffer, newRate) {
        return new Promise((resolve, reject) => {
            const sampleRateRatio = newRate / buffer.sampleRate;
            const newLength = sampleRateRatio * buffer.samples.length;
            let offlineContext;
            try {
                if (window.OfflineAudioContext) offlineContext = new window.OfflineAudioContext(1, newLength, newRate);
                else if (window.webkitOfflineAudioContext) offlineContext = new window.webkitOfflineAudioContext(1, newLength, newRate);
            } catch {
                if (newRate === buffer.sampleRate / 2) return resolve(dropEveryOtherSample(buffer));
                return reject(new Error('Could not resample'));
            }
            const source = offlineContext.createBufferSource();
            const audioBuffer = offlineContext.createBuffer(1, buffer.samples.length, buffer.sampleRate);
            audioBuffer.getChannelData(0).set(buffer.samples);
            source.buffer = audioBuffer;
            source.connect(offlineContext.destination);
            source.start();
            offlineContext.startRendering();
            offlineContext.oncomplete = ({ renderedBuffer }) => resolve({ samples: renderedBuffer.getChannelData(0), sampleRate: newRate });
        });
    }
    paste() {
        const { samples } = this.copyCurrentBuffer();
        if (this.state.trimStart === null) {
            const newLength = samples.length + this.state.copyBuffer.samples.length;
            const newSamples = new Float32Array(newLength);
            newSamples.set(samples, 0);
            newSamples.set(this.state.copyBuffer.samples, samples.length);
            this.submitNewSamples(newSamples, this.props.sampleRate, false).then(success => { if (success) this.handlePlay(); });
        } else {
            const trimStartSamples = this.state.trimStart * samples.length;
            const trimEndSamples = this.state.trimEnd * samples.length;
            const firstPart = samples.slice(0, trimStartSamples);
            const lastPart = samples.slice(trimEndSamples);
            const newLength = firstPart.length + this.state.copyBuffer.samples.length + lastPart.length;
            const newSamples = new Float32Array(newLength);
            newSamples.set(firstPart, 0);
            newSamples.set(this.state.copyBuffer.samples, firstPart.length);
            newSamples.set(lastPart, firstPart.length + this.state.copyBuffer.samples.length);
            const trimStartSeconds = trimStartSamples / this.props.sampleRate;
            const trimEndSeconds = trimStartSeconds + (this.state.copyBuffer.samples.length / this.state.copyBuffer.sampleRate);
            const newDurationSeconds = newSamples.length / this.state.copyBuffer.sampleRate;
            const adjustedTrimStart = trimStartSeconds / newDurationSeconds;
            const adjustedTrimEnd = trimEndSeconds / newDurationSeconds;
            this.submitNewSamples(newSamples, this.props.sampleRate, false).then(success => {
                if (success) this.setState({ trimStart: adjustedTrimStart, trimEnd: adjustedTrimEnd }, this.handlePlay);
            });
        }
    }
    handlePaste() {
        if (!this.state.copyBuffer) return;
        if (this.state.copyBuffer.sampleRate === this.props.sampleRate) this.paste();
        else this.resampleBufferToRate(this.state.copyBuffer, this.props.sampleRate).then(buffer => this.setState({ copyBuffer: buffer }, this.paste));
    }
    setRef(element) { this.ref = element; }
    handleContainerClick(e) { if (e.target === this.ref && this.state.trimStart !== null) this.handleUpdateTrim(null, null); }
    handleModifyMenu() {
        const bufferSelection = this.getSelectionBuffer();
        const audio = new AudioContext();
        const gainNode = audio.createGain();
        gainNode.gain.value = 1;
        gainNode.connect(audio.destination);
        const pitch = document.createElement("input");
        const volume = document.createElement("input");
        const menu = this.displayPopup("Modify Sound", 200, 280, "Apply", "Cancel", () => {
            audio.close();
            const truePitch = isNaN(Number(pitch.value)) ? 0 : Number(pitch.value);
            const trueVolume = isNaN(Number(volume.value)) ? 0 : Number(volume.value);
            this.handleEffect({ pitch: truePitch * 10, volume: trueVolume });
        }, () => audio.close());
        menu.textarea.style = "position: relative;display: flex;justify-content: flex-end;flex-direction: row;height: calc(100% - (3.125em + 2.125em + 16px));align-items: center;";
        pitch.type = "range"; pitch.classList.add(confirmStyles.verticalSlider); pitch.style = "position: absolute;left: -40px;top: 80px;"; pitch.value = 0; pitch.min = -360; pitch.max = 360; pitch.step = 1;
        volume.type = "range"; volume.classList.add(confirmStyles.verticalSlider); volume.style = "position: absolute;left: 0px;top: 80px;"; volume.value = 1; volume.min = 0; volume.max = 2; volume.step = 0.01;
        menu.textarea.append(pitch); menu.textarea.append(volume);
        const labelPitch = document.createElement("p"); const labelVolume = document.createElement("p");
        labelPitch.style = "text-align: center;width: 35px;font-size: 12px;position: absolute;left: 7.5px;top: 3.5px;"; labelVolume.style = "text-align: center;width: 35px;font-size: 12px;position: absolute;left: 47.5px;top: 3.5px;";
        labelPitch.innerHTML = "Pitch"; labelVolume.innerHTML = "Volume"; menu.textarea.append(labelPitch); menu.textarea.append(labelVolume);
        const valuePitch = document.createElement("input"); const valueVolume = document.createElement("input");
        valuePitch.style = "text-align: center;width: 35px;font-size: 12px;position: absolute;left: 4px;top: 152.5px;"; valueVolume.style = "text-align: center;width: 35px;font-size: 12px;position: absolute;left: 44px;top: 152.5px;";
        valuePitch.value = 0; valueVolume.value = 100; valuePitch.min = -360; valuePitch.max = 360; valuePitch.step = 1; valueVolume.min = 0; valueVolume.max = 200; valueVolume.step = 1; valuePitch.type = "number"; valueVolume.type = "number";
        menu.textarea.append(valuePitch); menu.textarea.append(valueVolume);
        const previewButton = document.createElement("button"); previewButton.style = "font-weight: bold;color: white;border-radius: 1000px;width: 46px;margin-right: 28px;height: 46px;border-style: none;background: #76fa02;"; previewButton.innerHTML = "Play"; menu.textarea.append(previewButton);
        const properBuffer = audio.createBuffer(1, bufferSelection.samples.length, bufferSelection.sampleRate); properBuffer.getChannelData(0).set(bufferSelection.samples);
        let bufferSource; let audioPlaying = false;
        function play() { bufferSource = audio.createBufferSource(); bufferSource.connect(gainNode); bufferSource.buffer = properBuffer; bufferSource.start(0); bufferSource.detune.value = pitch.value * 10; previewButton.innerHTML = "Stop"; audioPlaying = true; bufferSource.onended = () => { previewButton.innerHTML = "Play"; audioPlaying = false; }; }
        function stop() { if (bufferSource) bufferSource.stop(); previewButton.innerHTML = "Play"; audioPlaying = false; }
        previewButton.onclick = () => { if (audioPlaying) return stop(); play(); };
        pitch.onchange = updateValue => { if (updateValue !== false) valuePitch.value = Number(pitch.value); if (!bufferSource) return; bufferSource.detune.value = pitch.value * 10; }; pitch.oninput = pitch.onchange;
        volume.onchange = updateValue => { gainNode.gain.value = volume.value; if (updateValue === false) return; valueVolume.value = Number(volume.value) * 100; }; volume.oninput = volume.onchange;
        valuePitch.onchange = () => { pitch.value = valuePitch.value; pitch.onchange(false); }; valuePitch.oninput = valuePitch.onchange;
        valueVolume.onchange = () => { volume.value = valueVolume.value / 100; volume.onchange(false); }; valueVolume.oninput = valueVolume.onchange;
    }
    handleFormatMenu() {
        const sampleRates = [3000, 4000, 8000, 11025, 16000, 22050, 32000, 44100, 48000, 88200, 96000, 176400, 192000, 352800, 384000];
        let selectedSampleRate = this.props.sampleRate; let selectedForceRate = false;
        const menu = this.displayPopup("Format Sound", 580, 300, "Apply", "Cancel", () => { const edits = {sampleRate: selectedSampleRate}; if (selectedForceRate) edits.sampleRateEnforced = selectedSampleRate; this.handleEffect(edits); });
        menu.textarea.style = "padding:8px;";
        const labelSampleRate = document.createElement("p"); labelSampleRate.innerHTML = "Sample Rate"; labelSampleRate.style = "font-size:14px;"; menu.textarea.append(labelSampleRate);
        const inputSampleRate = document.createElement("select"); inputSampleRate.style = "width:50%;"; menu.textarea.append(inputSampleRate);
        for (const rate of sampleRates) { const option = document.createElement("option"); option.value = rate; option.innerHTML = `${rate}`; inputSampleRate.append(option); }
        inputSampleRate.selectedIndex = sampleRates.indexOf(this.props.sampleRate);
        const labelSampleRateWarning = document.createElement("p"); labelSampleRateWarning.innerHTML = "Choosing a higher sample rate than the current rate will not make the existing audio higher quality."; labelSampleRateWarning.style = "font-size:13px;opacity:0.5;"; menu.textarea.append(labelSampleRateWarning);
        inputSampleRate.onchange = () => { selectedSampleRate = inputSampleRate.value; };
        const labelResampleAudio = document.createElement("label"); labelResampleAudio.innerHTML = "Enforce New Sample Rate"; menu.textarea.append(labelResampleAudio);
        const inputResampleAudio = document.createElement("input"); inputResampleAudio.type = "checkbox"; inputResampleAudio.style = "margin-right:8px;"; labelResampleAudio.prepend(inputResampleAudio);
        const labelResampleAudioWarning = document.createElement("p"); labelResampleAudioWarning.innerHTML = "This changes the properties of the entire sound, making lower sample rates use less file size. However, audio added to this sound will only be able to use the new sample rate."; labelResampleAudioWarning.style = "font-size:13px;opacity:0.5;"; menu.textarea.append(labelResampleAudioWarning);
        const warning = document.createElement("p"); warning.innerHTML = "Applying these changes will cause the entire sound to change, not just the selected area."; warning.style = "font-size:14px;"; warning.style.display = "none"; menu.textarea.append(warning);
        inputResampleAudio.onchange = () => { selectedForceRate = inputResampleAudio.checked; warning.style.display = selectedForceRate ? "" : "none"; };
    }
    displayPopup(title, width, height, okname, denyname, accepted, cancelled) {
        const div = document.createElement("div"); document.body.append(div); div.classList.add(confirmStyles.base);
        const box = document.createElement("div"); div.append(box); box.classList.add(confirmStyles.promptBox); box.style.width = `${width}px`; box.style.height = `${height}px`;
        const header = document.createElement("div"); box.append(header); header.classList.add(confirmStyles.header); header.innerText = title;
        const textarea = document.createElement("div"); box.append(textarea);
        const buttonRow = document.createElement("div"); box.append(buttonRow); buttonRow.classList.add(confirmStyles.buttonRow);
        const deny = document.createElement("button"); buttonRow.append(deny); deny.classList.add(confirmStyles.promptButton); deny.classList.add(confirmStyles.deny); deny.innerHTML = denyname ? denyname : "Cancel";
        const accept = document.createElement("button"); buttonRow.append(accept); accept.classList.add(confirmStyles.promptButton); accept.classList.add(confirmStyles.accept); accept.innerHTML = okname ? okname : "OK";
        accept.onclick = () => { div.remove(); if (accepted) accepted(); }; deny.onclick = () => { div.remove(); if (cancelled) cancelled(); };
        return {popup: div, container: box, header: header, buttonRow: buttonRow, textarea: textarea, cancel: deny, ok: accept};
    }
    handleBitCrushMenu() {
        const bufferSelection = this.getSelectionBuffer(); const audio = new AudioContext(); const gainNode = audio.createGain(); gainNode.gain.value = 1; gainNode.connect(audio.destination);
        const bitcrush = document.createElement("input"); const freqcrush = document.createElement("input");
        const menu = this.displayPopup("Bit-Crush", 240, 280, "Apply", "Cancel", () => { audio.close(); const trueBitCrush = isNaN(Number(bitcrush.value)) ? 0.5 : Number(bitcrush.value); const trueFreqCrush = isNaN(Number(freqcrush.value)) ? 0.5 : Number(freqcrush.value); this.handleEffect({special: true, bitcrush: trueBitCrush, freqcrush: trueFreqCrush}); }, () => audio.close());
        menu.textarea.style = "position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 24px; height: calc(100% - (3.125em + 2.125em + 16px));";
        bitcrush.type = "range"; bitcrush.classList.add(confirmStyles.verticalSlider); bitcrush.style = "position: absolute;left: -40px;top: 80px;"; bitcrush.value = 0.5; bitcrush.min = 0; bitcrush.max = 1; bitcrush.step = 0.01;
        freqcrush.type = "range"; freqcrush.classList.add(confirmStyles.verticalSlider); freqcrush.style = "position: absolute;left: 0px;top: 80px;"; freqcrush.value = 0.5; freqcrush.min = 0; freqcrush.max = 1; freqcrush.step = 0.01;
        menu.textarea.append(bitcrush); menu.textarea.append(freqcrush);
        const labelBitCrush = document.createElement("p"); const labelFreqCrush = document.createElement("p"); labelBitCrush.style = "text-align: center;width: 35px;font-size: 12px;position: absolute;left: 7.5px;top: 3.5px;"; labelFreqCrush.style = "text-align: center;width: 35px;font-size: 12px;position: absolute;left: 47.5px;top: 3.5px;"; labelBitCrush.innerHTML = "Bit Crush"; labelFreqCrush.innerHTML = "Freq Crush"; menu.textarea.append(labelBitCrush); menu.textarea.append(labelFreqCrush);
        const valueBitCrush = document.createElement("input"); const valueFreqCrush = document.createElement("input"); valueBitCrush.style = "text-align: center;width: 35px;font-size: 12px;position: absolute;left: 4px;top: 152.5px;"; valueFreqCrush.style = "text-align: center;width: 35px;font-size: 12px;position: absolute;left: 44px;top: 152.5px;"; valueBitCrush.value = 50; valueFreqCrush.value = 50; valueBitCrush.min = 0; valueBitCrush.max = 100; valueBitCrush.step = 1; valueFreqCrush.min = 0; valueFreqCrush.max = 100; valueFreqCrush.step = 1; valueBitCrush.type = "number"; valueFreqCrush.type = "number"; menu.textarea.append(valueBitCrush); menu.textarea.append(valueFreqCrush);
        const previewButton = document.createElement("button"); previewButton.style = "font-weight: bold; color: white; border-radius: 1000px; width: 60px; height: 36px; border: none; background: #76fa02; margin-top: 12px;"; previewButton.innerText = "Play"; menu.textarea.appendChild(previewButton);
        const properBuffer = audio.createBuffer(1, bufferSelection.samples.length, bufferSelection.sampleRate); properBuffer.getChannelData(0).set(bufferSelection.samples); let bufferSource; let audioPlaying = false; let bitCrushEffectNode;
        function createBitCrushEffect(audioContext, bitCrush = 0.5, freqCrush = 0.5) { const input = audioContext.createGain(); const output = audioContext.createGain(); const processor = audioContext.createScriptProcessor(4096, 1, 1); bitCrush = Math.max(0, Math.min(1, bitCrush)); freqCrush = Math.max(0, Math.min(1, freqCrush)); const bitCrushStrength = Math.abs(bitCrush - 0.5) * 2; const freqCrushStrength = Math.abs(freqCrush - 0.5) * 2; const bitDepth = bitCrushStrength === 0 ? 16 : Math.max(1, 16 - Math.floor(bitCrushStrength * 15)); const sampleHold = freqCrushStrength === 0 ? 1 : Math.floor(1 + freqCrushStrength * 100); const step = 1 / Math.pow(2, bitDepth); let holdCounter = 0; let lastSample = 0; processor.onaudioprocess = event => { const inData = event.inputBuffer.getChannelData(0); const outData = event.outputBuffer.getChannelData(0); for (let i = 0; i < inData.length; i++) { if (holdCounter <= 0) { holdCounter = sampleHold; lastSample = step * Math.floor(inData[i] / step + 0.5); } else holdCounter--; outData[i] = lastSample; } }; input.connect(processor); processor.connect(output); return {input, output}; }
        bitCrushEffectNode = createBitCrushEffect(audio, Number(bitcrush.value), Number(freqcrush.value));
        function play() { bufferSource = audio.createBufferSource(); bufferSource.buffer = properBuffer; bufferSource.connect(bitCrushEffectNode.input); bitCrushEffectNode.output.connect(gainNode); bufferSource.start(); previewButton.innerText = "Stop"; audioPlaying = true; bufferSource.onended = () => { previewButton.innerText = "Play"; audioPlaying = false; }; }
        function stop() { if (bufferSource) bufferSource.stop(); previewButton.innerText = "Play"; audioPlaying = false; }
        previewButton.onclick = () => { if (audioPlaying) stop(); else play(); };
        bitcrush.onchange = updateValue => { if (updateValue !== false) valueBitCrush.value = Number(bitcrush.value) * 100; }; bitcrush.oninput = bitcrush.onchange; freqcrush.onchange = updateValue => { if (updateValue !== false) valueFreqCrush.value = Number(freqcrush.value) * 100; }; freqcrush.oninput = freqcrush.onchange; valueBitCrush.onchange = () => { bitcrush.value = valueBitCrush.value / 100; bitcrush.onchange(false); }; valueBitCrush.oninput = valueBitCrush.onchange; valueFreqCrush.onchange = () => { freqcrush.value = valueFreqCrush.value / 100; freqcrush.onchange(false); }; valueFreqCrush.oninput = valueFreqCrush.onchange;
    }
    getUndoItem() { return { ...this.copyCurrentBuffer(), trimStart: this.state.trimStart, trimEnd: this.state.trimEnd }; }
    render() {
        const { effectTypes } = AudioEffects;
        return <SoundEditorComponent
            isStereo={this.props.isStereo} duration={this.props.duration} size={this.props.size} sampleRate={this.props.sampleRate} dataFormat={this.props.dataFormat}
            canPaste={this.state.copyBuffer !== null} canRedo={this.redoStack.length > 0} canUndo={this.undoStack.length > 0} chunkLevels={this.state.chunkLevels}
            name={this.props.name} playhead={this.state.playhead} setRef={this.setRef} tooLoud={this.tooLoud()} trimEnd={this.state.trimEnd} trimStart={this.state.trimStart}
            onChangeName={this.handleChangeName} onContainerClick={this.handleContainerClick} onCopy={this.handleCopy} onCopyToNew={this.handleCopyToNew} onCut={this.handleCut} onCutToNew={this.handleCutToNew} onDelete={this.handleDelete}
            onEcho={this.effectFactory(effectTypes.ECHO)} onTelephone={this.effectFactory(effectTypes.TELEPHONE)} onAlien={this.effectFactory(effectTypes.ALIEN)} onDistortion={this.effectFactory(effectTypes.DISTORTION)} onVocoder={this.effectFactory(effectTypes.VOCODER)}
            onLowBattery={this.effectFactory(effectTypes.LOWBATTERY)} onNoiseReduction={this.effectFactory(effectTypes.NOISEREDUCTION)} onFlashback={this.effectFactory(effectTypes.FLASHBACK)} onLoudBreaths={this.effectFactory(effectTypes.LOUDBREATHS)} onMetalPipes={this.effectFactory(effectTypes.METALPIPES)}
            onDJWarp={this.effectFactory(effectTypes.DJWARP)} onBackpackRadio={this.effectFactory(effectTypes.BACKPACKRADIO)} onBAndWTV={this.effectFactory(effectTypes.BANDWTV)} onMicMalfunction={this.effectFactory(effectTypes.MICMALFUNCTION)} onElectroShift={this.effectFactory(effectTypes.ELECTROSHIFT)}
            onDistortedMic={this.effectFactory(effectTypes.DISTORTEDMIC)} onNormalize={this.effectFactory(effectTypes.NORMALIZE)} onFadeIn={this.effectFactory(effectTypes.FADEIN)} onFadeOut={this.effectFactory(effectTypes.FADEOUT)} onFaster={this.effectFactory(effectTypes.FASTER)}
            onLouder={this.effectFactory(effectTypes.LOUDER)} onModifySound={this.handleModifyMenu} onFormatSound={this.handleFormatMenu} onMute={this.effectFactory(effectTypes.MUTE)} onPaste={this.handlePaste} onPlay={this.handlePlay} onRedo={this.handleRedo}
            onReverse={this.effectFactory(effectTypes.REVERSE)} onRobot={this.effectFactory(effectTypes.ROBOT)} onLowPass={this.effectFactory(effectTypes.LOWPASS)} onHighPass={this.effectFactory(effectTypes.HIGHPASS)} onMegaphone={this.effectFactory(effectTypes.MEGAPHONE)}
            onTremble={this.effectFactory(effectTypes.TREMBLE)} onReverb={this.effectFactory(effectTypes.REVERB)} onBitCrush={this.handleBitCrushMenu} onHigherPitch={this.effectFactory(effectTypes.HIGHPITCH)} onLowerPitch={this.effectFactory(effectTypes.LOWPITCH)}
            onSetTrim={this.handleUpdateTrim} onSlower={this.effectFactory(effectTypes.SLOWER)} onSofter={this.effectFactory(effectTypes.SOFTER)} onStop={this.handleStopPlaying} onUndo={this.handleUndo}
        />;
    }
    tooLoud() { const numChunks = this.state.chunkLevels.length; const startIndex = this.state.trimStart === null ? 0 : Math.floor(this.state.trimStart * numChunks); const endIndex = this.state.trimEnd === null ? numChunks - 1 : Math.ceil(this.state.trimEnd * numChunks); const trimChunks = this.state.chunkLevels.slice(startIndex, endIndex); let max = 0; for (const i of trimChunks) if (i > max) max = i; return max > MAX_RMS; }
}

SoundEditor.propTypes = { isStereo: PropTypes.bool, duration: PropTypes.number, dataFormat: PropTypes.number, size: PropTypes.number, isFullScreen: PropTypes.bool, name: PropTypes.string.isRequired, sampleRate: PropTypes.number, samples: PropTypes.instanceOf(Float32Array), soundId: PropTypes.string, soundIndex: PropTypes.number, vm: PropTypes.instanceOf(VM).isRequired };

const mapStateToProps = (state, { soundIndex }) => { const sprite = state.scratchGui.vm.editingTarget.sprite; const index = soundIndex < sprite.sounds.length ? soundIndex : sprite.sounds.length - 1; const sound = state.scratchGui.vm.editingTarget.sprite.sounds[index]; const audioBuffer = state.scratchGui.vm.getSoundBuffer(index); return { isStereo: audioBuffer.numberOfChannels !== 1, duration: sound.sampleCount / sound.rate, size: sound.asset ? sound.asset.data.byteLength : 0, soundId: sound.soundId, dataFormat: sound.dataFormat, sampleRate: audioBuffer.sampleRate, samples: audioBuffer.getChannelData(0), isFullScreen: state.scratchGui.mode.isFullScreen, name: sound.name, vm: state.scratchGui.vm }; };

export default connect(mapStateToProps)(SoundEditor);
