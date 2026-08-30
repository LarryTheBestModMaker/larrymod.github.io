class TubeTVEffect {
    constructor (audioContext, startSeconds, endSeconds) {
        this.audioContext = audioContext;

        this.input = this.audioContext.createGain();
        this.output = this.audioContext.createGain();

        this.highpass = this.audioContext.createBiquadFilter();
        this.highpass.type = "highpass";
        this.highpass.frequency.value = 180;
        this.highpass.Q.value = 0.7;

        this.lowpass = this.audioContext.createBiquadFilter();
        this.lowpass.type = "lowpass";
        this.lowpass.frequency.value = 4200;
        this.lowpass.Q.value = 0.8;

        // Old television-style midrange coloration.
        this.midrange = this.audioContext.createBiquadFilter();
        this.midrange.type = "peaking";
        this.midrange.frequency.value = 1200;
        this.midrange.Q.value = 1.0;
        this.midrange.gain.value = 4;

        // Slight tube-style saturation.
        this.tube = this.audioContext.createWaveShaper();
        this.tube.curve = this.createTubeCurve(4);
        this.tube.oversample = "2x";

        this.compressor = this.audioContext.createDynamicsCompressor();
        this.compressor.threshold.value = -22;
        this.compressor.knee.value = 10;
        this.compressor.ratio.value = 3;
        this.compressor.attack.value = 0.01;
        this.compressor.release.value = 0.18;

        this.input.connect(this.highpass);
        this.highpass.connect(this.lowpass);
        this.lowpass.connect(this.midrange);
        this.midrange.connect(this.tube);
        this.tube.connect(this.compressor);
        this.compressor.connect(this.output);

        this.output.gain.setValueAtTime(0, startSeconds);
        this.output.gain.linearRampToValueAtTime(1, startSeconds + 0.01);
        this.output.gain.setValueAtTime(1, endSeconds);
    }

    createTubeCurve (amount) {
        const samples = 44100;
        const curve = new Float32Array(samples);

        for (let i = 0; i < samples; i++) {
            const x = (i * 2) / samples - 1;
            curve[i] = Math.tanh(x * amount) / Math.tanh(amount);
        }

        return curve;
    }
}

export default TubeTVEffect;