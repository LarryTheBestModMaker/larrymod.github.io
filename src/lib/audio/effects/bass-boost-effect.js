class BassBoostEffect {
    constructor (audioContext, startSeconds, endSeconds) {
        this.audioContext = audioContext;

        this.input = this.audioContext.createGain();
        this.output = this.audioContext.createGain();

        this.effect = this.audioContext.createBiquadFilter();
        this.effect.type = "lowshelf";
        this.effect.frequency.value = 200;
        this.effect.gain.value = 12;

        this.effect.gain.setValueAtTime(0, startSeconds);
        this.effect.gain.setValueAtTime(12, endSeconds);

        this.input.gain.value = 1.4;
        this.output.gain.value = 1.25;

        this.input.connect(this.effect);
        this.effect.connect(this.output);
    }
}

export default BassBoostEffect;