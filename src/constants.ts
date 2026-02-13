// src/constants.ts

// The permanent home for your assets on GitHub
const BASE_URL =
  "https://raw.githubusercontent.com/rajsinghgill/jb-phonics-lab-v3/main/public/assets";

// --- 1. CORE ASSETS ---
export const ASSET_PATHS = {
  // mapped to /core
  CORE: {
    LOGO: `${BASE_URL}/core/logo.png`,
    BACKGROUND: `${BASE_URL}/core/background.png`,
    LOGIN_HERO: `${BASE_URL}/core/login-hero-square.png`,
  },

  // mapped to /cards
  CARDS: {
    PHONICS_LAB: `${BASE_URL}/cards/card-phonics-lab.png`,
    YOUNG_READERS: `${BASE_URL}/cards/card-young-readers.png`,
  },

  // mapped to /games (Buttons)
  GAMES: {
    BTN_CHEFS: `${BASE_URL}/games/btn-chefs-challenge.png`,
    BTN_CROSS: `${BASE_URL}/games/btn-cross-the-road.png`,
    BTN_SNAKE: `${BASE_URL}/games/btn-hungry-snake.png`,
    BTN_SUPER_A: `${BASE_URL}/games/btn-super-a-jump.png`,
    BTN_THEO: `${BASE_URL}/games/btn-theo-the-thirsty-thief.png`,
    BTN_TREX: `${BASE_URL}/games/btn-trex-hero.png`,
  },

  // mapped to /icons
  ICONS: {
    ARCADE: `${BASE_URL}/icons/arcade-vector.png`,
    MY_CLASS: `${BASE_URL}/icons/my-class-vector.png`,
    MY_CLASSROOM: `${BASE_URL}/icons/my-classroom-vector.png`,
  },

  // mapped to /lessons/audio
  AUDIO: {
    CH: {
      SOUND: `${BASE_URL}/lessons/audio/ch/ch-sound.mp3`,
      CHAT: `${BASE_URL}/lessons/audio/ch/chat-sound.mp3`,
      CHIP: `${BASE_URL}/lessons/audio/ch/chip-sound.mp3`,
      CHOP: `${BASE_URL}/lessons/audio/ch/chop-sound.mp3`,
      CHUG: `${BASE_URL}/lessons/audio/ch/chug-sound.mp3`,
      SENTENCE: `${BASE_URL}/lessons/audio/ch/i-chat-with-my-friend.mp3`,
    },
    P: {
      SOUND: `${BASE_URL}/lessons/audio/p/p-sound.mp3`,
      PARK: `${BASE_URL}/lessons/audio/p/park-sound.mp3`,
      PET: `${BASE_URL}/lessons/audio/p/pet-sound.mp3`,
      PLAY: `${BASE_URL}/lessons/audio/p/play-sound.mp3`,
      POT: `${BASE_URL}/lessons/audio/p/pot-sound.mp3`,
    },
    T: {
      SOUND: `${BASE_URL}/lessons/audio/t/t-sound.mp3`,
      TABLE: `${BASE_URL}/lessons/audio/t/table-sound.mp3`,
      TEACHER: `${BASE_URL}/lessons/audio/t/teacher-sound.mp3`,
      TIGER: `${BASE_URL}/lessons/audio/t/tiger-sound.mp3`,
      TREE: `${BASE_URL}/lessons/audio/t/tree-sound.mp3`,
    },
    TH: {
      SOUND: `${BASE_URL}/lessons/audio/th/th-sound.mp3`,
      TEETH: `${BASE_URL}/lessons/audio/th/teeth-sound.mp3`,
      THIN: `${BASE_URL}/lessons/audio/th/thin-sound.mp3`,
      THINK: `${BASE_URL}/lessons/audio/th/think-sound.mp3`,
      THREE: `${BASE_URL}/lessons/audio/th/three-sound.mp3`,
    },
  },
};

// --- 2. HELPER FUNCTION ---
export const getAssetUrl = (path: string | undefined, context?: string) => {
  if (!path) {
    // Only warn if we expected a path but got undefined
    if (context) console.warn(`Missing asset for: ${context}`);
    return "https://via.placeholder.com/150";
  }
  return path;
};

// --- 3. LEVEL CONTENT LISTS ---
// NOTE: Sound card images (card-s.png, etc.) were NOT in the list.
// Images set to undefined to prevent 404s.

export const LEVEL_1_CONTENT = [
  { id: "s", alt: "S Sound", image: undefined },
  { id: "a", alt: "A Sound", image: undefined },
  { id: "t", alt: "T Sound", image: undefined },
  { id: "p", alt: "P Sound", image: undefined },
  { id: "i", alt: "I Sound", image: undefined },
  { id: "n", alt: "N Sound", image: undefined },
  { id: "m", alt: "M Sound", image: undefined },
  { id: "d", alt: "D Sound", image: undefined },
  { id: "g", alt: "G Sound", image: undefined },
  { id: "o", alt: "O Sound", image: undefined },
  { id: "c", alt: "C Sound", image: undefined },
  { id: "k", alt: "K Sound", image: undefined },
  { id: "ck", alt: "CK Sound", image: undefined },
  { id: "e", alt: "E Sound", image: undefined },
  { id: "u", alt: "U Sound", image: undefined },
  { id: "r", alt: "R Sound", image: undefined },
  { id: "h", alt: "H Sound", image: undefined },
  { id: "b", alt: "B Sound", image: undefined },
  { id: "f", alt: "F Sound", image: undefined },
  { id: "l", alt: "L Sound", image: undefined },
  { id: "j", alt: "J Sound", image: undefined },
  { id: "v", alt: "V Sound", image: undefined },
  { id: "w", alt: "W Sound", image: undefined },
  { id: "x", alt: "X Sound", image: undefined },
  { id: "y", alt: "Y Sound", image: undefined },
  { id: "z", alt: "Z Sound", image: undefined },
  { id: "qu", alt: "QU Sound", image: undefined },
];

export const LEVEL_2_CONTENT = [
  { id: "sh", alt: "SH Sound", image: undefined },
  { id: "ch", alt: "CH Sound", image: undefined },
  { id: "th", alt: "TH Sound", image: undefined },
  { id: "ng", alt: "NG Sound", image: undefined },
  { id: "oo-short", alt: "Short OO", image: undefined },
  { id: "oo-long", alt: "Long OO", image: undefined },
  { id: "ar", alt: "AR Sound", image: undefined },
  { id: "or", alt: "OR Sound", image: undefined },
  { id: "ur", alt: "UR Sound", image: undefined },
  { id: "ee", alt: "EE Sound", image: undefined },
  { id: "er", alt: "ER Sound", image: undefined },
];

export const LEVEL_3_CONTENT = [
  { id: "ai", alt: "AI Sound", image: undefined },
  { id: "oa", alt: "OA Sound", image: undefined },
  { id: "igh", alt: "IGH Sound", image: undefined },
  { id: "ow", alt: "OW Sound", image: undefined },
  { id: "ou", alt: "OU Sound", image: undefined },
  { id: "oi", alt: "OI Sound", image: undefined },
  { id: "air", alt: "AIR Sound", image: undefined },
];

// --- 4. GAME LIST ---
// Using GitHub Pages Base URL for the HTML games
const GITHUB_IO_BASE = "https://rajsinghgill.github.io/jb-phonics-lab-v3";

export const GAMES_LIST = [
  {
    id: "jump",
    title: "Super A Jump",
    // Matches: games/Super A Jump/super-a-game.html
    url: `${GITHUB_IO_BASE}/games/Super%20A%20Jump/super-a-game.html`,
    image: ASSET_PATHS.GAMES.BTN_SUPER_A,
    color: "bg-blue-500 border-blue-600",
  },
  {
    id: "snake",
    title: "Hungry Snake",
    // Matches: games/Hungry Snake/hungry-snake.html
    url: `${GITHUB_IO_BASE}/games/Hungry%20Snake/hungry-snake.html`,
    image: ASSET_PATHS.GAMES.BTN_SNAKE,
    color: "bg-green-500 border-green-600",
  },
  {
    id: "trex",
    title: "T-Rex Hero",
    // Matches: games/t-rex game/trex-game.html
    url: `${GITHUB_IO_BASE}/games/t-rex%20game/trex-game.html`,
    image: ASSET_PATHS.GAMES.BTN_TREX,
    color: "bg-orange-500 border-orange-600",
  },
  {
    id: "crossroad",
    title: "Cross The Road",
    // Matches: games/Cross the Road/cross-the-road.html
    url: `${GITHUB_IO_BASE}/games/Cross%20the%20Road/cross-the-road.html`,
    image: ASSET_PATHS.GAMES.BTN_CROSS,
    color: "bg-purple-500 border-purple-600",
  },
  {
    id: "chef",
    title: "Chef's Challenge",
    // Matches: games/Chefs Challenge/chefs-challenge.html
    url: `${GITHUB_IO_BASE}/games/Chefs%20Challenge/chefs-challenge.html`,
    image: ASSET_PATHS.GAMES.BTN_CHEFS,
    color: "bg-red-500 border-red-600",
  },
  {
    id: "theo",
    title: "Theo The Thief",
    // Matches: games/Theo The Thirsty Thief/theo-the-thirsty-thief.html
    url: `${GITHUB_IO_BASE}/games/Theo%20The%20Thirsty%20Thief/theo-the-thirsty-thief.html`,
    image: ASSET_PATHS.GAMES.BTN_THEO,
    color: "bg-teal-500 border-teal-600",
  },
];
