/*
 * Large, composable vocabulary for the local Text to Sound generator.
 * The catalog intentionally describes families rather than one function per
 * sound. A small set of synthesis engines can therefore recognize thousands
 * of natural-language sound descriptions and combine them with modifiers.
 */

const family = (mode, words, options = {}) => ({mode, words, ...options});

export const SOUND_FAMILIES = [
    family('animal', ['dog', 'puppy', 'canine', 'hound', 'bark', 'barking', 'woof', 'arf', 'bow wow']),
    family('animal', ['cat', 'kitten', 'feline', 'meow', 'mew', 'purr', 'hiss']),
    family('animal', ['bird', 'songbird', 'sparrow', 'robin', 'crow', 'raven', 'chirp', 'tweet', 'caw']),
    family('animal', ['owl', 'hoot', 'hoots']),
    family('animal', ['duck', 'quack', 'waterfowl']),
    family('animal', ['goose', 'honk', 'honked']),
    family('animal', ['cow', 'calf', 'cattle', 'moo']),
    family('animal', ['horse', 'pony', 'neigh', 'whinny', 'gallop']),
    family('animal', ['pig', 'hog', 'oink', 'snort']),
    family('animal', ['sheep', 'lamb', 'baa', 'bleat']),
    family('animal', ['goat', 'bleat', 'maa']),
    family('animal', ['chicken', 'hen', 'rooster', 'cluck', 'cock-a-doodle-doo']),
    family('animal', ['frog', 'toad', 'ribbit', 'croak']),
    family('animal', ['lion', 'lioness', 'roar', 'roaring']),
    family('animal', ['tiger', 'growl', 'growling']),
    family('animal', ['bear', 'grizzly', 'growl', 'roar']),
    family('animal', ['wolf', 'wolves', 'howl', 'howling']),
    family('animal', ['fox', 'fox scream', 'yelp']),
    family('animal', ['monkey', 'ape', 'chimp', 'chatter', 'hoot']),
    family('animal', ['elephant', 'trumpet', 'trumpeting']),
    family('animal', ['dolphin', 'clicking dolphin', 'whistle dolphin']),
    family('animal', ['whale', 'whale song', 'whale call']),
    family('animal', ['seal', 'bark seal', 'seal call']),
    family('animal', ['bat', 'bat chirp', 'bat echolocation']),
    family('animal', ['snake', 'hiss', 'hissing']),
    family('animal', ['bee', 'wasp', 'hornet', 'buzz', 'buzzing']),
    family('animal', ['mosquito', 'mosquito buzz']),
    family('animal', ['fly', 'fly buzzing']),
    family('animal', ['cricket', 'crickets', 'chirping cricket']),
    family('animal', ['frog croak', 'frog ribbit']),
    family('animal', ['dinosaur', 'tyrannosaurus', 'trex', 't-rex', 'dinosaur roar']),

    family('impact', ['boom', 'bang', 'slam', 'smash', 'crash', 'thud', 'thump', 'hit', 'impact', 'punch', 'kick', 'knock']),
    family('explosion', ['explosion', 'explode', 'blast', 'detonation', 'firework', 'fireworks']),
    family('metal', ['metal hit', 'metal clang', 'clang', 'clank', 'gong', 'anvil', 'steel']),
    family('wood', ['wood knock', 'wood hit', 'wooden', 'creak', 'creaking', 'floorboard']),
    family('glass', ['glass break', 'glass breaking', 'shatter', 'shattering', 'glass clink', 'tinkle']),
    family('paper', ['paper rustle', 'paper tear', 'page turn', 'book page', 'paper crumple']),
    family('plastic', ['plastic crinkle', 'wrapper', 'bag crinkle', 'cellophane']),
    family('rubber', ['rubber squeak', 'rubber band', 'boing', 'spring']),

    family('vehicle', ['car', 'automobile', 'sedan', 'coupe', 'suv', 'engine', 'motor', 'car horn', 'horn honk']),
    family('vehicle', ['truck', 'lorry', 'semi', 'tractor trailer', 'truck horn']),
    family('vehicle', ['bus', 'school bus', 'bus brake']),
    family('vehicle', ['motorcycle', 'motorbike', 'bike engine']),
    family('vehicle', ['bicycle', 'bike bell', 'bike chain']),
    family('vehicle', ['train', 'locomotive', 'railroad', 'train horn', 'train whistle', 'train brakes']),
    family('vehicle', ['subway', 'metro', 'underground train']),
    family('vehicle', ['tram', 'streetcar']),
    family('vehicle', ['airplane', 'plane', 'jet', 'aircraft', 'jet engine', 'airplane cabin']),
    family('vehicle', ['helicopter', 'heli', 'rotor']),
    family('vehicle', ['boat', 'ship', 'speedboat', 'motorboat']),
    family('vehicle', ['sailboat', 'sailing ship']),
    family('vehicle', ['submarine', 'sonar', 'sub underwater']),
    family('vehicle', ['rocket', 'spaceship', 'spacecraft', 'rocket launch']),

    family('machine', ['drill', 'power drill', 'electric drill']),
    family('machine', ['saw', 'chainsaw', 'circular saw', 'buzz saw']),
    family('machine', ['vacuum', 'vacuum cleaner']),
    family('machine', ['fan', 'ceiling fan', 'box fan']),
    family('machine', ['printer', 'laser printer', 'printer jam']),
    family('machine', ['copier', 'photocopier']),
    family('machine', ['typewriter', 'typewriter key']),
    family('machine', ['keyboard', 'computer keyboard', 'mechanical keyboard']),
    family('machine', ['mouse click', 'computer mouse']),
    family('machine', ['hard drive', 'disk drive', 'floppy drive']),
    family('machine', ['washing machine', 'washer']),
    family('machine', ['dryer', 'clothes dryer']),
    family('machine', ['dishwasher']),
    family('machine', ['microwave', 'microwave beep']),
    family('machine', ['refrigerator', 'fridge', 'fridge hum']),
    family('machine', ['air conditioner', 'ac unit']),
    family('machine', ['elevator', 'elevator bell']),
    family('machine', ['escalator']),
    family('machine', ['cash register', 'register beep']),
    family('machine', ['vending machine']),
    family('machine', ['slot machine']),
    family('machine', ['arcade machine', 'arcade cabinet']),

    family('door', ['door', 'door open', 'door close', 'door slam', 'door creak', 'hinge']),
    family('door', ['drawer', 'drawer open', 'drawer close']),
    family('door', ['cabinet', 'cabinet door']),
    family('door', ['gate', 'gate open', 'gate close']),
    family('door', ['garage door', 'garage']),
    family('door', ['lock', 'unlock', 'key turn', 'door lock']),

    family('footstep', ['footstep', 'footsteps', 'walk', 'walking', 'running', 'run', 'step', 'shoe', 'sneaker', 'boot']),
    family('footstep', ['tap dance', 'dance step']),
    family('footstep', ['snow footsteps', 'snow walking']),
    family('footstep', ['mud footsteps', 'mud walking']),
    family('footstep', ['gravel footsteps', 'gravel walking']),

    family('water', ['water', 'splash', 'splashing', 'drop', 'drip', 'droplet', 'dripping']),
    family('water', ['rain', 'raindrop', 'rainstorm', 'rainfall']),
    family('water', ['ocean', 'sea', 'wave', 'waves', 'surf']),
    family('water', ['river', 'stream', 'creek', 'brook']),
    family('water', ['waterfall', 'cascade']),
    family('water', ['fountain', 'water fountain']),
    family('water', ['swimming', 'pool', 'pool splash']),
    family('water', ['underwater', 'under water']),

    family('weather', ['thunder', 'thunderclap', 'thunderstorm']),
    family('weather', ['lightning', 'electric storm']),
    family('weather', ['wind', 'breeze', 'gust', 'wind gust']),
    family('weather', ['blizzard', 'snowstorm', 'snow']),
    family('weather', ['hurricane', 'tornado', 'storm']),

    family('fire', ['fire', 'flame', 'flames', 'bonfire', 'campfire']),
    family('fire', ['fireplace', 'fire crackle', 'fireplace crackle']),
    family('fire', ['torch', 'flame torch']),
    family('fire', ['match', 'match strike', 'match light']),

    family('music', ['piano', 'piano key', 'grand piano']),
    family('music', ['guitar', 'acoustic guitar', 'electric guitar', 'guitar strum']),
    family('music', ['bass', 'bass guitar', 'sub bass']),
    family('music', ['violin', 'cello', 'viola', 'string instrument']),
    family('music', ['flute', 'piccolo', 'woodwind']),
    family('music', ['clarinet', 'oboe', 'bassoon']),
    family('music', ['trumpet', 'trombone', 'tuba', 'brass']),
    family('music', ['saxophone', 'sax', 'alto sax']),
    family('music', ['drum', 'kick drum', 'snare', 'tom', 'toms']),
    family('music', ['cymbal', 'crash cymbal', 'ride cymbal', 'hi-hat']),
    family('music', ['xylophone', 'marimba', 'mallet']),
    family('music', ['organ', 'church organ']),
    family('music', ['synth', 'synthesizer', 'synth lead', 'synth pad']),
    family('music', ['music box', 'toy piano']),

    family('signal', ['beep', 'beep beep', 'bleep', 'ui beep', 'notification']),
    family('signal', ['click', 'mouse click', 'button click', 'switch click']),
    family('signal', ['ding', 'chime', 'notification chime']),
    family('signal', ['alarm', 'alarm clock', 'warning alarm', 'siren']),
    family('signal', ['phone', 'telephone', 'ringtone', 'phone ring']),
    family('signal', ['camera', 'camera shutter', 'photo shutter']),
    family('signal', ['radio', 'walkie talkie', 'intercom', 'megaphone']),
    family('signal', ['computer startup', 'computer shutdown', 'system alert']),
    family('signal', ['error sound', 'error beep']),
    family('signal', ['power up', 'power down', 'level up', 'game over']),

    family('voice', ['scream', 'screaming', 'shout', 'shouting', 'yell', 'yelling', 'shriek']),
    family('voice', ['laugh', 'laughing', 'laughter', 'giggle', 'chuckle']),
    family('voice', ['cry', 'crying', 'sob', 'sobbing', 'whimper']),
    family('voice', ['whisper', 'whispering']),
    family('voice', ['cough', 'coughing', 'sneeze', 'sneezing', 'hiccup', 'hiccups']),
    family('voice', ['breath', 'breathing', 'inhale', 'exhale', 'gasp']),
    family('voice', ['snore', 'snoring']),
    family('voice', ['crowd', 'cheering', 'applause', 'booing']),

    family('fantasy', ['magic', 'spell', 'wizard', 'wand', 'magic sparkle', 'fairy']),
    family('fantasy', ['dragon', 'dragon roar', 'dragon breath']),
    family('fantasy', ['monster', 'monster roar', 'creature']),
    family('fantasy', ['ghost', 'ghostly', 'haunted', 'spooky']),
    family('fantasy', ['vampire', 'bat vampire']),
    family('fantasy', ['zombie', 'zombie groan']),

    family('scifi', ['alien', 'alien radio', 'alien voice']),
    family('scifi', ['laser', 'laser beam', 'plasma', 'energy weapon']),
    family('scifi', ['spaceship', 'starship', 'space station', 'airlock']),
    family('scifi', ['robot', 'android', 'cyborg', 'mechanical voice']),
    family('scifi', ['teleporter', 'portal', 'warp', 'hyperspace']),
    family('scifi', ['ray gun', 'blaster', 'phaser']),

    family('environment', ['forest', 'jungle', 'woods', 'trees', 'leaves', 'rustling leaves']),
    family('environment', ['cave', 'cavern', 'echo cave']),
    family('environment', ['city', 'street', 'traffic', 'downtown']),
    family('environment', ['school', 'classroom', 'hallway']),
    family('environment', ['factory', 'warehouse', 'workshop']),
    family('environment', ['office', 'room tone', 'room ambience']),
    family('environment', ['restaurant', 'cafe', 'coffee shop']),
    family('environment', ['stadium', 'arena', 'concert crowd']),

    family('nature', ['birdsong', 'birds singing', 'forest birds']),
    family('nature', ['crickets', 'night insects', 'insects']),
    family('nature', ['leaves', 'leaf', 'rustling leaves']),
    family('nature', ['branch snap', 'twig snap', 'stick break']),
    family('nature', ['campfire', 'fireflies', 'night forest']),

    family('abstract', ['tone', 'sine', 'oscillator', 'frequency']),
    family('abstract', ['sweep', 'frequency sweep', 'pitch sweep']),
    family('abstract', ['drone', 'ambient drone', 'pad']),
    family('abstract', ['pulse', 'pulsing', 'rhythmic pulse']),
    family('abstract', ['noise', 'white noise', 'pink noise', 'brown noise']),
    family('abstract', ['static', 'glitch', 'digital glitch']),
    family('abstract', ['reverb', 'echo', 'delay']),
    family('abstract', ['ring modulation', 'ring mod']),
    family('abstract', ['bitcrusher', 'bit crush', 'lofi']),

    family('textural', ['sand', 'sandstorm', 'grains', 'grain']),
    family('textural', ['gravel', 'stones', 'pebbles', 'rocks']),
    family('textural', ['ice', 'ice crack', 'snow crunch']),
    family('textural', ['metal pipe', 'pipe hit', 'pipes']),
    family('textural', ['rubber', 'rubber squeak', 'ball bounce']),
    family('textural', ['ball bounce', 'basketball', 'tennis ball']),
    family('textural', ['coin', 'coins', 'coin drop']),
    family('textural', ['dice', 'dice roll']),
];

const MODIFIERS = [
    ['tiny', 'small', 'miniature'],
    ['huge', 'giant', 'massive', 'enormous'],
    ['near', 'close'],
    ['far', 'distant'],
    ['fast', 'rapid', 'quick'],
    ['slow', 'slowed'],
    ['high', 'high pitched', 'high-pitched'],
    ['low', 'deep', 'low pitched', 'low-pitched'],
    ['loud', 'very loud'],
    ['quiet', 'soft', 'gentle'],
    ['old', 'vintage', 'retro'],
    ['digital', 'electronic'],
    ['analog', 'analogue'],
    ['metallic', 'metal'],
    ['wooden', 'wood'],
    ['cartoon', 'funny'],
    ['realistic', 'natural'],
    ['muffled', 'muted'],
    ['distorted', 'crushed'],
    ['echoing', 'echoey', 'reverberant'],
    ['underwater', 'submerged'],
    ['telephone', 'phone'],
    ['radio', 'intercom'],
    ['8-bit', '8 bit', 'chiptune'],
    ['robotic', 'robot'],
    ['alien', 'alienized'],
    ['ghostly', 'haunted'],
    ['futuristic', 'sci-fi'],
    ['vinyl', 'lo-fi', 'vinyl lo-fi'],
    ['glitchy', 'glitch'],
    ['warped', 'wobbly'],
    ['surround', 'wide'],
    ['mono', 'monophonic'],
];

export const SOUND_VOCABULARY_SIZE = SOUND_FAMILIES.reduce((count, item) => count + item.words.length, 0);
export const SOUND_COMBINATION_COUNT = SOUND_FAMILIES.length * MODIFIERS.length;

export const resolveSoundFamily = text => {
    const normalized = String(text || '').toLowerCase();
    let best = null;
    let bestLength = 0;

    for (const item of SOUND_FAMILIES) {
        for (const word of item.words) {
            if (normalized.includes(word) && word.length > bestLength) {
                best = item;
                bestLength = word.length;
            }
        }
    }

    return best;
};

export const getSoundVocabularyStats = () => ({
    baseTerms: SOUND_VOCABULARY_SIZE,
    modifierGroups: MODIFIERS.length,
    combinations: SOUND_COMBINATION_COUNT
});

export default {
    SOUND_FAMILIES,
    MODIFIERS,
    SOUND_VOCABULARY_SIZE,
    SOUND_COMBINATION_COUNT,
    resolveSoundFamily,
    getSoundVocabularyStats
};