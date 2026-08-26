class SurroundBlastEffect {
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

        const delayL = audioContext.createDelay(0.1);
        const delayR = audioContext.createDelay(0.1);
        delayL.delayTime.value = 0.012;
        delayR.delayTime.value = 0.019;
        node.connect(delayL);
        node.connect(delayR);
        const merge = audioContext.createGain();
        delayL.connect(merge);
        delayR.connect(merge);
        merge.connect(wet);

        wet.connect(this.output);

        this.output.gain.setValueAtTime(0, startSeconds);
        this.output.gain.linearRampToValueAtTime(1, startSeconds + 0.02);
        this.output.gain.setValueAtTime(1, Math.max(startSeconds + 0.021, endSeconds - 0.02));
        this.output.gain.linearRampToValueAtTime(0, endSeconds);
    }
}

export default SurroundBlastEffect;
