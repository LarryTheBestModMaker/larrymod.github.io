class SkippingEffect {
    constructor (audioContext, startSeconds, endSeconds) {
        this.audioContext = audioContext;
        this.input = audioContext.createGain();
        this.output = audioContext.createGain();

        const dry = audioContext.createGain();
        const wet = audioContext.createGain();
        dry.gain.value = 0.45;
        wet.gain.value = 0.55;

        this.input.connect(dry);
        dry.connect(this.output);

        let node = this.input;

        const shaper = audioContext.createWaveShaper();
        const curve = new Float32Array(1024);
        for (let i = 0; i < curve.length; i++) {
            const x = (i * 2 / (curve.length - 1)) - 1;
            curve[i] = Math.tanh(3.5 * x);
        }
        shaper.curve = curve;
        shaper.oversample = '2x';
        node.connect(shaper);
        node = shaper;

        const tone = audioContext.createBiquadFilter();
        tone.type = 'lowpass';
        tone.frequency.value = 15000;
        tone.Q.value = 0.35;
        node.connect(tone);
        tone.connect(wet);

        wet.connect(this.output);

        this.output.gain.setValueAtTime(0, startSeconds);
        this.output.gain.linearRampToValueAtTime(1, startSeconds + 0.02);
        this.output.gain.setValueAtTime(1, Math.max(startSeconds + 0.021, endSeconds - 0.02));
        this.output.gain.linearRampToValueAtTime(0, endSeconds);
    }
}

export default SkippingEffect;
