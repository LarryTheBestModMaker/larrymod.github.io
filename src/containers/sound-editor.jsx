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
            'handleDeleteInverse',
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
            'handleBackpackRadioWarning',
            'handleDistortedMicWarning',
            'handleFormatMenu',
            'handleBitCrushMenu',
            'getSelectionBuffer'
        ]);
        this.state = {
            copyBuffer: null,
            chunkLevels: computeChunkedRMS(this.props.samples),
            playhead: null, // null is not playing, [0 -> 1] is playing percent
            trimStart: null,
            trimEnd: null
        };

        this.redoStack = [];
        this.undoStack = [];

        this.ref = null;
    }
    componentDidMount() {
        this.audioBufferPlayer = new AudioBufferPlayer(this.props.samples, this.props.sampleRate);
        // Do not register a document-level keyboard handler here. The Sound
        // Editor must never hijack Space or ordinary letter keys while a sound
        // is open. This lets text entry and normal browser/app keyboard input
        // work without playing, trimming, undoing, or modifying the sound.
    }
    componentWillReceiveProps(newProps) {
        if (newProps.soundId !== this.props.soundId) { // A different sound has been selected
            this.redoStack = [];
            this.undoStack = [];
            this.resetState(newProps.samples, newProps.sampleRate);
            this.setState({
                trimStart: null,
                trimEnd: null
            });
        }
    }
    componentWillUnmount() {
        this.audioBufferPlayer.stop();
    }
    handleKeyPress(event) {
        // Kept for compatibility with callers that may still reference this
        // method, but intentionally does nothing. Sound Editor keyboard input
        // must never control or alter the open sound.
        return event;
    }
    resetState(samples, sampleRate) {
        this.audioBufferPlayer.stop();
        this.audioBufferPlayer = new AudioBufferPlayer(samples, sampleRate);
        this.setState({
            chunkLevels: computeChunkedRMS(samples),
            playhead: null
        });
    }
    submitNewSamples(samples, sampleRate, skipUndo) {
        return downsampleIfNeeded({ samples, sampleRate }, this.resampleBufferToRate)
            .then(({ samples: newSamples, sampleRate: newSampleRate }) =>
                WavEncoder.encode({
                    sampleRate: newSampleRate,
                    channelData: [newSamples]
                }).then(wavBuffer => {
                    if (!skipUndo) {
                        this.redoStack = [];
                        if (this.undoStack.length >= UNDO_STACK_SIZE) {
                            this.undoStack.shift(); // Drop the first element off the array
                        }
                        this.undoStack.push(this.getUndoItem());
                    }
                    this.resetState(newSamples, newSampleRate);
                    this.props.vm.updateSoundBuffer(
                        this.props.soundIndex,
                        this.audioBufferPlayer.buffer,
                        new Uint8Array(wavBuffer));
                    return true; // Edit was successful
                })
            )
            .catch(e => {
                // Encoding failed, or the sound was too large to save so edit is rejected
                log.error(`Encountered error while trying to encode sound update: ${e.message}`);
                return false; // Edit was not applied
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
        if (newLength === 0) {
            newSamples = new Float32Array(1);
        } else {
            newSamples = new Float32Array(newLength);
            newSamples.set(firstPart, 0);
            newSamples.set(secondPart, firstPart.length);
        }
        this.submitNewSamples(newSamples, sampleRate).then(() => {
            this.setState({
                trimStart: null,
                trimEnd: null
            });
        });
    }
    handleDeleteInverse() {
        // Delete everything outside of the trimmers
        const { samples, sampleRate } = this.copyCurrentBuffer();
        const sampleCount = samples.length;
        const startIndex = Math.floor(this.state.trimStart * sampleCount);
        const endIndex = Math.floor(this.state.trimEnd * sampleCount);
        let clippedSamples = samples.slice(startIndex, endIndex);
        if (clippedSamples.length === 0) {
            clippedSamples = new Float32Array(1);
        }
        this.submitNewSamples(clippedSamples, sampleRate).then(success => {
            if (success) {
                this.setState({
                    trimStart: null,
                    trimEnd: null
                });
            }
        });
    }
    handleUpdateTrim(trimStart, trimEnd) {
        this.setState({ trimStart, trimEnd });
        this.handleStopPlaying();
    }
    effectFactory(name) {
        return () => this.handleEffect({
            preset: name,
        });
    }
    copyCurrentBuffer() {
        // Cannot reliably use props.samples because it gets detached by Firefox
        return {
            samples: this.audioBufferPlayer.buffer.getChannelData(0),
            sampleRate: this.audioBufferPlayer.buffer.sampleRate
        };
    }
    handleEffect(options) {
        const trimStart = this.state.trimStart === null ? 0.0 : this.state.trimStart;
        const trimEnd = this.state.trimEnd === null ? 1.0 : this.state.trimEnd;

        // Offline audio context needs at least 2 samples
        if (this.audioBufferPlayer.buffer.length < 2) {
            return;
        }

        const effects = new AudioEffects(this.audioBufferPlayer.buffer, options, trimStart, trimEnd);
        effects.process((renderedBuffer, adjustedTrimStart, adjustedTrimEnd) => {
            const samples = renderedBuffer.getChannelData(0);
            const sampleRate = renderedBuffer.sampleRate;
            this.submitNewSamples(samples, sampleRate).then(success => {
                if (success) {
                    if (this.state.trimStart === null) {
                        this.handlePlay();
                    } else {
                        this.setState({ trimStart: adjustedTrimStart, trimEnd: adjustedTrimEnd }, this.handlePlay);
                    }
                }
            });
        });
    }
    tooLoud() {
        const numChunks = this.state.chunkLevels.length;
        const startIndex = this.state.trimStart === null ?
            0 : Math.floor(this.state.trimStart * numChunks);
        const endIndex = this.state.trimEnd === null ?
            numChunks - 1 : Math.ceil(this.state.trimEnd * numChunks);
        const trimChunks = this.state.chunkLevels.slice(startIndex, endIndex);
        let max = 0;
        for (const i of trimChunks) {
            if (i > max) {
                max = i;
            }
        }
        return max > MAX_RMS;
    }
    getUndoItem() {
        return {
            ...this.copyCurrentBuffer(),
            trimStart: this.state.trimStart,
            trimEnd: this.state.trimEnd
        };
    }
    handleUndo() {
        this.redoStack.push(this.getUndoItem());
        const { samples, sampleRate, trimStart, trimEnd } = this.undoStack.pop();
        if (samples) {
            return this.submitNewSamples(samples, sampleRate, true).then(success => {
                if (success) {
                    this.setState({ trimStart: trimStart, trimEnd: trimEnd }, this.handlePlay);
                }
            });
        }
    }
    handleRedo() {
        const { samples, sampleRate, trimStart, trimEnd } = this.redoStack.pop();
        if (samples) {
            this.undoStack.push(this.getUndoItem());
            return this.submitNewSamples(samples, sampleRate, true).then(success => {
                if (success) {
                    this.setState({ trimStart: trimStart, trimEnd: trimEnd }, this.handlePlay);
                }
            });
        }
    }
    handleCopy() {
        this.copy();
    }
    copy(callback) {
        const trimStart = this.state.trimStart === null ? 0.0 : this.state.trimStart;
        const trimEnd = this.state.trimEnd === null ? 1.0 : this.state.trimEnd;

        const newCopyBuffer = this.copyCurrentBuffer();
        const trimStartSamples = trimStart * newCopyBuffer.samples.length;
        const trimEndSamples = trimEnd * newCopyBuffer.samples.length;
        newCopyBuffer.samples = newCopyBuffer.samples.slice(trimStartSamples, trimEndSamples);

        this.setState({
            copyBuffer: newCopyBuffer
        }, callback);
    }
    getSelectionBuffer() {
        const trimStart = this.state.trimStart === null ? 0.0 : this.state.trimStart;
        const trimEnd = this.state.trimEnd === null ? 1.0 : this.state.trimEnd;

        const newCopyBuffer = this.copyCurrentBuffer();
        const trimStartSamples = trimStart * newCopyBuffer.samples.length;
        const trimEndSamples = trimEnd * newCopyBuffer.samples.length;
        newCopyBuffer.samples = newCopyBuffer.samples.slice(trimStartSamples, trimEndSamples);

        return newCopyBuffer;
    }
    handleCopyToNew() {
        this.copy(() => {
            encodeAndAddSoundToVM(this.props.vm, this.state.copyBuffer.samples,
                this.state.copyBuffer.sampleRate, this.props.name);
        });
    }
    handleCut() {
        this.copy();
        this.handleDelete();
    }
    handleCutToNew() {
        this.copy(() => {
            encodeAndAddSoundToVM(this.props.vm, this.state.copyBuffer.samples,
                this.state.copyBuffer.sampleRate, this.props.name);
        });
        this.handleDelete();
    }
    resampleBufferToRate(buffer, newRate) {
        return new Promise((resolve, reject) => {
            const sampleRateRatio = newRate / buffer.sampleRate;
            const newLength = sampleRateRatio * buffer.samples.length;
            let offlineContext;
            try {
                if (window.OfflineAudioContext) {
                    offlineContext = new window.OfflineAudioContext(1, newLength, newRate);
                } else if (window.webkitOfflineAudioContext) {
                    offlineContext = new window.webkitOfflineAudioContext(1, newLength, newRate);
                }
            } catch {
                if (newRate === buffer.sampleRate / 2) {
                    return resolve(dropEveryOtherSample(buffer));
                }
                return reject(new Error('Could not resample'));
            }
            const source = offlineContext.createBufferSource();
            const audioBuffer = offlineContext.createBuffer(1, buffer.samples.length, buffer.sampleRate);
            audioBuffer.getChannelData(0).set(buffer.samples);
            source.buffer = audioBuffer;
            source.connect(offlineContext.destination);
            source.start();
            offlineContext.startRendering();
            offlineContext.oncomplete = ({ renderedBuffer }) => {
                resolve({
                    samples: renderedBuffer.getChannelData(0),
                    sampleRate: newRate
                });
            };
        });
    }
    paste() {
        const { samples } = this.copyCurrentBuffer();
        if (this.state.trimStart === null) {
            const newLength = samples.length + this.state.copyBuffer.samples.length;
            const newSamples = new Float32Array(newLength);
            newSamples.set(samples, 0);
            newSamples.set(this.state.copyBuffer.samples, samples.length);
            this.submitNewSamples(newSamples, this.props.sampleRate, false).then(success => {
                if (success) {
                    this.handlePlay();
                }
            });
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
            const trimEndSeconds = trimStartSeconds +
                (this.state.copyBuffer.samples.length / this.state.copyBuffer.sampleRate);
            const newDurationSeconds = newSamples.length / this.state.copyBuffer.sampleRate;
            const adjustedTrimStart = trimStartSeconds / newDurationSeconds;
            const adjustedTrimEnd = trimEndSeconds / newDurationSeconds;
            this.submitNewSamples(newSamples, this.props.sampleRate, false).then(success => {
                if (success) {
                    this.setState({
                        trimStart: adjustedTrimStart,
                        trimEnd: adjustedTrimEnd
                    }, this.handlePlay);
                }
            });
        }
    }
    handlePaste() {
        if (!this.state.copyBuffer) return;
        if (this.state.copyBuffer.sampleRate === this.props.sampleRate) {
            this.paste();
        } else {
            this.resampleBufferToRate(this.state.copyBuffer, this.props.sampleRate).then(buffer => {
                this.setState({
                    copyBuffer: buffer
                }, this.paste);
            });
        }
    }
    setRef(element) {
        this.ref = element;
    }
    handleContainerClick(e) {
        if (e.target === this.ref && this.state.trimStart !== null) {
            this.handleUpdateTrim(null, null);
        }
    }
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
            this.handleEffect({
                pitch: truePitch * 10,
                volume: trueVolume
            });
        }, () => {
            audio.close();
        });
        menu.textarea.style = "position: relative;display: flex;justify-content: flex-end;flex-direction: row;height: calc(100% - (3.125em + 2.125em + 16px));align-items: center;";
        pitch.type = "range";
        pitch.classList.add(confirmStyles.verticalSlider);
        pitch.style = "position: absolute;left: -40px;top: 80px;";
        pitch.value = 0;
        pitch.min = -360;
        pitch.max = 360;
        pitch.step = 1;
        volume.type = "range";
        volume.classList.add(confirmStyles.verticalSlider);
        volume.style = "position: absolute;left: 0px;top: 80px;";
        volume.value = 1;
        volume.min = 0;
        volume.max = 2;
        volume.step = 0.01;
        menu.textarea.append(pitch);
        menu.textarea.append(volume);
        const labelPitch = document.createElement("p");
        const labelVolume = document.createElement("p");
        labelPitch.style = "text-align: center;width: 35px;font-size: 12px;position: absolute;left: 7.5px;top: 3.5px;";
        labelVolume.style = "text-align: center;width: 35px;font-size: 12px;position: absolute;left: 47.5px;top: 3.5px;";
        labelPitch.innerHTML = "Pitch";
        labelVolume.innerHTML = "Volume";
        menu.textarea.append(labelPitch);
        menu.textarea.append(labelVolume);
        const valuePitch = document.createElement("input");
        const valueVolume = document.createElement("input");
        valuePitch.style = "text-align: center;width: 35px;font-size: 12px;position: absolute;left: 4px;top: 152.5px;";
        valueVolume.style = "text-align: center;width: 35px;font-size: 12px;position: absolute;left: 44px;top: 152.5px;";
        valuePitch.value = 0;
        valueVolume.value = 100;
        valuePitch.min = -360;
        valuePitch.max = 360;
        valuePitch.step = 1;
        valueVolume.min = 0;
        valueVolume.max = 200;
        valueVolume.step = 1;
        valuePitch.type = "number";
        valueVolume.type = "number";
        menu.textarea.append(valuePitch);
        menu.textarea.append(valueVolume);
        const previewButton = document.createElement("button");
        previewButton.style = "font-weight: bold;color: white;border-radius: 1000px;width: 46px;margin-right: 28px;height: 46px;border-style: none;background: #76fa02;";
        previewButton.innerHTML = "Play";
        menu.textarea.append(previewButton);
        const properBuffer = audio.createBuffer(1, bufferSelection.samples.length, bufferSelection.sampleRate);
        properBuffer.getChannelData(0).set(bufferSelection.samples);
        let bufferSource;
        let audioPlaying = false;
        function play() {
            bufferSource = audio.createBufferSource();
            bufferSource.connect(gainNode);
            bufferSource.buffer = properBuffer;
            bufferSource.start(0);
            bufferSource.detune.value = pitch.value * 10;
            previewButton.innerHTML = "Stop";
            audioPlaying = true;
            bufferSource.onended = () => {
                previewButton.innerHTML = "Play";
                audioPlaying = false;
            }
        }
        function stop() {
            bufferSource.stop();
            previewButton.innerHTML = "Play";
            audioPlaying = false;
        }
        previewButton.onclick = () => {
            if (audioPlaying) {
                return stop();
            }
            play();
        }
        pitch.onchange = (updateValue) => {
            if (updateValue !== false) {
                valuePitch.value = Number(pitch.value);
            };
            if (!bufferSource) return;
            bufferSource.detune.value = pitch.value * 10;
        }
        pitch.oninput = pitch.onchange;
        volume.onchange = (updateValue) => {
            gainNode.gain.value = volume.value;
            if (updateValue === false) return;
            valueVolume.value = Number(volume.value) * 100;
        }
        volume.oninput = volume.onchange;
        valuePitch.onchange = () => {
            pitch.value = valuePitch.value;
            pitch.onchange(false);
        };
        valuePitch.oninput = valuePitch.onchange;
        valueVolume.onchange = () => {
            volume.value = valueVolume.value / 100;
            volume.onchange(false);
        };
        valueVolume.oninput = valueVolume.onchange;
    }
    handleBackpackRadioWarning() {
    const menu = this.displayPopup(
        "Warning!",
        420,
        240,
        "Continue anyway",
        "Do not continue",
        () => {
            // Apply Backpack Radio only after the user confirms.
            this.handleEffect({
                preset: AudioEffects.effectTypes.BACKPACKRADIO
            });
        },
        () => {
            // User chose not to continue.
            return;
        }
    );

    menu.textarea.style =
        "padding: 20px;display:flex;align-items:center;" +
        "justify-content:center;text-align:center;";

    const warning = document.createElement("p");

    warning.style =
        "margin:0;font-size:15px;line-height:1.5;" +
        "font-weight:500;";

    warning.innerHTML =
        "The 'Backpack Radio' effect is very distorted and loud. " +
        "Its intensity and level are too high and can cause " +
        "eardrum damage. Are you sure you want to apply this " +
        "effect to it?";

    menu.textarea.append(warning);
}
    handleDistortedMicWarning() {
    const menu = this.displayPopup(
        "Warning!",
        420,
        240,
        "Continue anyway",
        "Do not continue",
        () => {
            // Apply Distorted Mic only after the user confirms.
            this.handleEffect({
                preset: AudioEffects.effectTypes.DISTORTEDMIC
            });
        },
        () => {
            // User chose not to continue.
            return;
        }
    );

    menu.textarea.style =
        "padding: 20px;display:flex;align-items:center;" +
        "justify-content:center;text-align:center;";

    const warning = document.createElement("p");

    warning.style =
        "margin:0;font-size:15px;line-height:1.5;" +
        "font-weight:500;";

    warning.innerHTML =
        "The 'Distorted Mic' effect is very distorted and loud. " +
        "Its intensity and level are too high and can cause " +
        "eardrum damage. Are you sure you want to apply this " +
        "effect to it?";

    menu.textarea.append(warning);
}
    handleFormatMenu() {
        const sampleRates = [
            3000, 4000, 8000, 11025, 16000, 22050, 32000, 44100,
            48000, 88200, 96000, 176400, 192000, 352800, 384000,
        ];
        let selectedSampleRate = this.props.sampleRate;
        let selectedForceRate = false;
        const menu = this.displayPopup("Format Sound", 580, 300, "Apply", "Cancel", () => {
            const edits = {
                sampleRate: selectedSampleRate,
            };
            if (selectedForceRate) {
                edits.sampleRateEnforced = selectedSampleRate;
            }
            this.handleEffect(edits);
        });

        menu.textarea.style = "padding:8px;";

        const labelSampleRate = document.createElement("p");
        labelSampleRate.innerHTML = "Sample Rate";
        labelSampleRate.style = "font-size:14px;";
        menu.textarea.append(labelSampleRate);
        const inputSampleRate = document.createElement("select");
        inputSampleRate.style = "width:50%;"
        menu.textarea.append(inputSampleRate);
        for (const rate of sampleRates) {
            const option = document.createElement("option");
            option.value = rate;
            option.innerHTML = `${rate}`;
            inputSampleRate.append(option);
        }
        inputSampleRate.selectedIndex = sampleRates.indexOf(this.props.sampleRate);
        const labelSampleRateWarning = document.createElement("p");
        labelSampleRateWarning.innerHTML = "Choosing a higher sample rate than the current rate will not make the existing audio higher quality.";
        labelSampleRateWarning.style = "font-size:13px;opacity:0.5;";
        menu.textarea.append(labelSampleRateWarning);
        inputSampleRate.onchange = () => {
            selectedSampleRate = inputSampleRate.value;
        };

        const labelResampleAudio = document.createElement("label");
        labelResampleAudio.innerHTML = "Enforce New Sample Rate";
        menu.textarea.append(labelResampleAudio);
        const inputResampleAudio = document.createElement("input");
        inputResampleAudio.type = "checkbox";
        inputResampleAudio.style = "margin-right:8px;";
        labelResampleAudio.prepend(inputResampleAudio);
        const labelResampleAudioWarning = document.createElement("p");
        labelResampleAudioWarning.innerHTML = "This changes the properties of the entire sound, "
            + "making lower sample rates use less file size. "
            + "However, audio added to this sound will only be able to use the new sample rate.";
        labelResampleAudioWarning.style = "font-size:13px;opacity:0.5;";
        menu.textarea.append(labelResampleAudioWarning);

        const warning = document.createElement("p");
        warning.innerHTML = "Applying these changes will cause the entire sound to change, not just the selected area.";
        warning.style = "font-size:14px;";
        warning.style.display = "none";
        menu.textarea.append(warning);

        inputResampleAudio.onchange = () => {
            selectedForceRate = inputResampleAudio.checked;
            if (selectedForceRate) {
                warning.style.display = "";
            } else {
                warning.style.display = "none";
            }
        };
    }

    // TODO: use actual scratch-gui menus instead of this
    displayPopup(title, width, height, okname, denyname, accepted, cancelled) {
        const div = document.createElement("div");
        document.body.append(div);
        div.classList.add(confirmStyles.base);
        const box = document.createElement("div");
        div.append(box);
        box.classList.add(confirmStyles.promptBox);
        box.style.width = `${width}px`;
        box.style.height = `${height}px`;
        const header = document.createElement("div");
        box.append(header);
        header.classList.add(confirmStyles.header);
        header.innerText = title;
        const textarea = document.createElement("div");
        box.append(textarea);
        const buttonRow = document.createElement("div");
        box.append(buttonRow);
        buttonRow.classList.add(confirmStyles.buttonRow);
        const deny = document.createElement("button");
        buttonRow.append(deny);
        deny.classList.add(confirmStyles.promptButton);
        deny.classList.add(confirmStyles.deny);
        deny.innerHTML = denyname ? denyname : "Cancel";
        const accept = document.createElement("button");
        buttonRow.append(accept);
        accept.classList.add(confirmStyles.promptButton);
        accept.classList.add(confirmStyles.accept);
        accept.innerHTML = okname ? okname : "OK";
        accept.onclick = () => {
            div.remove();
            if (accepted) accepted();
        }
        deny.onclick = () => {
            div.remove();
            if (cancelled) cancelled();
        }
        return {
            popup: div,
            container: box,
            header: header,
            buttonRow: buttonRow,
            textarea: textarea,
            cancel: deny,
            ok: accept
        }
    }
    handleBitCrushMenu() {
        const bufferSelection = this.getSelectionBuffer();
        const audio = new AudioContext();
        const gainNode = audio.createGain();
        gainNode.gain.value = 1;
        gainNode.connect(audio.destination);

        const bitcrush = document.createElement("input");
        const freqcrush = document.createElement("input");

        const menu = this.displayPopup("Bit-Crush", 240, 280, "Apply", "Cancel", () => {
            audio.close();
            const trueBitCrush = isNaN(Number(bitcrush.value)) ? 0.5 : Number(bitcrush.value);
            const trueFreqCrush = isNaN(Number(freqcrush.value)) ? 0.5 : Number(freqcrush.value);

            this.handleEffect({
                special: true,
                    bitcrush: trueBitCrush,
                    freqcrush: trueFreqCrush
                });
            }, () => {
                audio.close();
        });

        menu.textarea.style = "position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 24px; height: calc(100% - (3.125em + 2.125em + 16px));";

        bitcrush.type = "range";
        bitcrush.classList.add(confirmStyles.verticalSlider);
        bitcrush.style = "position: absolute;left: -40px;top: 80px;";
        bitcrush.value = 0.5;
        bitcrush.min = 0;
        bitcrush.max = 1;
        bitcrush.step = 0.01;
        
        freqcrush.type = "range";
        freqcrush.classList.add(confirmStyles.verticalSlider);
        freqcrush.style = "position: absolute;left: 0px;top: 80px;";
        freqcrush.value = 0.5;
        freqcrush.min = 0;
        freqcrush.max = 1;
        freqcrush.step = 0.01;
        menu.textarea.append(bitcrush);
        menu.textarea.append(freqcrush);
        const labelBitCrush = document.createElement("p");
        const labelFreqCrush = document.createElement("p");
        labelBitCrush.style = "text-align: center;width: 35px;font-size: 12px;position: absolute;left: 7.5px;top: 3.5px;";
        labelFreqCrush.style = "text-align: center;width: 35px;font-size: 12px;position: absolute;left: 47.5px;top: 3.5px;";
        labelBitCrush.innerHTML = "Bit Crush";
        labelFreqCrush.innerHTML = "Freq Crush";
        menu.textarea.append(labelBitCrush);
        menu.textarea.append(labelFreqCrush);
        const valueBitCrush = document.createElement("input");
        const valueFreqCrush = document.createElement("input");
        valueBitCrush.style = "text-align: center;width: 35px;font-size: 12px;position: absolute;left: 4px;top: 152.5px;";
        valueFreqCrush.style = "text-align: center;width: 35px;font-size: 12px;position: absolute;left: 44px;top: 152.5px;";
        valueBitCrush.value = 50;
        valueFreqCrush.value = 50;
        valueBitCrush.min = 0;
        valueBitCrush.max = 100;
        valueBitCrush.step = 1;
        valueFreqCrush.min = 0;
        valueFreqCrush.max = 100;
        valueFreqCrush.step = 1;
        valueBitCrush.type = "number";
        valueFreqCrush.type = "number";
        menu.textarea.append(valueBitCrush);
        menu.textarea.append(valueFreqCrush);

        const previewButton = document.createElement("button");
        previewButton.style = "font-weight: bold; color: white; border-radius: 1000px; width: 60px; height: 36px; border: none; background: #76fa02; margin-top: 12px;";
        previewButton.innerText = "Play";
        menu.textarea.appendChild(previewButton);

        const properBuffer = audio.createBuffer(1, bufferSelection.samples.length, bufferSelection.sampleRate);
        properBuffer.getChannelData(0).set(bufferSelection.samples);

        let bufferSource;
        let audioPlaying = false;
        let bitCrushEffectNode;

        function createBitCrushEffect(audioContext, bitCrush = 0.5, freqCrush = 0.5) {
            const input = audioContext.createGain();
            const output = audioContext.createGain();

            const bufferSize = 4096;
            const processor = audioContext.createScriptProcessor(bufferSize, 1, 1);

            bitCrush = Math.max(0, Math.min(1, bitCrush));
            freqCrush = Math.max(0, Math.min(1, freqCrush));

            const bitCrushStrength = Math.abs(bitCrush - 0.5) * 2;
            const freqCrushStrength = Math.abs(freqCrush - 0.5) * 2;

            const maxBitDepth = 16;
            const minBitDepth = 1;
            const bitDepth = bitCrushStrength === 0
                ? 16
                : Math.max(minBitDepth, 16 - Math.floor(bitCrushStrength * (maxBitDepth - minBitDepth)));

            const maxHold = 100;
            const sampleHold = freqCrushStrength === 0
                ? 1
                : Math.floor(1 + freqCrushStrength * maxHold);

            const step = 1 / Math.pow(2, bitDepth);
            let holdCounter = 0;
            let lastSample = 0;

            processor.onaudioprocess = function (event) {
                const inputBuffer = event.inputBuffer.getChannelData(0);
                const outputBuffer = event.outputBuffer.getChannelData(0);

                for (let i = 0; i < inputBuffer.length; i++) {
                    if (holdCounter <= 0) {
                        holdCounter = sampleHold;
                        lastSample = step * Math.floor(inputBuffer[i] / step + 0.5);
                    } else {
                        holdCounter--;
                    }
                    outputBuffer[i] = lastSample;
                }
            };

            input.connect(processor);
            processor.connect(output);

            return { input, output };
        }

        bitCrushEffectNode = createBitCrushEffect(audio, Number(bitcrush.value), Number(freqcrush.value));

        function play() {
            bufferSource = audio.createBufferSource();
            bufferSource.buffer = properBuffer;
            bufferSource.connect(bitCrushEffectNode.input);
            bitCrushEffectNode.output.connect(gainNode);
            bufferSource.start();
            previewButton.innerText = "Stop";
            audioPlaying = true;
            bufferSource.onended = () => {
                previewButton.innerText = "Play";
                audioPlaying = false;
            };
        }

        function stop() {
            if (bufferSource) bufferSource.stop();
            previewButton.innerText = "Play";
            audioPlaying = false;
        }

        previewButton.onclick = () => {
            if (audioPlaying) stop();
            else play();
        };

        bitcrush.onchange = (updateValue) => {
            if (updateValue !== false) {
                valueBitCrush.value = Number(bitcrush.value) * 100;
            };
            if (!bufferSource) return;
        }
        bitcrush.oninput = bitcrush.onchange;
        freqcrush.onchange = (updateValue) => {
            if (updateValue === false) return;
            valueFreqCrush.value = Number(freqcrush.value) * 100;
        }
        freqcrush.oninput = freqcrush.onchange;
        valueBitCrush.onchange = () => {
            bitcrush.value = valueBitCrush.value / 100;
            bitcrush.onchange(false);
        };
        valueBitCrush.oninput = valueBitCrush.onchange;
        valueFreqCrush.onchange = () => {
            freqcrush.value = valueFreqCrush.value / 100;
            freqcrush.onchange(false);
        };
        valueFreqCrush.oninput = valueFreqCrush.onchange;
    }
    render() {
        const { effectTypes } = AudioEffects;
        return (
            <SoundEditorComponent
                isStereo={this.props.isStereo}
                duration={this.props.duration}
                size={this.props.size}
                sampleRate={this.props.sampleRate}
                dataFormat={this.props.dataFormat}
                canPaste={this.state.copyBuffer !== null}
                canRedo={this.redoStack.length > 0}
                canUndo={this.undoStack.length > 0}
                chunkLevels={this.state.chunkLevels}
                name={this.props.name}
                playhead={this.state.playhead}
                setRef={this.setRef}
                tooLoud={this.tooLoud()}
                trimEnd={this.state.trimEnd}
                trimStart={this.state.trimStart}
                onChangeName={this.handleChangeName}
                onContainerClick={this.handleContainerClick}
                onCopy={this.handleCopy}
                onCopyToNew={this.handleCopyToNew}
                onCut={this.handleCut}
                onCutToNew={this.handleCutToNew}
                onDelete={this.handleDelete}
                onDeleteInverse={this.handleDeleteInverse}
                onEcho={this.effectFactory(effectTypes.ECHO)}
                onTelephone={this.effectFactory(effectTypes.TELEPHONE)}
                onAlien={this.effectFactory(effectTypes.ALIEN)}
                onDistortion={this.effectFactory(effectTypes.DISTORTION)}
                onVocoder={this.effectFactory(effectTypes.VOCODER)}
                onLowBattery={this.effectFactory(effectTypes.LOWBATTERY)}
                onNoiseReduction={this.effectFactory(effectTypes.NOISEREDUCTION)}
                onFlashback={this.effectFactory(effectTypes.FLASHBACK)}
                onLoudBreaths={this.effectFactory(effectTypes.LOUDBREATHS)}
                onMetalPipes={this.effectFactory(effectTypes.METALPIPES)}
                onDJWarp={this.effectFactory(effectTypes.DJWARP)}
                onBackpackRadio={this.handleBackpackRadioWarning}
                onBAndWTV={this.effectFactory(effectTypes.BANDWTV)}
                onMicMalfunction={this.effectFactory(effectTypes.MICMALFUNCTION)}
                onElectroShift={this.effectFactory(effectTypes.ELECTROSHIFT)}
                onDistortedMic={this.handleDistortedMicWarning}
                onNormalize={this.effectFactory(effectTypes.NORMALIZE)}
                onTransceiver={this.effectFactory(effectTypes.TRANSCEIVER)}
                onBassBoost={this.effectFactory(effectTypes.BASSBOOST)}
                onHipHop={this.effectFactory(effectTypes.HIPHOP)}
                onRAndB={this.effectFactory(effectTypes.RANDB)}
                onReggae={this.effectFactory(effectTypes.REGGAE)}
                onJazz={this.effectFactory(effectTypes.JAZZ)}
                onFolk={this.effectFactory(effectTypes.FOLK)}
                onConsoleHeadset={this.effectFactory(effectTypes.CONSOLEHEADSET)}
                onFadeIn={this.effectFactory(effectTypes.FADEIN)}
                onFadeOut={this.effectFactory(effectTypes.FADEOUT)}
                onFaster={this.effectFactory(effectTypes.FASTER)}
                onLouder={this.effectFactory(effectTypes.LOUDER)}
                onModifySound={this.handleModifyMenu}
                onFormatSound={this.handleFormatMenu}
                onMute={this.effectFactory(effectTypes.MUTE)}
                onPaste={this.handlePaste}
                onPlay={this.handlePlay}
                onRedo={this.handleRedo}
                onReverse={this.effectFactory(effectTypes.REVERSE)}
                onRobot={this.effectFactory(effectTypes.ROBOT)}
                onLowPass={this.effectFactory(effectTypes.LOWPASS)}
                onHighPass={this.effectFactory(effectTypes.HIGHPASS)}
                onMegaphone={this.effectFactory(effectTypes.MEGAPHONE)}
                onTremble={this.effectFactory(effectTypes.TREMBLE)}
                onReverb={this.effectFactory(effectTypes.REVERB)}
                onBitCrush={this.handleBitCrushMenu}
                onHigherPitch={this.effectFactory(effectTypes.HIGHPITCH)}
                onLowerPitch={this.effectFactory(effectTypes.LOWPITCH)}
                onSetTrim={this.handleUpdateTrim}
                onSlower={this.effectFactory(effectTypes.SLOWER)}
                onSofter={this.effectFactory(effectTypes.SOFTER)}
                onStop={this.handleStopPlaying}
                onUndo={this.handleUndo}
            />
        );
    }
}

SoundEditor.propTypes = {
    isStereo: PropTypes.bool,
    duration: PropTypes.number,
    dataFormat: PropTypes.number,
    size: PropTypes.number,
    isFullScreen: PropTypes.bool,
    name: PropTypes.string.isRequired,
    sampleRate: PropTypes.number,
    samples: PropTypes.instanceOf(Float32Array),
    soundId: PropTypes.string,
    soundIndex: PropTypes.number,
    vm: PropTypes.instanceOf(VM).isRequired
};

const mapStateToProps = (state, { soundIndex }) => {
    const sprite = state.scratchGui.vm.editingTarget.sprite;
    const index = soundIndex < sprite.sounds.length ? soundIndex : sprite.sounds.length - 1;
    const sound = state.scratchGui.vm.editingTarget.sprite.sounds[index];
    const audioBuffer = state.scratchGui.vm.getSoundBuffer(index);
    return {
        isStereo: audioBuffer.numberOfChannels !== 1,
        duration: sound.sampleCount / sound.rate,
        size: sound.asset ? sound.asset.data.byteLength : 0,
        soundId: sound.soundId,
        dataFormat: sound.dataFormat,
        sampleRate: audioBuffer.sampleRate,
        samples: audioBuffer.getChannelData(0),
        isFullScreen: state.scratchGui.mode.isFullScreen,
        name: sound.name,
        vm: state.scratchGui.vm
    };
};

export default connect(
    mapStateToProps
)(SoundEditor);
