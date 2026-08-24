import PropTypes from 'prop-types';
import React from 'react';

import {generateSound, dispatchGenerateEvent, setGenerator} from '../../lib/text-to-sound-ai-core.js';
import generateCatalogSound from '../../lib/text-to-sound-ai-engine.js';

// Register the expanded local engine when the sound editor loads. This keeps
// Text to Sound AI fully functional on static GitHub Pages without requiring
// Vercel, CORS, or an API key.
setGenerator(generateCatalogSound);

const stopProjectKeyboardHandling = event => {
    // The project editor has global keyboard shortcuts. Do not let those
    // shortcuts consume spaces or other typing keys while the AI prompt has focus.
    event.stopPropagation();
};

const waitForGeneration = (request, onGenerate) => new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
        reject(new Error('Text to Sound AI requires a browser environment.'));
        return;
    }

    const cleanup = () => {
        window.removeEventListener('larrymod-text-to-sound-ai-complete', handleComplete);
        window.removeEventListener('larrymod-text-to-sound-ai-error', handleError);
    };
    const handleComplete = event => {
        cleanup();
        resolve(event.detail && event.detail.sound);
    };
    const handleError = event => {
        cleanup();
        const error = event.detail && event.detail.error;
        reject(error instanceof Error ? error : new Error('Unable to generate the sound.'));
    };

    window.addEventListener('larrymod-text-to-sound-ai-complete', handleComplete);
    window.addEventListener('larrymod-text-to-sound-ai-error', handleError);

    try {
        const result = onGenerate(request);
        if (result && typeof result.then === 'function') {
            result.then(value => {
                cleanup();
                resolve(value);
            }).catch(error => {
                cleanup();
                reject(error);
            });
        }
    } catch (error) {
        cleanup();
        reject(error);
    }
});

const TextToSoundAIGenerator = ({onClose, onGenerate}) => {
    const [prompt, setPrompt] = React.useState('');
    const [duration, setDuration] = React.useState(2);
    const [status, setStatus] = React.useState('');
    const [generating, setGenerating] = React.useState(false);

    const handleGenerate = async () => {
        // Preserve intentional spaces inside the description while rejecting
        // an empty/all-whitespace prompt.
        const text = prompt.trim();
        if (!text) {
            setStatus('Enter a description for the sound.');
            return;
        }

        const request = {prompt: text, duration};
        setGenerating(true);
        setStatus('Generating sound…');
        try {
            if (onGenerate) {
                await waitForGeneration(request, onGenerate);
            } else {
                try {
                    await generateSound(request);
                } catch (error) {
                    if (error.message !== 'No text-to-sound AI generator has been configured.') {
                        throw error;
                    }
                    dispatchGenerateEvent(request);
                }
            }
            setStatus('Sound generated.');
            setGenerating(false);
            if (onClose) onClose();
        } catch (error) {
            setGenerating(false);
            setStatus(error && error.message ? error.message : 'Unable to generate the sound.');
        }
    };

    return (
        <div role="dialog" aria-label="Text to Sound AI" style={{background: '#fff', borderRadius: '8px', boxShadow: '0 4px 18px rgba(0, 0, 0, .25)', display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '420px', padding: '16px', width: '100%'}}>
            <div style={{alignItems: 'center', display: 'flex', gap: '8px'}}>
                <img src={require('./icon--text-to-sound.svg')} alt="" width="24" height="24" />
                <strong style={{flex: 1}}>Text to Sound AI</strong>
                <button type="button" onClick={onClose} aria-label="Close" disabled={generating}>×</button>
            </div>
            <label htmlFor="text-to-sound-prompt">Describe the sound</label>
            <textarea
                id="text-to-sound-prompt"
                value={prompt}
                onChange={event => setPrompt(event.target.value)}
                onKeyDown={stopProjectKeyboardHandling}
                onKeyPress={stopProjectKeyboardHandling}
                onKeyUp={stopProjectKeyboardHandling}
                placeholder="Example: a short futuristic robot beep"
                rows={4}
                style={{resize: 'vertical'}}
                disabled={generating}
            />
            <label htmlFor="text-to-sound-duration">Duration (seconds)</label>
            <input id="text-to-sound-duration" type="number" min="0.5" max="30" step="0.1" value={duration} onChange={event => setDuration(Math.max(0.5, Math.min(30, Number(event.target.value) || 0.5)))} disabled={generating} />
            {status ? <div role="status" aria-live="polite">{status}</div> : null}
            <div style={{display: 'flex', gap: '8px', justifyContent: 'flex-end'}}>
                <button type="button" onClick={onClose} disabled={generating}>Cancel</button>
                <button type="button" onClick={handleGenerate} disabled={generating}>{generating ? 'Generating…' : 'Generate Sound'}</button>
            </div>
        </div>
    );
};

TextToSoundAIGenerator.propTypes = {
    onClose: PropTypes.func,
    onGenerate: PropTypes.func
};

export default TextToSoundAIGenerator;