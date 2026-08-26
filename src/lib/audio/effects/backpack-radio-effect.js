class BackpackRadioEffect {
    constructor(audioContext) {
        this.audioContext = audioContext;

        this.input = audioContext.createGain();
        this.output = audioContext.createGain();

        // Portable-radio frequency range
        this.highpass = audioContext.createBiquadFilter();
        this.highpass.type = "highpass";
        this.highpass.frequency.value = 250;

        this.lowpass = audioContext.createBiquadFilter();
        this.lowpass.type = "lowpass";
        this.lowpass.frequency.value = 4200;

        // Radio-style midrange emphasis
        this.presence = audioContext.createBiquadFilter();
        this.presence.type = "peaking";
        this.presence.frequency.value = 1400;
        this.presence.Q.value = 1;
        this.presence.gain.value = 5;

        // Mild radio distortion
        this.distortion = audioContext.createWaveShaper();
        this.distortion.curve = this.createCurve(18);
        this.distortion.oversample = "2x";

        // Compression
        this.compressor = audioContext.createDynamicsCompressor();
        this.compressor.threshold.value = -18;
        this.compressor.knee.value = 8;
        this.compressor.ratio.value = 4;
        this.compressor.attack.value = 0.003;
        this.compressor.release.value = 0.12;

        // Output level
        this.outputGain = audioContext.createGain();
        this.outputGain.gain.value = 0.8;

        // Wiring
        this.input.connect(this.highpass);
        this.highpass.connect(this.lowpass);
        this.lowpass.connect(this.presence);
        this.presence.connect(this.distortion);
        this.distortion.connect(this.compressor);
        this.compressor.connect(this.outputGain);
        this.outputGain.connect(this.output);
    }

    createCurve(amount) {
        const samples = 44100;
        const curve = new Float32Array(samples);

        for (let i = 0; i < samples; i++) {
            const x = (i * 2) / samples - 1;
            curve[i] = Math.tanh(amount * x) / Math.tanh(amount);
        }

        return curve;
    }
}

export default BackpackRadioEffect;