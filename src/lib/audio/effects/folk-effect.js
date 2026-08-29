class FolkEffect {
    constructor (audioContext, startSeconds, endSeconds) {
        this.audioContext = audioContext;

        this.input = this.audioContext.createGain();
        this.output = this.audioContext.createGain();

        this.speechGain = this.audioContext.createGain();
        this.musicGain = this.audioContext.createGain();

        this.speechGain.gain.value = 1;
        this.musicGain.gain.value = 0.17;

        this.bpm = 96;
        this.beatLength = 60 / this.bpm;

        // Natural speech tone
        this.speechFilter = this.audioContext.createBiquadFilter();
        this.speechFilter.type = "peaking";
        this.speechFilter.frequency.value = 2500;
        this.speechFilter.Q.value = 0.8;
        this.speechFilter.gain.value = 2;

        this.input.connect(this.speechFilter);
        this.speechFilter.connect(this.speechGain);

        // Folk backing
        this.music = this.audioContext.createGain();
        this.music.gain.value = 0.55;

        this.acoustic = this.audioContext.createOscillator();
        this.acoustic.type = "triangle";
        this.acoustic.frequency.value = 196;

        this.bass = this.audioContext.createOscillator();
        this.bass.type = "sine";
        this.bass.frequency.value = 98;

        this.musicFilter = this.audioContext.createBiquadFilter();
        this.musicFilter.type = "lowpass";
        this.musicFilter.frequency.value = 4000;

        this.acoustic.connect(this.music);
        this.bass.connect(this.music);

        this.music.connect(this.musicFilter);
        this.musicFilter.connect(this.musicGain);

        this.speechGain.connect(this.output);
        this.musicGain.connect(this.output);

        this.acoustic.start();
        this.bass.start();

        this.startFolkBeat(startSeconds, endSeconds);
    }

    startFolkBeat (startSeconds, endSeconds) {
        for (
            let time = startSeconds;
            time < endSeconds;
            time += this.beatLength
        ) {
            this.music.gain.setValueAtTime(0.65, time);

            this.music.gain.setValueAtTime(
                0.38,
                time + this.beatLength * 0.5
            );

            this.music.gain.setValueAtTime(
                0.58,
                time + this.beatLength
            );
        }
    }
}

export default FolkEffect;