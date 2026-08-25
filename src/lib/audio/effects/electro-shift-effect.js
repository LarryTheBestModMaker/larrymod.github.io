class ElectroShiftEffect {
    constructor(audioContext) {
        this.audioContext = audioContext;

        this.input = audioContext.createGain();
        this.output = audioContext.createGain();

        // Remove excessive low frequencies
        this.highpass = audioContext.createBiquadFilter();
        this.highpass.type = "highpass";
        this.highpass.frequency.value = 120;

        // Electronic presence
        this.presence = audioContext.createBiquadFilter();
        this.presence.type = "peaking";
        this.presence.frequency.value = 1800;
        this.presence.Q.value = 1.4;
        this.presence.gain.value = 6;

        // Bright electronic tone
        this.highShelf = audioContext.createBiquadFilter();
        this.highShelf.type = "highshelf";
        this.highShelf.frequency.value = 4500;
        this.highShelf.gain.value = 5;

        // Synthetic distortion
        this.distortion = audioContext.createWaveShaper();
        this.distortion.curve = this.createCurve(4);
        this.distortion.oversample = "4x";

        // Short electronic delay
        this.delay = audioContext.createDelay(1);
        this.delay.delayTime.value = 0.025;

        this.feedback = audioContext.createGain();
        this.feedback.gain.value = 0.25;

        this.wetGain = audioContext.createGain();
        this.wetGain.gain.value = 0.35;

        this.dryGain = audioContext.createGain();
        this.dryGain.gain.value = 0.65;

        // Dry path
        this.input.connect(this.dryGain);
        this.dryGain.connect(this.output);

        // Effect path
        this.input.connect(this.highpass);
        this.highpass.connect(this.presence);
        this.presence.connect(this.highShelf);
        this.highShelf.connect(this.distortion);
        this.distortion.connect(this.delay);
        this.delay.connect(this.wetGain);
        this.wetGain.connect(this.output);

        // Delay feedback
        this.delay.connect(this.feedback);
        this.feedback.connect(this.delay);
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

export default ElectroShiftEffect;