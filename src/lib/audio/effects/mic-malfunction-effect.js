class MicMalfunctionEffect {
    constructor(audioContext) {
        this.audioContext = audioContext;

        this.input = audioContext.createGain();
        this.output = audioContext.createGain();

        // Settings
        const bits = 10;
        const normFreq = 0.05;
        const bufferSize = 4096;

        this.processor = audioContext.createScriptProcessor(bufferSize, 1, 1);

        let phaser = 0;
        let lastSample = 0;
        const step = Math.pow(0.5, bits);

        this.processor.onaudioprocess = (event) => {
            const input = event.inputBuffer.getChannelData(0);
            const output = event.outputBuffer.getChannelData(0);

            for (let i = 0; i < input.length; i++) {
                phaser += normFreq;

                if (phaser >= 1.0) {
                    phaser -= 1.0;
                    lastSample = step * Math.floor(input[i] / step + 0.5);
                }

                output[i] = lastSample;
            }
        };

        // Wiring
        this.input.connect(this.processor);
        this.processor.connect(this.output);
    }
}

export default MicMalfunctionEffect;