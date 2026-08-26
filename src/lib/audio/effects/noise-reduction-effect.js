class NoiseReductionEffect {
    constructor(audioContext, startSeconds, endSeconds) {
        this.audioContext = audioContext;

        this.input = this.audioContext.createGain();
        this.output = this.audioContext.createGain();

        // --- Highpass (remove rumble / low noise) ---
        this.highpass = this.audioContext.createBiquadFilter();
        this.highpass.type = "highpass";

        // --- Lowpass (remove hiss) ---
        this.lowpass = this.audioContext.createBiquadFilter();
        this.lowpass.type = "lowpass";

        // --- Noise gate via compressor ---
        this.compressor = this.audioContext.createDynamicsCompressor();

        // Frequency cleanup
        this.highpass.frequency.setValueAtTime(80, startSeconds);
        this.lowpass.frequency.setValueAtTime(10000, startSeconds);

        // Compressor tuned like a noise gate
        this.compressor.threshold.setValueAtTime(-50, startSeconds);
        this.compressor.knee.setValueAtTime(0, startSeconds);
        this.compressor.ratio.setValueAtTime(20, startSeconds);
        this.compressor.attack.setValueAtTime(0.005, startSeconds);
        this.compressor.release.setValueAtTime(0.1, startSeconds);

        // Smooth activation
        this.output.gain.setValueAtTime(1, startSeconds);
        this.output.gain.setValueAtTime(1, endSeconds);

        // --- Wiring ---
        this.input.connect(this.highpass);
        this.highpass.connect(this.lowpass);
        this.lowpass.connect(this.compressor);
        this.compressor.connect(this.output);
    }
}

export default NoiseReductionEffect;