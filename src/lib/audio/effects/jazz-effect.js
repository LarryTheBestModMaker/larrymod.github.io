class JazzEffect {
    constructor (audioContext, startSeconds, endSeconds) {
        this.audioContext = audioContext;

        this.input = this.audioContext.createGain();
        this.output = this.audioContext.createGain();

        this.speechGain = this.audioContext.createGain();
        this.musicGain = this.audioContext.createGain();

        this.speechGain.gain.value = 1;
        this.musicGain.gain.value = 0.16;

        this.bpm = 110;
        this.beatLength = 60 / this.bpm;

        // Warm vocal sound
        this.speechFilter = this.audioContext.createBiquadFilter();
        this.speechFilter.type = "peaking";
        this.speechFilter.frequency.value = 1500;
        this.speechFilter.Q.value = 0.7;
        this.speechFilter.gain.value = 2;

        this.input.connect(this.speechFilter);
        this.speechFilter.connect(this.speechGain);

        // Jazz backing
        this.music = this.audioContext.createGain();
        this.music.gain.value = 0.55;

        this.piano = this.audioContext.createOscillator();
        this.piano.type = "triangle";
        this.piano.frequency.value = 261.63;

        this.bass = this.audioContext.createOscillator();
        this.bass.type = "sine";
        this.bass.frequency.value = 65.41;

        this.musicFilter = this.audioContext.createBiquadFilter();
        this.musicFilter.type = "lowpass";
        this.musicFilter.frequency.value = 5000;

        this.piano.connect(this.music);
        this.bass.connect(this.music);

        this.music.connect(this.musicFilter);
        this.musicFilter.connect(this.musicGain);

        this.speechGain.connect(this.output);
        this.musicGain.connect(this.output);

        this.piano.start();
        this.bass.start();

        this.startJazzBeat(startSeconds, endSeconds);
    }

    startJazzBeat (startSeconds, endSeconds) {
        const swing = this.beatLength * 0.66;

        for (
            let time = startSeconds;
            time < endSeconds;
            time += this.beatLength
        ) {
            this.music.gain.setValueAtTime(0.7, time);

            this.music.gain.setValueAtTime(
                0.42,
                time + swing
            );

            this.music.gain.setValueAtTime(
                0.62,
                time + this.beatLength
            );
        }
    }
}

export default JazzEffect;