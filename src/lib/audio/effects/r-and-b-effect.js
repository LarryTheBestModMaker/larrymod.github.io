class RAndBEffect {
    constructor (audioContext, startSeconds, endSeconds) {
        this.audioContext = audioContext;

        this.input = this.audioContext.createGain();
        this.output = this.audioContext.createGain();

        this.speechGain = this.audioContext.createGain();
        this.musicGain = this.audioContext.createGain();

        this.speechGain.gain.value = 0.95;
        this.musicGain.gain.value = 0.20;

        this.bpm = 78;
        this.beatLength = 60 / this.bpm;

        // Smooth vocal processing
        this.speechFilter = this.audioContext.createBiquadFilter();
        this.speechFilter.type = "peaking";
        this.speechFilter.frequency.value = 2800;
        this.speechFilter.Q.value = 0.8;
        this.speechFilter.gain.value = 2;

        this.compressor = this.audioContext.createDynamicsCompressor();
        this.compressor.threshold.value = -22;
        this.compressor.ratio.value = 3;
        this.compressor.attack.value = 0.01;
        this.compressor.release.value = 0.2;

        // R&B backing
        this.music = this.audioContext.createGain();
        this.music.gain.value = 0.65;

        this.chord = this.audioContext.createOscillator();
        this.chord.type = "sine";
        this.chord.frequency.value = 261.63;

        this.bass = this.audioContext.createOscillator();
        this.bass.type = "triangle";
        this.bass.frequency.value = 65.41;

        this.musicFilter = this.audioContext.createBiquadFilter();
        this.musicFilter.type = "lowpass";
        this.musicFilter.frequency.value = 3500;

        this.chord.connect(this.music);
        this.bass.connect(this.music);

        this.music.connect(this.musicFilter);
        this.musicFilter.connect(this.musicGain);

        this.input.connect(this.speechFilter);
        this.speechFilter.connect(this.compressor);
        this.compressor.connect(this.speechGain);

        this.speechGain.connect(this.output);
        this.musicGain.connect(this.output);

        this.chord.start();
        this.bass.start();

        this.startRnBBeat(startSeconds, endSeconds);
    }

    startRnBBeat (startSeconds, endSeconds) {
        for (
            let time = startSeconds;
            time < endSeconds;
            time += this.beatLength
        ) {
            this.music.gain.setValueAtTime(0.75, time);
            this.music.gain.linearRampToValueAtTime(
                0.55,
                time + this.beatLength * 0.75
            );
        }
    }
}

export default RAndBEffect;