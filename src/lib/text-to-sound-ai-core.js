/*
 * Text to Sound AI core.
 *
 * The local generator is the default so this feature works on a static
 * GitHub Pages deployment without a server or API key. A provider can still
 * be registered with setGenerator() when a real text-to-audio service is
 * available.
 */

import {soundUpload} from './file-uploader.js';

const SAMPLE_RATE = 44100;
const DEFAULT_DURATION = 2;
const MIN_DURATION = 0.5;
const MAX_DURATION = 30;
const DEFAULT_ENDPOINT = '/api/text-to-sound-ai';

let generator = null;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const clampDuration = duration => {
    const value = Number(duration);
    return Number.isFinite(value) ? clamp(value, MIN_DURATION, MAX_DURATION) : DEFAULT_DURATION;
};

const normalizeRequest = request => {
    const source = typeof request === 'string' ? {prompt: request} : (request || {});
    return {
        prompt: typeof source.prompt === 'string' ? source.prompt.trim() : '',
        duration: clampDuration(source.duration),
        loop: Boolean(source.loop),
        promptInfluence: Number.isFinite(Number(source.promptInfluence)) ?
            clamp(Number(source.promptInfluence), 0, 1) : 0.3
    };
};

export const setGenerator = nextGenerator => {
    if (nextGenerator !== null && typeof nextGenerator !== 'function') {
        throw new TypeError('Text-to-sound generator must be a function or null.');
    }
    generator = nextGenerator;
};
export const getGenerator = () => generator;

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
        state = Math.imul(state + 0x6D2B79F5, 1) >>> 0;
        let t = state;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
};

const hasAny = (text, words) => words.some(word => text.includes(word));
const env = (t, duration, attack = 0.015, release = 0.12) => {
    if (t <= attack) return t / Math.max(attack, 0.0001);
    if (t >= duration - release) return clamp((duration - t) / Math.max(release, 0.0001), 0, 1);
    return 1;
};
const osc = (frequency, t, type = 'sine') => {
    const phase = 2 * Math.PI * frequency * t;
    if (type === 'square') return Math.sign(Math.sin(phase)) || 1;
    if (type === 'triangle') return 2 * Math.abs(2 * ((frequency * t) % 1) - 1) - 1;
    if (type === 'saw') return 2 * ((frequency * t) % 1) - 1;
    return Math.sin(phase);
};
const softClip = value => Math.tanh(value * 2.2);

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
        view.setInt16(44 + i * 2, clamp(Math.round(samples[i] * 32767), -32768, 32767), true);
    }
    return buffer;
};

const classify = text => {
    const groups = [
        ['scream', ['scream', 'screaming', 'shout', 'shouting', 'yell', 'yelling', 'shriek']],
        ['laugh', ['laugh', 'laughter', 'giggle', 'chuckle', 'haha']],
        ['cry', ['cry', 'crying', 'sob', 'sobbing', 'whimper']],
        ['animal-dog', ['dog bark', 'dog barking', 'puppy bark']],
        ['animal-cat', ['cat meow', 'cat miaow', 'kitten meow']],
        ['animal-bird', ['bird chirp', 'chirping', 'tweet', 'sparrow', 'robin']],
        ['animal-cow', ['cow moo', 'mooing']],
        ['animal-horse', ['horse neigh', 'neigh']],
        ['animal-frog', ['frog croak', 'croak']],
        ['animal-lion', ['lion roar', 'roar', 'roaring']],
        ['animal-pig', ['pig oink', 'oink']],
        ['animal-duck', ['duck quack', 'quack']],
        ['animal-sheep', ['sheep baa', 'baa', 'bahh']],
        ['animal-chicken', ['chicken cluck', 'cluck']],
        ['animal-wolf', ['wolf howl', 'howl', 'howling']],
        ['explosion', ['explosion', 'explode', 'blast', 'detonation']],
        ['impact', ['impact', 'thump', 'slam', 'hit', 'punch', 'kick', 'crash']],
        ['boom', ['boom', 'bang', 'cannon', 'bass drop']],
        ['gun', ['gunshot', 'shotgun', 'pistol', 'rifle', 'bullet']],
        ['laser', ['laser', 'zap', 'zapper', 'ray', 'plasma']],
        ['rocket', ['rocket', 'spaceship launch', 'launch']],
        ['engine', ['engine', 'motor', 'machine', 'generator']],
        ['car', ['car horn', 'horn', 'honk', 'car engine', 'vehicle']],
        ['train', ['train', 'locomotive', 'railway']],
        ['plane', ['airplane', 'aircraft', 'jet', 'jet engine']],
        ['helicopter', ['helicopter', 'rotor']],
        ['drill', ['drill', 'power drill']],
        ['saw', ['chainsaw', 'sawing', 'circular saw']],
        ['vacuum', ['vacuum cleaner', 'vacuum']],
        ['clock', ['clock tick', 'tick tock', 'clock', 'ticking']],
        ['alarm', ['alarm', 'sirens', 'siren', 'emergency alarm']],
        ['door', ['door creak', 'door slam', 'door open', 'door close', 'creaking door']],
        ['footsteps', ['footsteps', 'walking', 'running footsteps', 'step']],
        ['water', ['water splash', 'splash', 'drip', 'droplet', 'water drop', 'wave']],
        ['rain', ['rain', 'raindrops', 'rainstorm']],
        ['thunder', ['thunder', 'thunderclap', 'lightning']],
        ['wind', ['wind', 'breeze', 'gust']],
        ['fire', ['fire', 'flame', 'campfire', 'burning', 'fireplace']],
        ['frying', ['frying', 'sizzle', 'sizzling']],
        ['coffee', ['coffee machine', 'espresso', 'coffee']],
        ['typing', ['typing', 'keyboard', 'computer keys']],
        ['camera', ['camera shutter', 'shutter', 'photograph']],
        ['notification', ['notification', 'message alert', 'ding', 'pop-up']],
        ['phone', ['phone ringing', 'telephone ringing', 'phone call']],
        ['radio', ['radio', 'walkie talkie', 'intercom', 'military radio']],
        ['robot', ['robot', 'android', 'bot', 'robotic']],
        ['computer', ['computer startup', 'computer shutdown', 'system beep']],
        ['arcade', ['arcade', 'game over', 'coin', '8-bit', 'chiptune', 'retro game']],
        ['bell', ['bell', 'chime', 'ding', 'gong']],
        ['glass', ['glass break', 'glass shatter', 'shatter']],
        ['metal', ['metal clang', 'clang', 'anvil', 'metal pipes']],
        ['wood', ['wood knock', 'knock', 'wooden']],
        ['buzz', ['buzz', 'bee', 'beehive', 'electric hum']],
        ['crackle', ['crackle', 'static', 'interference', 'vinyl crackle', 'vhs']],
        ['click', ['click', 'tick', 'tap', 'button', 'switch']],
        ['beep', ['beep', 'beeping', 'buzzer']],
        ['whoosh', ['whoosh', 'swoosh', 'swish', 'whoosh past']],
        ['whistle', ['whistle', 'whistling']],
        ['heartbeat', ['heartbeat', 'heart beat', 'pulse']],
        ['drum', ['drum', 'drums', 'snare', 'kick drum']],
        ['cymbal', ['cymbal', 'crash cymbal']],
        ['piano', ['piano', 'piano note', 'keyboard instrument']],
        ['guitar', ['guitar', 'acoustic guitar', 'electric guitar']],
        ['violin', ['violin', 'fiddle']],
        ['flute', ['flute', 'woodwind']],
        ['sax', ['saxophone', 'sax']],
        ['trumpet', ['trumpet', 'brass']],
        ['bass', ['bass', 'sub bass', 'deep bass']],
        ['noise', ['noise', 'white noise', 'pink noise', 'brown noise']],
        ['tone', ['tone', 'sine wave', 'test tone', 'frequency']],
        ['sweep', ['sweep', 'riser', 'rising tone', 'falling tone']]
    ];
    for (const [mode, words] of groups) {
        if (hasAny(text, words)) return mode;
    }
    return 'tone';
};

const render = ({prompt, duration}) => {
    const text = prompt.toLowerCase();
    const mode = classify(text);
    const count = Math.floor(SAMPLE_RATE * duration);
    const random = rng(hashString(text));
    const samples = new Float32Array(Math.max(1, count));
    const noise = () => random() * 2 - 1;
    const hz = hasAny(text, ['high', 'high pitched', 'helium']) ? 1.8 :
        hasAny(text, ['low', 'deep', 'bass']) ? 0.55 : 1;

    for (let i = 0; i < samples.length; i++) {
        const t = i / SAMPLE_RATE;
        const p = t / duration;
        const e = env(t, duration);
        let value = 0;

        switch (mode) {
        case 'scream': {
            const f = 240 * hz + 820 * p * hz + 18 * Math.sin(2 * Math.PI * 6 * t);
            value = (
                osc(f, t) * 0.55 +
                osc(f * 2.01, t) * 0.18 +
                osc(f * 3.03, t) * 0.1 +
                noise() * 0.17
            ) * e;
            break;
        }
        case 'laugh': {
            const pulse = Math.max(0, Math.sin(2 * Math.PI * 5.2 * t));
            const f = 330 * hz + 100 * Math.sin(2 * Math.PI * 0.7 * t);
            value = (osc(f, t, 'saw') * 0.4 + noise() * 0.07) * pulse * e;
            break;
        }
        case 'cry': {
            const f = 420 * hz + 120 * Math.sin(2 * Math.PI * 4 * t);
            value = (osc(f, t) * 0.45 + osc(f * 2, t) * 0.1 + noise() * 0.1) * e;
            break;
        }
        case 'animal-dog': {
            const bark = Math.max(0, Math.sin(2 * Math.PI * 3.1 * t));
            value = (noise() * 0.45 + osc(180 * hz + 80 * bark, t, 'saw') * 0.42) * bark * e;
            break;
        }
        case 'animal-cat': {
            const f = 500 * hz + 260 * p;
            value = (osc(f, t) * 0.55 + osc(f * 2.3, t) * 0.15 + noise() * 0.06) * e;
            break;
        }
        case 'animal-bird': {
            const trill = Math.sin(2 * Math.PI * (8 + 7 * p) * t);
            value = osc(1400 * hz + 900 * trill, t) * 0.42 * e;
            break;
        }
        case 'animal-cow': {
            const f = 120 * hz + 20 * Math.sin(2 * Math.PI * 2 * t);
            value = (osc(f, t, 'saw') * 0.5 + osc(f * 2, t) * 0.2) * e;
            break;
        }
        case 'animal-horse': {
            const pulse = Math.max(0, Math.sin(2 * Math.PI * 12 * t));
            value = (noise() * 0.24 + osc(95 * hz, t) * 0.38) * pulse * e;
            break;
        }
        case 'animal-frog': {
            const f = 160 * hz + 70 * Math.sin(2 * Math.PI * 5 * t);
            value = (osc(f, t, 'square') * 0.45 + noise() * 0.08) * e;
            break;
        }
        case 'animal-lion': {
            const f = 80 * hz + 30 * Math.sin(2 * Math.PI * 2 * t);
            value = (noise() * 0.22 + osc(f, t, 'saw') * 0.55) * e;
            break;
        }
        case 'animal-pig': {
            const f = 380 * hz + 90 * Math.sin(2 * Math.PI * 8 * t);
            value = osc(f, t, 'square') * 0.42 * e;
            break;
        }
        case 'animal-duck': {
            const f = 700 * hz + 180 * Math.sin(2 * Math.PI * 7 * t);
            value = osc(f, t, 'square') * 0.38 * e;
            break;
        }
        case 'animal-sheep': {
            const f = 500 * hz + 140 * Math.sin(2 * Math.PI * 5 * t);
            value = (osc(f, t) * 0.48 + noise() * 0.05) * e;
            break;
        }
        case 'animal-chicken': {
            const f = 950 * hz + 300 * Math.sin(2 * Math.PI * 9 * t);
            value = osc(f, t, 'square') * 0.3 * Math.max(0, Math.sin(2 * Math.PI * 11 * t)) * e;
            break;
        }
        case 'animal-wolf': {
            const f = 210 * hz + 600 * p;
            value = (osc(f, t) * 0.55 + osc(f * 2, t) * 0.12) * e;
            break;
        }
        case 'explosion': {
            const burst = noise() * Math.exp(-18 * p);
            const boom = osc(70 * hz + 35 * Math.exp(-3 * p), t) * Math.exp(-5 * p);
            value = burst * 0.8 + boom * 0.9;
            break;
        }
        case 'impact': {
            value = noise() * Math.exp(-23 * p) * 0.65 + osc(90 * hz, t) * Math.exp(-14 * p) * 0.75;
            break;
        }
        case 'boom': {
            value = (osc(55 * hz, t) * 0.8 + noise() * 0.3 * Math.exp(-20 * p)) * Math.exp(-7 * p);
            break;
        }
        case 'gun': {
            value = (noise() * 0.95 + osc(120 * hz, t, 'square') * 0.35) * Math.exp(-45 * p);
            break;
        }
        case 'laser': {
            const f = (160 + 2800 * p * p) * hz;
            value = (osc(f, t) + osc(f * 2, t) * 0.22) * e * 0.5;
            break;
        }
        case 'rocket': {
            const f = 100 + 60 * Math.sin(2 * Math.PI * 12 * t);
            value = (noise() * 0.55 + osc(f, t, 'saw') * 0.35) * (0.45 + 0.55 * p) * e;
            break;
        }
        case 'engine': {
            const f = 75 + 16 * Math.sin(2 * Math.PI * 3 * t);
            value = (osc(f, t, 'saw') * 0.46 + osc(f * 2, t) * 0.2 + noise() * 0.12) * e;
            break;
        }
        case 'car': {
            const f = 110 + 40 * Math.sin(2 * Math.PI * 2 * t);
            value = (osc(f, t, 'saw') * 0.5 + noise() * 0.08) * e;
            break;
        }
        case 'train': {
            const chug = Math.max(0, Math.sin(2 * Math.PI * 3.5 * t));
            value = (noise() * 0.25 + osc(90, t, 'saw') * 0.4) * chug * e;
            break;
        }
        case 'plane': {
            const f = 140 + 35 * Math.sin(2 * Math.PI * 1.7 * t);
            value = (noise() * 0.3 + osc(f, t, 'saw') * 0.4) * e;
            break;
        }
        case 'helicopter': {
            const rotor = Math.max(0, Math.sin(2 * Math.PI * 14 * t));
            value = (noise() * 0.28 + osc(95, t) * 0.5) * rotor * e;
            break;
        }
        case 'drill': {
            const f = 220 + 25 * Math.sin(2 * Math.PI * 6 * t);
            value = (osc(f, t, 'saw') * 0.5 + noise() * 0.35) * e;
            break;
        }
        case 'saw': {
            const f = 160 + 20 * Math.sin(2 * Math.PI * 8 * t);
            value = (osc(f, t, 'saw') * 0.5 + noise() * 0.18) * e;
            break;
        }
        case 'vacuum': {
            const f = 95 + 8 * Math.sin(2 * Math.PI * 2 * t);
            value = (noise() * 0.35 + osc(f, t, 'saw') * 0.32) * e;
            break;
        }
        case 'clock': {
            const click = Math.exp(-70 * (t % 0.5));
            value = (noise() * 0.6 + osc(1800, t) * 0.25) * click;
            break;
        }
        case 'alarm': {
            const f = 700 + 170 * Math.sin(2 * Math.PI * 2.2 * t);
            value = osc(f, t, 'square') * 0.38 * e;
            break;
        }
        case 'door': {
            value = (noise() * Math.exp(-20 * p) * 0.4 + osc(85, t) * Math.exp(-15 * p) * 0.5);
            break;
        }
        case 'footsteps': {
            const foot = Math.max(0, Math.sin(2 * Math.PI * 2.3 * t));
            value = (noise() * 0.5 + osc(90, t) * 0.25) * Math.pow(foot, 10) * e;
            break;
        }
        case 'water': {
            value = (noise() * 0.22 + osc(330 + 120 * Math.sin(2 * Math.PI * 1.3 * t), t) * 0.08) * e;
            break;
        }
        case 'rain': {
            const drops = random() > 0.975 ? noise() * 0.9 : 0;
            value = noise() * 0.06 + drops;
            break;
        }
        case 'thunder': {
            value = (noise() * 0.45 + osc(48, t) * 0.55) * Math.exp(-3 * p);
            break;
        }
        case 'wind': {
            value = noise() * (0.15 + 0.4 * Math.sin(Math.PI * p));
            break;
        }
        case 'fire': {
            value = noise() * 0.25 + (random() > 0.992 ? noise() * 0.65 : 0);
            break;
        }
        case 'frying': {
            value = noise() * (random() > 0.97 ? 0.65 : 0.12);
            break;
        }
        case 'coffee': {
            const f = 170 + 15 * Math.sin(2 * Math.PI * 4 * t);
            value = (noise() * 0.18 + osc(f, t, 'saw') * 0.22) * e;
            break;
        }
        case 'typing': {
            const hit = Math.max(0, Math.sin(2 * Math.PI * 7 * t));
            value = (noise() * 0.55 + osc(1100, t) * 0.12) * Math.pow(hit, 16);
            break;
        }
        case 'camera': {
            value = (noise() * 0.9 + osc(130, t) * 0.2) * Math.exp(-55 * p);
            break;
        }
        case 'notification': {
            value = (osc(880 * hz, t) * 0.42 + osc(1320 * hz, t) * 0.18) * e * Math.max(0, Math.sin(2 * Math.PI * 3 * t));
            break;
        }
        case 'phone': {
            const f = 700 + 150 * Math.sin(2 * Math.PI * 5 * t);
            value = osc(f, t, 'square') * 0.34 * Math.max(0, Math.sin(2 * Math.PI * 2.2 * t)) * e;
            break;
        }
        case 'radio': {
            value = noise() * 0.14 + osc(190, t, 'square') * 0.08;
            break;
        }
        case 'robot': {
            const f = 240 * hz;
            const gate = 0.5 + 0.5 * Math.sin(2 * Math.PI * 8 * t);
            value = (osc(f, t, 'square') * 0.38 + osc(f * 2, t) * 0.18 + noise() * 0.06) * gate * e;
            break;
        }
        case 'computer': {
            value = (osc(880, t) * 0.35 + osc(1760, t) * 0.12) * e;
            break;
        }
        case 'arcade': {
            const f = 180 + Math.round(600 * p / 50) * 50;
            value = osc(f * hz, t, 'square') * 0.34 * e;
            break;
        }
        case 'bell': {
            value = (osc(620 * hz, t) * 0.45 + osc(1240 * hz, t) * 0.22 + osc(1860 * hz, t) * 0.1) * Math.exp(-3.5 * p);
            break;
        }
        case 'glass': {
            value = (osc(2200 * hz + 500 * p, t) * 0.42 + noise() * 0.22) * Math.exp(-8 * p);
            break;
        }
        case 'metal': {
            value = (osc(420, t) * 0.4 + osc(990, t) * 0.15 + noise() * 0.08) * Math.exp(-5 * p);
            break;
        }
        case 'wood': {
            value = (osc(180, t) * 0.5 + noise() * 0.18) * Math.exp(-12 * p);
            break;
        }
        case 'buzz': {
            const f = 110 + 18 * Math.sin(2 * Math.PI * 3 * t);
            value = (osc(f, t) * 0.35 + osc(f * 2, t) * 0.2 + osc(f * 3, t) * 0.12 + noise() * 0.08) * e;
            break;
        }
        case 'crackle': {
            value = noise() * 0.07 + (random() > 0.985 ? noise() * 0.9 : 0);
            break;
        }
        case 'click': {
            value = (noise() * 0.7 + osc(1600, t) * 0.25) * Math.exp(-85 * p);
            break;
        }
        case 'beep': {
            const f = 880 * hz + 180 * Math.sin(2 * Math.PI * 2 * t);
            value = osc(f, t) * 0.45 * e;
            break;
        }
        case 'whoosh': {
            const shapedNoise = noise() * Math.sin(Math.PI * p);
            value = shapedNoise * (0.15 + 0.7 * p);
            break;
        }
        case 'whistle': {
            const f = (1000 + 900 * p) * hz;
            value = osc(f, t) * 0.42 * e;
            break;
        }
        case 'heartbeat': {
            const beat = t % 0.82;
            const first = Math.exp(-35 * beat);
            const second = beat > 0.16 ? Math.exp(-50 * (beat - 0.16)) : 0;
            value = osc(62 * hz, t) * (first * 0.85 + second * 0.6);
            break;
        }
        case 'drum': {
            const body = osc(80 * Math.exp(-2 * p) + 45, t) * Math.exp(-12 * p);
            const attack = noise() * Math.exp(-55 * p);
            value = body * 0.7 + attack * 0.35;
            break;
        }
        case 'cymbal': {
            value = noise() * Math.exp(-4.5 * p) * 0.55;
            break;
        }
        case 'piano': {
            const f = 261.63 * Math.pow(2, Math.round(4 * p) / 12) * hz;
            value = (osc(f, t) * 0.5 + osc(f * 2, t) * 0.2 + osc(f * 3, t) * 0.08) * Math.exp(-4 * p);
            break;
        }
        case 'guitar': {
            const f = 196 * Math.pow(2, Math.round(5 * p) / 12) * hz;
            value = (osc(f, t) * 0.5 + osc(f * 2, t, 'triangle') * 0.18) * Math.exp(-3 * p);
            break;
        }
        case 'violin': {
            const f = 330 * hz + 12 * Math.sin(2 * Math.PI * 5 * t);
            value = (osc(f, t, 'saw') * 0.38 + osc(f * 2, t) * 0.15) * e;
            break;
        }
        case 'flute': {
            const f = 520 * hz + 8 * Math.sin(2 * Math.PI * 5 * t);
            value = (osc(f, t) * 0.42 + noise() * 0.03) * e;
            break;
        }
        case 'sax': {
            const f = 220 * hz + 7 * Math.sin(2 * Math.PI * 5 * t);
            value = (osc(f, t, 'saw') * 0.45 + osc(f * 2, t) * 0.12) * e;
            break;
        }
        case 'trumpet': {
            const f = 247 * hz;
            value = (osc(f, t, 'square') * 0.25 + osc(f * 2, t) * 0.35 + osc(f * 3, t) * 0.1) * e;
            break;
        }
        case 'bass': {
            const f = 65 * hz;
            value = (osc(f, t) * 0.65 + osc(f * 2, t) * 0.12) * e;
            break;
        }
        case 'noise': {
            const tint = hasAny(text, ['pink', 'brown']) ? (0.7 + 0.3 * p) : 1;
            value = noise() * 0.25 * tint;
            break;
        }
        case 'sweep': {
            const f = (80 + 3000 * p * p) * hz;
            value = (osc(f, t) * 0.5 + osc(f * 1.5, t) * 0.08) * e;
            break;
        }
        default: {
            // Natural-sounding generic fallback: a short tone with vibrato,
            // harmonics, and a light noise bed, intentionally not a whoosh.
            const f = 220 * hz + 180 * Math.sin(2 * Math.PI * 2.2 * t);
            value = (osc(f, t) * 0.44 + osc(f * 2.01, t) * 0.14 + noise() * 0.025) * e;
            break;
        }
        }

        if (hasAny(text, ['8-bit', 'chiptune'])) value = Math.round(value * 8) / 8;
        if (hasAny(text, ['distorted', 'distortion', 'clipped', 'fuzz'])) value = softClip(value * 2.8);
        if (hasAny(text, ['telephone', 'old phone'])) value = (value + noise() * 0.018) * 0.9;
        if (hasAny(text, ['radio', 'walkie'])) value = value * 0.75 + noise() * 0.04;
        if (hasAny(text, ['underwater'])) value *= 0.82;

        samples[i] = clamp(value, -0.98, 0.98);
    }

    return {
        data: encodeWav(samples),
        contentType: 'audio/wav'
    };
};

export const generateLocally = async request => render(normalizeRequest(request));

export const generateWithProvider = async (request, endpoint = DEFAULT_ENDPOINT) => {
    const normalized = normalizeRequest(request);
    if (!normalized.prompt) throw new Error('A sound description is required.');
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin',
        body: JSON.stringify(normalized)
    });
    if (!response.ok) {
        let message = `Sound provider failed (${response.status}).`;
        try {
            const error = await response.json();
            if (error && error.error) message = error.error;
        } catch (e) {
            // Keep the status message.
        }
        throw new Error(message);
    }
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('audio/')) throw new Error('The sound provider did not return audio.');
    return {data: await response.arrayBuffer(), contentType};
};

export const generateSound = async request => {
    const normalized = normalizeRequest(request);
    if (!normalized.prompt) throw new Error('A sound description is required.');
    return generator ? generator(normalized) : generateLocally(normalized);
};

export const generateAndAddSound = async (request, vm, targetId) => {
    if (!vm || !vm.runtime || !vm.runtime.storage) {
        throw new Error('A Scratch VM is required to add the generated sound.');
    }
    const normalized = normalizeRequest(request);
    const result = await generateSound(normalized);
    const data = result && result.data ? result.data : result;
    const contentType = result && result.contentType ? result.contentType : 'audio/wav';
    const buffer = data instanceof ArrayBuffer ? data : await new Response(data).arrayBuffer();
    const storage = vm.runtime.storage;
    return new Promise((resolve, reject) => {
        try {
            soundUpload(buffer, contentType, storage, vmSound => {
                vmSound.name = normalized.prompt.slice(0, 40) || 'AI Sound';
                Promise.resolve(vm.addSound(vmSound, targetId)).then(() => resolve(vmSound)).catch(reject);
            }, reject);
        } catch (error) {
            reject(error);
        }
    });
};

if (typeof window !== 'undefined') {
    window.addEventListener('larrymod-text-to-sound-ai', async event => {
        const detail = event.detail || {};
        if (!detail.vm) {
            window.dispatchEvent(new CustomEvent('larrymod-text-to-sound-ai-error', {
                detail: {error: new Error('A Scratch VM was not provided.'), request: normalizeRequest(detail)}
            }));
            return;
        }
        try {
            const sound = await generateAndAddSound(detail, detail.vm, detail.targetId);
            window.dispatchEvent(new CustomEvent('larrymod-text-to-sound-ai-complete', {
                detail: {sound, request: normalizeRequest(detail)}
            }));
        } catch (error) {
            window.dispatchEvent(new CustomEvent('larrymod-text-to-sound-ai-error', {
                detail: {error, request: normalizeRequest(detail)}
            }));
        }
    });
}

export const dispatchGenerateEvent = (request, target = window) => {
    const normalized = normalizeRequest(request);
    if (!normalized.prompt) throw new Error('A sound description is required.');
    const event = new CustomEvent('larrymod-text-to-sound-ai', {detail: normalized});
    target.dispatchEvent(event);
    return event;
};

export const constants = {DEFAULT_DURATION, MIN_DURATION, MAX_DURATION, DEFAULT_ENDPOINT};

export default {
    setGenerator,
    getGenerator,
    generateLocally,
    generateWithProvider,
    generateSound,
    generateAndAddSound,
    dispatchGenerateEvent,
    constants
};