class HipHopEffect {
    constructor (audioContext, startSeconds, endSeconds) {
        this.audioContext = audioContext;

        this.input = this.audioContext.createGain();
        this.output = this.audioContext.createGain();

        this.speechGain = this.audioContext.createGain();
        this.musicGain = this.audioContext.createGain();

        this.speechGain.gain.value = 1.0;
        this.musicGain.gain.value = 0.22;

        // Hip-hop tempo
        this.bpm = 90;
        this.beatLength = 60 / this.bpm;

        // Speech processing
        this.speechFilter = this.audioContext.createBiquadFilter();
        this.speechFilter.type = "peaking";
        this.speechFilter.frequency.value = 1800;
        this.speechFilter.Q.value = 1;
        this.speechFilter.gain.value = 3;

        this.compressor = this.audioContext.createDynamicsCompressor();
        this.compressor.threshold.value = -20;
        this.compressor.knee.value = 10;
        this.compressor.ratio.value = 4;
        this.compressor.attack.value = 0.003;
        this.compressor.release.value = 0.12;

        // Backing music
        this.music = this.audioContext.createGain();
        this.music.gain.value = 0.8;

        this.kick = this.audioContext.createOscillator();
        this.kick.type = "sine";
        this.kick.frequency.value = 65;

        this.bass = this.audioContext.createOscillator();
        this.bass.type = "sawtooth";
        this.bass.frequency.value = 55;

        this.musicFilter = this.audioContext.createBiquadFilter();
        this.musicFilter.type = "lowpass";
        this.musicFilter.frequency.value = 1800;

        this.kick.connect(this.music);
        this.bass.connect(this.music);
        this.music.connect(this.musicFilter);
        this.musicFilter.connect(this.musicGain);

        // Speech chain
        this.input.connect(this.speechFilter);
        this.speechFilter.connect(this.compressor);
        this.compressor.connect(this.speechGain);

        this.speechGain.connect(this.output);
        this.musicGain.connect(this.output);

        this.kick.start();
        this.bass.start();

        // Start musical rhythm at the selected region.
        this.startHipHopBeat(startSeconds, endSeconds);
    }

    startHipHopBeat (startSeconds, endSeconds) {
        const beat = this.beatLength;

        for (let time = startSeconds; time < endSeconds; time += beat) {
            const position = Math.round((time - startSeconds) / beat);

            if (position % 2 === 0) {
                this.music.gain.setValueAtTime(0.9, time);
            } else {
                this.music.gain.setValueAtTime(0.55, time);
            }

            this.music.gain.setValueAtTime(0.75, time + beat * 0.45);
        }
    }
}

export default HipHopEffect;