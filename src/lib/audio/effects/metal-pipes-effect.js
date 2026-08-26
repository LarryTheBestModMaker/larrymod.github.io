class MetalPipesEffect {
    constructor(audioContext, startSeconds, endSeconds) {
        this.input = audioContext.createGain();
        this.output = audioContext.createGain();

        this.bandpass = audioContext.createBiquadFilter();
        this.bandpass.type = "bandpass";
        this.bandpass.frequency.value = 800;
        this.bandpass.Q.value = 15;

        this.delay = audioContext.createDelay();
        this.delay.delayTime.value = 0.09;

        this.feedback = audioContext.createGain();
        this.feedback.gain.value = 0.7;

        this.input.connect(this.bandpass);
        this.bandpass.connect(this.delay);
        this.delay.connect(this.feedback);
        this.feedback.connect(this.delay);
        this.delay.connect(this.output);
    }
}
export default MetalPipesEffect;