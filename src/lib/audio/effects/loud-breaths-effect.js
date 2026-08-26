class LoudBreathsEffect {
    constructor(audioContext, startSeconds, endSeconds) {
        this.input = audioContext.createGain();
        this.output = audioContext.createGain();

        this.noiseGain = audioContext.createGain();

        const step = 0.3;

        for (let t = startSeconds; t < endSeconds; t += step) {
            this.noiseGain.gain.setValueAtTime(0, t);
            this.noiseGain.gain.linearRampToValueAtTime(1, t + 0.05);
            this.noiseGain.gain.linearRampToValueAtTime(0, t + 0.2);
        }

        this.input.connect(this.noiseGain);
        this.noiseGain.connect(this.output);
    }
}
export default LoudBreathsEffect;