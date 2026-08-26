class NormalizeEffect {
    constructor(audioContext, startSeconds, endSeconds, targetLevel = 0.9) {
        this.audioContext = audioContext;

        this.input = audioContext.createGain();
        this.output = audioContext.createGain();

        // --- Analyze incoming signal (simplified normalization) ---
        this.analyser = audioContext.createAnalyser();
        this.analyser.fftSize = 2048;

        this.buffer = new Uint8Array(this.analyser.fftSize);

        // --- Auto gain control ---
        this.gainNode = audioContext.createGain();

        // Simulated normalization loop
        const updateGain = () => {
            this.analyser.getByteTimeDomainData(this.buffer);

            let max = 0;
            for (let i = 0; i < this.buffer.length; i++) {
                const value = Math.abs(this.buffer[i] - 128) / 128;
                if (value > max) max = value;
            }

            const gainValue = max > 0 ? (targetLevel / max) : 1;

            this.gainNode.gain.setTargetAtTime(
                Math.min(gainValue, 3),
                this.audioContext.currentTime,
                0.01
            );
        };

        // --- Run normalization over time ---
        const interval = setInterval(updateGain, 50);

        // stop cleanup timing
        setTimeout(() => clearInterval(interval), (endSeconds - startSeconds) * 1000);

        // --- Smooth activation ---
        this.output.gain.setValueAtTime(0, startSeconds);
        this.output.gain.linearRampToValueAtTime(1, startSeconds + 0.05);
        this.output.gain.setValueAtTime(1, endSeconds - 0.05);
        this.output.gain.linearRampToValueAtTime(0, endSeconds);

        // --- Wiring ---
        this.input.connect(this.analyser);
        this.analyser.connect(this.gainNode);
        this.gainNode.connect(this.output);
    }
}

export default NormalizeEffect;