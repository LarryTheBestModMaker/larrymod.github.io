class OldTelephoneEffect {
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

        const filter = audioContext.createBiquadFilter();
        filter.type = 'peaking';
        filter.frequency.value = 1400;
        filter.Q.value = 0.8;
        filter.gain.value = 3;
        node.connect(filter);
        node = filter;

        const delay = audioContext.createDelay(2);
        delay.delayTime.value = 0.28;
        const feedback = audioContext.createGain();
        feedback.gain.value = 0.38;
        node.connect(delay);
        delay.connect(feedback);
        feedback.connect(delay);
        delay.connect(wet);
        node.connect(wet);

        wet.connect(this.output);

        this.output.gain.setValueAtTime(0, startSeconds);
        this.output.gain.linearRampToValueAtTime(1, startSeconds + 0.02);
        this.output.gain.setValueAtTime(1, Math.max(startSeconds + 0.021, endSeconds - 0.02));
        this.output.gain.linearRampToValueAtTime(0, endSeconds);
    }
}

export default OldTelephoneEffect;
