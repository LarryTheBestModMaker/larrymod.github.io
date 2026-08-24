class LowBatteryEffect {
    constructor(audioContext, startSeconds, endSeconds) {
        this.audioContext = audioContext;

        this.input = this.audioContext.createGain();
        this.output = this.audioContext.createGain();

        // --- Lowpass (weak / drained sound) ---
        this.filter = this.audioContext.createBiquadFilter();
        this.filter.type = "lowpass";

        const normalFreq = 11025;
        const weakFreq = 1200;

        this.filter.Q.value = 0.8;

        // Transition into weak sound
        this.filter.frequency.setValueAtTime(normalFreq, startSeconds);
        this.filter.frequency.linearRampToValueAtTime(
            weakFreq,
            startSeconds + 0.1
        );

        // Stay weak
        this.filter.frequency.setValueAtTime(
            weakFreq,
            endSeconds - 0.1
        );

        // Recover
        this.filter.frequency.linearRampToValueAtTime(
            normalFreq,
            endSeconds
        );

        // --- Mild distortion (electrical strain) ---
        this.distortion = this.audioContext.createWaveShaper();

        const makeCurve = (amount = 15) => {
            const samples = 44100;
            const curve = new Float32Array(samples);

            for (let i = 0; i < samples; i++) {
                const x = (i * 2) / samples - 1;
                curve[i] = x * (1 + amount * Math.abs(x)) / (1 + amount);
            }

            return curve;
        };

        this.distortion.curve = makeCurve(10);

        // --- Power fluctuation (key effect) ---
        const dropRate = 0.08; // how often it flickers

        for (let t = startSeconds; t < endSeconds; t += dropRate) {
            const value = 0.4 + Math.random() * 0.4; // unstable volume
            this.output.gain.setValueAtTime(value, t);
        }

        // Ensure stable edges
        this.output.gain.setValueAtTime(1, startSeconds);
        this.output.gain.setValueAtTime(1, endSeconds);

        // --- Wiring ---
        this.input.connect(this.filter);
        this.filter.connect(this.distortion);
        this.distortion.connect(this.output);
    }
}

export default LowBatteryEffect;