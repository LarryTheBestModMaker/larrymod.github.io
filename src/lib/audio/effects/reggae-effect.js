class ReggaeEffect {
    constructor (audioContext, startSeconds, endSeconds) {
        this.audioContext = audioContext;

        this.input = this.audioContext.createGain();
        this.output = this.audioContext.createGain();

        this.speechGain = this.audioContext.createGain();
        this.musicGain = this.audioContext.createGain();

        this.speechGain.gain.value = 1;
        this.musicGain.gain.value = 0.18;

        this.bpm = 80;
        this.beatLength = 60 / this.bpm;

        // Speech processing
        this.speechFilter = this.audioContext.createBiquadFilter();
        this.speechFilter.type = "peaking";
        this.speechFilter.frequency.value = 2000;
        this.speechFilter.Q.value = 1;
        this.speechFilter.gain.value = 2;

        this.input.connect(this.speechFilter);
        this.speechFilter.connect(this.speechGain);

        // Reggae backing
        this.music = this.audioContext.createGain();
        this.music.gain.value = 0.7;

        this.bass = this.audioContext.createOscillator();
        this.bass.type = "triangle";
        this.bass.frequency.value = 73.42;

        this.guitar = this.audioContext.createOscillator();
        this.guitar.type = "square";
        this.guitar.frequency.value = 146.83;

        this.musicFilter = this.audioContext.createBiquadFilter();
        this.musicFilter.type = "lowpass";
        this.musicFilter.frequency.value = 2400;

        this.bass.connect(this.music);
        this.guitar.connect(this.music);

        this.music.connect(this.musicFilter);
        this.musicFilter.connect(this.musicGain);

        this.speechGain.connect(this.output);
        this.musicGain.connect(this.output);

        this.bass.start();
        this.guitar.start();

        this.startReggaeBeat(startSeconds, endSeconds);
    }

    startReggaeBeat (startSeconds, endSeconds) {
        const offBeat = this.beatLength / 2;

        for (
            let time = startSeconds;
            time < endSeconds;
            time += this.beatLength
        ) {
            this.music.gain.setValueAtTime(0.35, time);
            this.music.gain.setValueAtTime(0.75, time + offBeat);
            this.music.gain.setValueAtTime(0.35, time + this.beatLength);
        }
    }
}

export default ReggaeEffect;