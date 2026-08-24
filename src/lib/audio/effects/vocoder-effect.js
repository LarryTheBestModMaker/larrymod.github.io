class VocoderEffect {
    constructor(audioContext, startSeconds, endSeconds) {
        this.audioContext = audioContext;

        this.input = this.audioContext.createGain();
        this.output = this.audioContext.createGain();

        // --- Carrier oscillator (robot tone) ---
        this.osc = this.audioContext.createOscillator();
        this.osc.type = "sawtooth"; // more robotic than sine
        this.osc.frequency.setValueAtTime(120, startSeconds);

        // Start oscillator
        this.osc.start(startSeconds);
        this.osc.stop(endSeconds);

        // --- Envelope follower (fake via gain shaping) ---
        this.envGain = this.audioContext.createGain();
        this.envGain.gain.value = 0.7;

        // --- Multiple bandpass filters (vocoder bands) ---
        this.bands = [];

        const frequencies = [200, 400, 800, 1600, 3200];

        frequencies.forEach(freq => {
            const band = this.audioContext.createBiquadFilter();
            band.type = "bandpass";
            band.frequency.value = freq;
            band.Q.value = 5;

            this.bands.push(band);
        });

        // --- Distortion (adds robotic harshness) ---
        this.distortion = this.audioContext.createWaveShaper();

        const makeCurve = (amount = 4) => {
            const samples = 44100;
            const curve = new Float32Array(samples);

            for (let i = 0; i < samples; i++) {
                const x = (i * 2) / samples - 1;
                curve[i] = Math.tanh(amount * x);
            }

            return curve;
        };

        this.distortion.curve = makeCurve(3);

        // --- Smooth activation ---
        this.output.gain.setValueAtTime(0, startSeconds);
        this.output.gain.linearRampToValueAtTime(1, startSeconds + 0.05);
        this.output.gain.setValueAtTime(1, endSeconds - 0.05);
        this.output.gain.linearRampToValueAtTime(0, endSeconds);

        // --- Wiring ---

        // Input → bands (modulator)
        this.bands.forEach(band => {
            this.input.connect(band);
        });

        // Oscillator → envelope gain
        this.osc.connect(this.envGain);

        // Each band modulates the carrier feel
        this.bands.forEach(band => {
            const bandGain = this.audioContext.createGain();
            bandGain.gain.value = 1;

            band.connect(bandGain);
            this.envGain.connect(bandGain.gain); // modulation feel

            bandGain.connect(this.distortion);
        });

        this.distortion.connect(this.output);
    }
}

export default VocoderEffect;