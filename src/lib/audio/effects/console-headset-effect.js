class ConsoleHeadsetEffect {
    constructor (audioContext, startSeconds, endSeconds) {
        this.audioContext = audioContext;

        this.input = this.audioContext.createGain();
        this.output = this.audioContext.createGain();

        // Headset-style frequency range
        this.highpass = this.audioContext.createBiquadFilter();
        this.highpass.type = "highpass";
        this.highpass.frequency.value = 180;
        this.highpass.Q.value = 0.7;

        this.lowpass = this.audioContext.createBiquadFilter();
        this.lowpass.type = "lowpass";
        this.lowpass.frequency.value = 6500;
        this.lowpass.Q.value = 0.7;

        // Console/headset midrange presence
        this.presence = this.audioContext.createBiquadFilter();
        this.presence.type = "peaking";
        this.presence.frequency.value = 2200;
        this.presence.Q.value = 1.1;
        this.presence.gain.value = 4;

        // Slight headset coloration
        this.saturation = this.audioContext.createWaveShaper();
        this.saturation.curve = this.createSaturationCurve(8);
        this.saturation.oversample = "2x";

        // Keep the voice controlled and clear
        this.compressor = this.audioContext.createDynamicsCompressor();
        this.compressor.threshold.value = -18;
        this.compressor.knee.value = 8;
        this.compressor.ratio.value = 3;
        this.compressor.attack.value = 0.005;
        this.compressor.release.value = 0.12;

        this.input.connect(this.highpass);
        this.highpass.connect(this.lowpass);
        this.lowpass.connect(this.presence);
        this.presence.connect(this.saturation);
        this.saturation.connect(this.compressor);
        this.compressor.connect(this.output);

        // Smoothly enable the effect over the selected range.
        this.output.gain.setValueAtTime(0, startSeconds);
        this.output.gain.linearRampToValueAtTime(1, startSeconds + 0.01);
        this.output.gain.setValueAtTime(1, endSeconds);
    }

    createSaturationCurve (amount) {
        const samples = 44100;
        const curve = new Float32Array(samples);

        for (let i = 0; i < samples; i++) {
            const x = (i * 2) / samples - 1;
            curve[i] = Math.tanh(x * amount);
        }

        return curve;
    }
}

export default ConsoleHeadsetEffect;