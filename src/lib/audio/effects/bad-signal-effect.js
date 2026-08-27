class BadSignalEffect {
    constructor(audioContext) {
        this.audioContext = audioContext;

        this.input = audioContext.createGain();
        this.output = audioContext.createGain();
        
            // Narrow radio/phone frequency range
            const highpass = ctx.createBiquadFilter();
            highpass.type = "highpass";
            highpass.frequency.value = 500;
            highpass.Q.value = 0.8;

            const lowpass = ctx.createBiquadFilter();
            lowpass.type = "lowpass";
            lowpass.frequency.value = 3000;
            lowpass.Q.value = 0.8;

            // Mild signal distortion
            const distortion = ctx.createWaveShaper();
            distortion.curve = makeCurve(4);
            distortion.oversample = "2x";

            // Subtle unstable signal modulation
            const tremolo = ctx.createGain();
            tremolo.gain.value = 0.85;

            const lfo = ctx.createOscillator();
            const lfoGain = ctx.createGain();

            lfo.frequency.value = 7;
            lfoGain.gain.value = 0.12;

            lfo.connect(lfoGain);
            lfoGain.connect(tremolo.gain);
            lfo.start();

            // Signal chain
            input.connect(highpass);
            highpass.connect(lowpass);
            lowpass.connect(distortion);
            distortion.connect(tremolo);
            tremolo.connect(output);

            // Keep the LFO alive with the effect
            this.lfo = lfo;
        };
    }

export default BadSignalEffect;
