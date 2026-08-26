class GeneratedEffect {
    constructor (audioContext, startSeconds, endSeconds, options = {}) {
        this.audioContext = audioContext;
        this.input = audioContext.createGain();
        this.output = audioContext.createGain();

        const clamp = value => Math.max(0, Math.min(1, Number(value) || 0));
        const bandpassAmount = clamp(options.bandpass);
        const distortionAmount = clamp(options.distortion);
        const echoAmount = clamp(options.echo);
        const reverbAmount = clamp(options.reverb);
        const chorusAmount = clamp(options.chorus);
        const bassAmount = clamp(options.bass);
        const trebleAmount = clamp(options.treble);
        const volume = Math.max(0, Number(options.volume) || 1);

        const dry = audioContext.createGain();
        const wet = audioContext.createGain();
        dry.gain.value = Math.max(0.05, 1 - Math.min(0.9,
            (bandpassAmount + distortionAmount + echoAmount + reverbAmount + chorusAmount) * 0.14));
        wet.gain.value = 0.45;

        this.input.connect(dry);
        dry.connect(this.output);

        let node = this.input;

        if (bandpassAmount > 0) {
            const bandpass = audioContext.createBiquadFilter();
            bandpass.type = 'bandpass';
            bandpass.frequency.value = 900 + (bandpassAmount * 3500);
            bandpass.Q.value = 0.45 + (bandpassAmount * 5);
            node.connect(bandpass);
            node = bandpass;
        }

        if (bassAmount > 0) {
            const bass = audioContext.createBiquadFilter();
            bass.type = 'lowshelf';
            bass.frequency.value = 180;
            bass.gain.value = 12 * bassAmount;
            node.connect(bass);
            node = bass;
        }

        if (trebleAmount > 0) {
            const treble = audioContext.createBiquadFilter();
            treble.type = 'highshelf';
            treble.frequency.value = 4500;
            treble.gain.value = 10 * trebleAmount;
            node.connect(treble);
            node = treble;
        }

        if (distortionAmount > 0) {
            const shaper = audioContext.createWaveShaper();
            const curve = new Float32Array(2048);
            const amount = 1 + distortionAmount * 30;
            for (let i = 0; i < curve.length; i++) {
                const x = (i * 2 / (curve.length - 1)) - 1;
                curve[i] = ((Math.PI + amount) * x) / (Math.PI + amount * Math.abs(x));
            }
            shaper.curve = curve;
            shaper.oversample = '4x';
            node.connect(shaper);
            node = shaper;
        }

        if (chorusAmount > 0) {
            const chorusDelay = audioContext.createDelay(0.2);
            chorusDelay.delayTime.value = 0.018 + (chorusAmount * 0.025);
            const lfo = audioContext.createOscillator();
            const depth = audioContext.createGain();
            lfo.frequency.value = 0.4 + (chorusAmount * 1.6);
            depth.gain.value = 0.004 + (chorusAmount * 0.012);
            lfo.connect(depth);
            depth.connect(chorusDelay.delayTime);
            node.connect(chorusDelay);
            chorusDelay.connect(wet);
            lfo.start(startSeconds);
            lfo.stop(Math.max(startSeconds + 0.01, endSeconds));
        } else {
            node.connect(wet);
        }

        if (echoAmount > 0) {
            const delay = audioContext.createDelay(2);
            const feedback = audioContext.createGain();
            delay.delayTime.value = 0.08 + (echoAmount * 0.5);
            feedback.gain.value = Math.min(0.82, echoAmount * 0.78);
            wet.connect(delay);
            delay.connect(feedback);
            feedback.connect(delay);
            delay.connect(this.output);
        }

        if (reverbAmount > 0) {
            const reverbDelay = audioContext.createDelay(2);
            const feedback = audioContext.createGain();
            reverbDelay.delayTime.value = 0.12 + (reverbAmount * 0.55);
            feedback.gain.value = Math.min(0.75, reverbAmount * 0.68);
            wet.connect(reverbDelay);
            reverbDelay.connect(feedback);
            feedback.connect(reverbDelay);
            reverbDelay.connect(this.output);
        }

        wet.connect(this.output);

        this.output.gain.setValueAtTime(0, startSeconds);
        this.output.gain.linearRampToValueAtTime(volume, startSeconds + 0.02);
        this.output.gain.setValueAtTime(volume, Math.max(startSeconds + 0.021, endSeconds - 0.02));
        this.output.gain.linearRampToValueAtTime(0, endSeconds);
    }
}

export default GeneratedEffect;
