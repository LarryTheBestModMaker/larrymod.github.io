class BadSignalEffect {
    constructor(audioContext) {
        this.audioContext = audioContext;

        this.input = audioContext.createGain();
        this.output = audioContext.createGain();

        // Narrow radio/phone frequency range
        this.highpass = audioContext.createBiquadFilter();
        this.highpass.type = "highpass";
        this.highpass.frequency.value = 500;
        this.highpass.Q.value = 0.8;

        this.lowpass = audioContext.createBiquadFilter();
        this.lowpass.type = "lowpass";
        this.lowpass.frequency.value = 3000;
        this.lowpass.Q.value = 0.8;

        // Mild signal distortion
        this.distortion = audioContext.createWaveShaper();
        this.distortion.curve = this.createCurve(4);
        this.distortion.oversample = "2x";

        // Subtle unstable signal modulation
        this.tremolo = audioContext.createGain();
        this.tremolo.gain.value = 0.85;

        this.lfo = audioContext.createOscillator();
        this.lfoGain = audioContext.createGain();

        this.lfo.frequency.value = 7;
        this.lfoGain.gain.value = 0.12;

        this.lfo.connect(this.lfoGain);
        this.lfoGain.connect(this.tremolo.gain);

        this.lfo.start();

        // Wiring
        this.input.connect(this.highpass);
        this.highpass.connect(this.lowpass);
        this.lowpass.connect(this.distortion);
        this.distortion.connect(this.tremolo);
        this.tremolo.connect(this.output);
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

export default BadSignalEffect;