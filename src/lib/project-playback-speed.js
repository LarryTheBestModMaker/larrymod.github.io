/*
 * Project playback speed controller.
 *
 * The VM's framerate controls how often scripts are stepped, but the Web Audio
 * API has its own clock. This module keeps the two in sync for fast-forward
 * playback and intentionally uses playbackRate so pitch rises with speed.
 */

const NORMAL_SPEED = 1;
const BASE_FRAMERATE = 30;
const SPEEDS = [2, 4, 8];

let speed = NORMAL_SPEED;
let audioPatched = false;
let originalCreateBufferSource = null;

const getAudioContexts = vm => {
    const contexts = [];
    const audioEngine = vm && vm.runtime && vm.runtime.audioEngine;
    if (audioEngine && audioEngine.audioContext) contexts.push(audioEngine.audioContext);
    if (audioEngine && audioEngine.context && audioEngine.context !== audioEngine.audioContext) {
        contexts.push(audioEngine.context);
    }
    return contexts;
};

const applyToContextSources = (context, value) => {
    if (!context || !context.__larrymodPlaybackSources) return;
    context.__larrymodPlaybackSources.forEach(source => {
        try {
            source.playbackRate.value = value;
        } catch (e) {
            // A source may have already been released by the audio engine.
        }
    });
};

const patchAudioBufferSources = () => {
    if (audioPatched || typeof AudioContext === 'undefined') return;

    originalCreateBufferSource = AudioContext.prototype.createBufferSource;
    AudioContext.prototype.createBufferSource = function () {
        const source = originalCreateBufferSource.call(this);
        if (!this.__larrymodPlaybackSources) this.__larrymodPlaybackSources = new Set();
        this.__larrymodPlaybackSources.add(source);

        const remove = () => {
            if (this.__larrymodPlaybackSources) this.__larrymodPlaybackSources.delete(source);
        };
        source.addEventListener('ended', remove, {once: true});
        source.playbackRate.value = speed;
        return source;
    };

    audioPatched = true;
};

export const getPlaybackSpeed = () => speed;

export const getNextPlaybackSpeed = current => {
    if (current === NORMAL_SPEED) return SPEEDS[0];
    const index = SPEEDS.indexOf(current);
    return SPEEDS[(index + 1) % SPEEDS.length];
};

export const setPlaybackSpeed = (vm, nextSpeed) => {
    const numericSpeed = Number(nextSpeed);
    speed = SPEEDS.indexOf(numericSpeed) === -1 ? NORMAL_SPEED : numericSpeed;

    patchAudioBufferSources();

    if (vm && vm.runtime) {
        const runtime = vm.runtime;
        const framerate = BASE_FRAMERATE * speed;

        // Use the VM's actual frame loop when available. This changes script
        // stepping as well as rendering rather than merely changing the UI FPS.
        if (runtime.frameLoop && typeof runtime.frameLoop.setFramerate === 'function') {
            runtime.frameLoop.setFramerate(framerate);
        } else if (typeof vm.setFramerate === 'function') {
            vm.setFramerate(framerate);
        }

        getAudioContexts(vm).forEach(context => applyToContextSources(context, speed));
    }

    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('larrymod-project-playback-speed', {
            detail: {speed}
        }));
    }

    return speed;
};

export const resetPlaybackSpeed = vm => setPlaybackSpeed(vm, NORMAL_SPEED);

export const constants = {
    NORMAL_SPEED,
    BASE_FRAMERATE,
    SPEEDS
};

export default {
    getPlaybackSpeed,
    getNextPlaybackSpeed,
    setPlaybackSpeed,
    resetPlaybackSpeed,
    constants
};