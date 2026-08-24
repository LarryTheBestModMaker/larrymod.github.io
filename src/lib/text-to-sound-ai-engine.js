import {resolveSoundFamily, SOUND_VOCABULARY_SIZE, SOUND_COMBINATION_COUNT} from './text-to-sound-ai-catalog.js';

const SAMPLE_RATE = 44100;
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const hashString = text => {
    let hash = 2166136261;
    for (let i = 0; i < text.length; i++) {
        hash ^= text.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
};

const rng = seed => {
    let state = seed >>> 0;
    return () => {
        state += 0x6D2B79F5;
        let t = state;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
};

const sine = (frequency, time) => Math.sin(2 * Math.PI * frequency * time);
const noise = random => random() * 2 - 1;
const env = (t, duration, attack = 0.015, release = 0.12) => {
    if (t < attack) return t / Math.max(attack, 0.0001);
    if (t > duration - release) return clamp((duration - t) / Math.max(release, 0.0001), 0, 1);
    return 1;
};

const writeAscii = (view, offset, text) => {
    for (let i = 0; i < text.length; i++) view.setUint8(offset + i, text.charCodeAt(i));
};

const encodeWav = samples => {
    const dataSize = samples.length * 2;
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);
    writeAscii(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    writeAscii(view, 8, 'WAVE');
    writeAscii(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, SAMPLE_RATE, true);
    view.setUint32(28, SAMPLE_RATE * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeAscii(view, 36, 'data');
    view.setUint32(40, dataSize, true);
    for (let i = 0; i < samples.length; i++) {
        view.setInt16(44 + i * 2, clamp(samples[i], -1, 1) * 32767, true);
    }
    return buffer;
};

const renderFamily = (mode, text, t, p, duration, random) => {
    const n = amount => noise(random) * amount;
    const tone = (frequency, amplitude) => sine(frequency, t) * amplitude;
    const e = env(t, duration);
    const high = /\b(high|helium|tiny)\b/.test(text);
    const low = /\b(low|deep|bass|huge|giant)\b/.test(text);
    const fast = /\b(fast|rapid|quick)\b/.test(text);

    switch (mode) {
    case 'animal': {
        const base = high ? 760 : low ? 125 : 240 + hashString(text) % 260;
        const vibrato = 1 + 0.04 * Math.sin(2 * Math.PI * 5 * t);
        const call = 0.5 + 0.5 * Math.max(0, Math.sin(2 * Math.PI * (fast ? 8 : 3.6) * t));
        return (tone(base * vibrato, 0.42) + tone(base * 2.03, 0.16) + tone(base * 3.91, 0.07) + n(0.16)) * call * e;
    }
    case 'voice': {
        const base = high ? 620 : low ? 125 : 275;
        const vibrato = 1 + 0.025 * Math.sin(2 * Math.PI * 5.5 * t);
        return (tone(base * vibrato, 0.4) + tone(base * 2.05, 0.15) + tone(base * 3.5, 0.07) + n(0.24)) * (0.55 + 0.45 * Math.sin(2 * Math.PI * 6.5 * t)) * e;
    }
    case 'explosion': return n(0.9) * Math.exp(-28 * p) + tone(42 + 65 * Math.exp(-5 * p), 0.95) * Math.exp(-5 * p);
    case 'impact': return tone(low ? 55 : 88, 0.9) * Math.exp(-16 * p) + n(0.3) * Math.exp(-38 * p);
    case 'metal': return (tone(high ? 1050 : low ? 170 : 430, 0.48) + tone(high ? 2100 : 860, 0.22) + tone(high ? 3150 : 1290, 0.1)) * Math.exp(-5 * p);
    case 'wood': return (tone(120, 0.72) + tone(245, 0.2) + n(0.16)) * Math.exp(-12 * p);
    case 'glass': return (tone(1280, 0.34) + tone(2180, 0.24) + tone(3120, 0.14) + n(0.04)) * Math.exp(-5 * p);
    case 'paper': case 'plastic': return n(mode === 'paper' ? 0.22 : 0.3) * e;
    case 'rubber': return tone(140 + 110 * Math.exp(-4 * p), 0.55) * Math.exp(-7 * p) + n(0.14) * Math.exp(-18 * p);
    case 'vehicle': {
        const base = low ? 65 : 110 + 35 * Math.sin(2 * Math.PI * 2 * t);
        return (tone(base * (fast ? 1.25 : 1), 0.43) + tone(base * 2, 0.17) + n(0.15)) * e;
    }
    case 'machine': {
        const base = high ? 780 : low ? 95 : 190;
        return (tone(base, 0.3) + tone(base * 2, 0.17) + tone(base * 4, 0.08) + n(0.13)) * (0.6 + 0.4 * Math.sin(2 * Math.PI * 9 * t));
    }
    case 'door': return (tone(75, 0.7) + tone(175, 0.2) + n(0.12)) * Math.exp(-9 * p);
    case 'footstep': return n(0.52) * Math.exp(-25 * p) + tone(70, 0.38) * Math.exp(-17 * p);
    case 'water': return n(0.28) * (0.4 + 0.6 * Math.sin(Math.PI * p)) + tone(240 + 900 * p, 0.07) * e;
    case 'weather': return n(0.33) * e + tone(45, 0.42) * Math.exp(-2 * p);
    case 'fire': return n(0.3) * (0.3 + 0.7 * Math.sin(Math.PI * p)) + tone(65, 0.15) * Math.exp(-2 * p);
    case 'music': {
        const base = high ? 880 : low ? 110 : 440;
        return (tone(base, 0.34) + tone(base * 1.25, 0.2) + tone(base * 1.5, 0.15)) * e;
    }
    case 'signal': {
        const base = high ? 1100 : low ? 220 : 660;
        const pulse = 0.5 + 0.5 * Math.sign(Math.sin(2 * Math.PI * (fast ? 8 : 4) * t));
        return (tone(base, 0.55) + tone(base * 2, 0.12)) * pulse * e;
    }
    case 'fantasy': {
        const base = high ? 760 : low ? 100 : 340;
        return (tone(base, 0.32) + tone(base * 3, 0.12) + tone(base * 5, 0.08) + n(0.12)) * e;
    }
    case 'scifi': {
        const base = high ? 920 : low ? 105 : 285;
        const pulse = 0.5 + 0.5 * Math.sign(Math.sin(2 * Math.PI * 8 * t));
        return (tone(base, 0.38) + tone(base * 2, 0.17) + tone(base * 3, 0.08)) * pulse * e;
    }
    case 'environment': case 'nature': return n(0.2) * e + tone(150 + 80 * Math.sin(2 * Math.PI * 0.7 * t), 0.05);
    case 'textural': return n(0.38) * e + tone(high ? 1200 : low ? 95 : 260, 0.12) * Math.exp(-5 * p);
    case 'abstract': {
        if (/noise|static|glitch/.test(text)) return n(0.42) * e;
        if (/sweep/.test(text)) return tone((low ? 120 : 180) + (high ? 4200 : 2200) * p, 0.55) * e;
        if (/drone|pad/.test(text)) return (tone(low ? 65 : 180, 0.34) + tone(low ? 97 : 270, 0.18)) * e;
        const base = high ? 1000 : low ? 100 : 440;
        return (tone(base, 0.5) + tone(base * 2, 0.16) + tone(base * 3, 0.07)) * e;
    }
    default: return tone(high ? 880 : low ? 110 : 440, 0.45) * e;
    }
};

const applyModifiers = (value, text, t) => {
    let output = value;
    if (/8-bit|8 bit|chiptune/.test(text)) output = Math.round(output * 8) / 8;
    if (/distort|crush|clipped/.test(text)) output = Math.tanh(output * 3.5);
    if (/telephone|radio|intercom/.test(text)) output *= 0.72;
    if (/underwater|muffled|muted/.test(text)) output *= 0.55 + 0.12 * Math.sin(2 * Math.PI * 55 * t);
    if (/echo|echoing|echoey|reverb/.test(text)) output *= 0.8 + 0.2 * Math.sin(2 * Math.PI * 2.1 * t);
    if (/wobbly|warped/.test(text)) output *= 0.8 + 0.2 * Math.sin(2 * Math.PI * 4 * t);
    if (/vinyl|lo-fi|lofi/.test(text)) output = Math.round(output * 24) / 24;
    return output;
};

export const generateCatalogSound = async ({prompt, duration = 2}) => {
    const text = String(prompt || '').toLowerCase();
    const safeDuration = clamp(Number(duration) || 2, 0.5, 30);
    const match = resolveSoundFamily(text) || {mode: 'abstract'};
    const sampleCount = Math.max(1, Math.floor(SAMPLE_RATE * safeDuration));
    const random = rng(hashString(text));
    const samples = new Float32Array(sampleCount);

    for (let i = 0; i < sampleCount; i++) {
        const t = i / SAMPLE_RATE;
        const p = t / safeDuration;
        let value = renderFamily(match.mode, text, t, p, safeDuration, random);
        value = applyModifiers(value, text, t);
        if (/quiet|soft|gentle/.test(text)) value *= 0.45;
        if (/loud|very loud/.test(text)) value *= 1.2;
        samples[i] = clamp(value, -0.96, 0.96);
    }

    return {
        data: encodeWav(samples),
        contentType: 'audio/wav',
        metadata: {
            matchedFamily: match.mode,
            baseTerms: SOUND_VOCABULARY_SIZE,
            combinations: SOUND_COMBINATION_COUNT
        }
    };
};

export default generateCatalogSound;