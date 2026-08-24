class FlashbackEffect {
    static get TAIL_SECONDS () {
        return 5;
    }
    constructor(audioContext, startSeconds, endSeconds) {
        this.audioContext = audioContext;

        this.input = this.audioContext.createGain();
        this.output = this.audioContext.createGain();

        // --- Delay (main echo) ---
        this.delay = this.audioContext.createDelay();
        this.delay.delayTime.setValueAtTime(0.4, startSeconds);

        // --- Feedback loop (repeats) ---
        this.feedback = this.audioContext.createGain();
        this.feedback.gain.value = 0.5;

        // --- Lowpass (old/distant sound) ---
        this.lowpass = this.audioContext.createBiquadFilter();
        this.lowpass.type = "lowpass";
        this.lowpass.frequency.setValueAtTime(1500, startSeconds);

        // --- Wet/Dry mix ---
        this.dry = this.audioContext.createGain();
        this.wet = this.audioContext.createGain();

        this.dry.gain.value = 1;
        this.wet.gain.value = 0.7;

        // --- Fade out (memory effect) ---
        this.output.gain.setValueAtTime(1, startSeconds);
        this.output.gain.linearRampToValueAtTime(0.3, endSeconds);

        // --- Wiring ---

        // Dry signal
        this.input.connect(this.dry);
        this.dry.connect(this.output);

        // Delay loop
        this.input.connect(this.delay);
        this.delay.connect(this.lowpass);
        this.lowpass.connect(this.feedback);
        this.feedback.connect(this.delay);

        // Output wet signal
        this.lowpass.connect(this.wet);
        this.wet.connect(this.output);
    }
}

export default FlashbackEffect;