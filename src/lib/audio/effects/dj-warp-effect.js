class DJWarpEffect {
    constructor(audioContext, startSeconds, endSeconds) {
        this.audioContext = audioContext;

        this.input = audioContext.createGain();
        this.output = audioContext.createGain();

        // --- Delay (core warp) ---
        this.delay = audioContext.createDelay();

        // --- LFO (warp motion) ---
        this.lfo = audioContext.createOscillator();
        this.lfo.type = "sine";
        this.lfo.frequency.setValueAtTime(0.5, startSeconds); // slow warp

        const lfoGain = audioContext.createGain();
        lfoGain.gain.value = 0.08;

        this.lfo.connect(lfoGain);
        lfoGain.connect(this.delay.delayTime);

        // --- Extra warp bursts (scratch feel) ---
        const step = 0.3;
        for (let t = startSeconds; t < endSeconds; t += step) {
            const warp = Math.random() * 0.15;
            this.delay.delayTime.setValueAtTime(warp, t);
        }

        // --- Mild distortion ---
        this.distortion = audioContext.createWaveShaper();

        const curve = new Float32Array(44100);
        for (let i = 0; i < 44100; i++) {
            let x = (i * 2) / 44100 - 1;
            curve[i] = Math.tanh(3 * x);
        }
        this.distortion.curve = curve;

        // --- Smooth activation ---
        this.output.gain.setValueAtTime(0, startSeconds);
        this.output.gain.linearRampToValueAtTime(1, startSeconds + 0.05);
        this.output.gain.setValueAtTime(1, endSeconds - 0.05);
        this.output.gain.linearRampToValueAtTime(0, endSeconds);

        this.lfo.start(startSeconds);
        this.lfo.stop(endSeconds);

        // --- Wiring ---
        this.input.connect(this.delay);
        this.delay.connect(this.distortion);
        this.distortion.connect(this.output);
    }
}

export default DJWarpEffect;