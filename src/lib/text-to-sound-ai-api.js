/*
 * Text-to-Sound AI serverless endpoint.
 *
 * POST /api/text-to-sound-ai
 *
 * Required environment variable:
 *   ELEVENLABS_API_KEY
 *
 * This keeps the provider API key on the server.
 */

const json = (res, status, payload) => {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.end(JSON.stringify(payload));
};

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

    if (req.method === 'OPTIONS') {
        res.statusCode = 204;
        res.end();
        return;
    }

    if (req.method !== 'POST') {
        json(res, 405, {
            error: 'Method not allowed. Use POST.'
        });
        return;
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!apiKey) {
        json(res, 503, {
            error: 'Text-to-sound AI is not configured. Set ELEVENLABS_API_KEY in the server environment.'
        });
        return;
    }

    try {
        const body = typeof req.body === 'string' ?
            JSON.parse(req.body) :
            (req.body || {});

        const prompt = String(body.prompt || '').trim();

        if (!prompt) {
            json(res, 400, {
                error: 'A sound description is required.'
            });
            return;
        }

        const response = await fetch(
            'https://api.elevenlabs.io/v1/sound-generation',
            {
                method: 'POST',
                headers: {
                    'xi-api-key': apiKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: prompt,
                    duration_seconds: body.durationSeconds || undefined,
                    prompt_influence: body.promptInfluence === undefined ?
                        0.5 :
                        Number(body.promptInfluence)
                })
            }
        );

        if (!response.ok) {
            let providerError = null;

            try {
                providerError = await response.json();
            } catch (error) {
                // Ignore invalid provider error JSON.
            }

            const message =
                providerError?.detail?.message ||
                providerError?.detail ||
                providerError?.message ||
                `ElevenLabs sound generation failed (${response.status}).`;

            json(res, response.status, {
                error: message
            });
            return;
        }

        const audioBuffer = await response.arrayBuffer();
        const base64 = Buffer.from(audioBuffer).toString('base64');

        json(res, 200, {
            data: base64,
            contentType: response.headers.get('content-type') ||
                'audio/mpeg'
        });
    } catch (error) {
        json(res, 502, {
            error: error && error.message ?
                error.message :
                'Text-to-sound generation failed.'
        });
    }
};