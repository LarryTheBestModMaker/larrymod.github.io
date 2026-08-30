class DroneSpeakerEffect {
    constructor (audioContext, startSeconds, endSeconds) {
        this.audioContext = audioContext;

        this.input = this.audioContext.createGain();
        this.output = this.audioContext.createGain();

        this.highpass = this.audioContext.createBiquadFilter();
        this.highpass.type = "highpass";
        this.highpass.frequency.value = 120;
        this.highpass.Q.value = 0.7;

        this.lowpass = this.audioContext.createBiquadFilter();
        this.lowpass.type = "lowpass";
        this.lowpass.frequency.value = 4200;
        this.lowpass.Q.value = 0.8;

        this.resonance = this.audioContext.createBiquadFilter();
        this.resonance.type = "peaking";
        this.resonance.frequency.value = 250;
        this.resonance.Q.value = 1.2;
        this.resonance.gain.value = 6;

        this.distortion = this.audioContext.createWaveShaper();
        this.distortion.curve = this.createDistortionCurve(10);
        this.distortion.oversample = "2x";

        this.compressor = this.audioContext.createDynamicsCompressor();
        this.compressor.threshold.value = -20;
        this.compressor.knee.value = 8;
        this.compressor.ratio.value = 4;
        this.compressor.attack.value = 0.005;
        this.compressor.release.value = 0.15;

        this.input.connect(this.highpass);
        this.highpass.connect(this.lowpass);
        this.lowpass.connect(this.resonance);
        this.resonance.connect(this.distortion);
        this.distortion.connect(this.compressor);
        this.compressor.connect(this.output);

        this.output.gain.setValueAtTime(0, startSeconds);
        this.output.gain.linearRampToValueAtTime(1, startSeconds + 0.01);
        this.output.gain.setValueAtTime(1, endSeconds);
    }

    createDistortionCurve (amount) {
        const samples = 44100;
        const curve = new Float32Array(samples);

        for (let i = 0; i < samples; i++) {
            const x = (i * 2) / samples - 1;
            curve[i] = Math.tanh(x * amount);
        }

        return curve;
    }
}

export default DroneSpeakerEffect;