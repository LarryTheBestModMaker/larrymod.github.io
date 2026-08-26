class HuskyBackupEffect {
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

        const delay = audioContext.createDelay(0.2);
        delay.delayTime.value = 0.025;
        const lfo = audioContext.createOscillator();
        const lfoDepth = audioContext.createGain();
        lfo.frequency.value = 0.75;
        lfoDepth.gain.value = 0.01;
        lfo.connect(lfoDepth);
        lfoDepth.connect(delay.delayTime);
        node.connect(delay);
        delay.connect(wet);
        lfo.start(startSeconds);
        lfo.stop(Math.max(startSeconds + 0.01, endSeconds));

        wet.connect(this.output);

        this.output.gain.setValueAtTime(0, startSeconds);
        this.output.gain.linearRampToValueAtTime(1, startSeconds + 0.02);
        this.output.gain.setValueAtTime(1, Math.max(startSeconds + 0.021, endSeconds - 0.02));
        this.output.gain.linearRampToValueAtTime(0, endSeconds);
    }
}

export default HuskyBackupEffect;
