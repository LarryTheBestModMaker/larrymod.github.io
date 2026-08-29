class BassBoostEffect {
    constructor(audioContext) {
        this.audioContext = audioContext;

        this.input = this.audioContext.createGain();
        this.output = this.audioContext.createGain();

        this.effect = this.audioContext.createBiquadFilter();
        this.effect.type = "lowshelf";
        this.effect.frequency.value = 200;
        this.effect.gain.value = 12;

        this.input.connect(this.effect);
        this.effect.connect(this.output);
    }
}

export default BassBoostEffect;
