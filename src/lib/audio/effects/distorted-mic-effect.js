class DistortedMicEffect {
    constructor(audioContext) {
        this.audioContext = audioContext;

        this.input = audioContext.createGain();
        this.output = audioContext.createGain();

        // Remove low-frequency rumble
        this.highpass = audioContext.createBiquadFilter();
        this.highpass.type = "highpass";
        this.highpass.frequency.value = 180;

        // Emphasize microphone presence
        this.presence = audioContext.createBiquadFilter();
        this.presence.type = "peaking";
        this.presence.frequency.value = 2200;
        this.presence.Q.value = 1.1;
        this.presence.gain.value = 5;

        // Cheap-mic frequency limitation
        this.lowpass = audioContext.createBiquadFilter();
        this.lowpass.type = "lowpass";
        this.lowpass.frequency.value = 5500;

        // Aggressive clipping
        this.drive = audioContext.createGain();
        this.drive.gain.value = 5;

        this.distortion = audioContext.createWaveShaper();
        this.distortion.curve = this.createCurve(35);
        this.distortion.oversample = "4x";

        // Mic-style compression
        this.compressor = audioContext.createDynamicsCompressor();
        this.compressor.threshold.value = -24;
        this.compressor.knee.value = 5;
        this.compressor.ratio.value = 8;
        this.compressor.attack.value = 0.003;
        this.compressor.release.value = 0.08;

        this.outputGain = audioContext.createGain();
        this.outputGain.gain.value = 0.65;

        // Effect chain
        this.input.connect(this.highpass);
        this.highpass.connect(this.presence);
        this.presence.connect(this.lowpass);
        this.lowpass.connect(this.drive);
        this.drive.connect(this.distortion);
        this.distortion.connect(this.compressor);
        this.compressor.connect(this.outputGain);
        this.outputGain.connect(this.output);
    }

    createCurve(amount) {
        const samples = 44100;
        const curve = new Float32Array(samples);

        for (let i = 0; i < samples; i++) {
            const x = (i * 2) / samples - 1;

            curve[i] = Math.tanh(amount * x);
        }

        return curve;
    }
}

export default DistortedMicEffect;