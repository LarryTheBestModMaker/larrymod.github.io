class LugandaEffect {
    constructor(audioContext, startSeconds, endSeconds, targetLanguage = "Luganda") {
        this.audioContext = audioContext;
        this.input = this.audioContext.createGain();
        this.output = this.audioContext.createGain();

        this.targetLanguage = targetLanguage;

        this.translatedSpeech = this.audioContext.createGain();
        this.translatedSpeech.gain.value = 1;

        this.input.connect(this.translatedSpeech);
        this.translatedSpeech.connect(this.output);

        this.startSeconds = startSeconds;
        this.endSeconds = endSeconds;

        this.translationResult = null;
    }

    async translate(audioBlob) {
        const text = await speechToText(audioBlob);

        const translatedText = await translateText(
            text,
            this.targetLanguage
        );

        const translatedAudio = await textToSpeech(
            translatedText,
            this.targetLanguage
        );

        const audioBuffer = await this.audioContext.decodeAudioData(
            await translatedAudio.arrayBuffer()
        );

        const source = this.audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(this.translatedSpeech);

        source.start(this.startSeconds);

        this.translationResult = {
            originalText: text,
            translatedText: translatedText,
            language: this.targetLanguage
        };
    }
}

export default LugandaEffect;
