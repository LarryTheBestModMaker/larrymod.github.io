class BAndWTVEffect {
    constructor(audioContext) {
        this.input = audioContext.createGain();
        this.output = audioContext.createGain();

        this.bandpass = audioContext.createBiquadFilter();
        this.bandpass.type = "bandpass";
        this.bandpass.frequency.value = 1500;

        // Noise
        const buffer = audioContext.createBuffer(1, 44100, 44100);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            data[i] = Math.random() * 0.1;
        }

        this.noise = audioContext.createBufferSource();
        this.noise.buffer = buffer;
        this.noise.loop = true;

        this.noiseGain = audioContext.createGain();
        this.noiseGain.gain.value = 0.2;

        this.noise.connect(this.noiseGain);
        this.noiseGain.connect(this.output);
        this.noise.start();

        this.input.connect(this.bandpass);
        this.bandpass.connect(this.output);
    }
}
export default BAndWTVEffect;