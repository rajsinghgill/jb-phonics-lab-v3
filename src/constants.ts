// src/constants.ts

// --- 1. CORE ASSETS ---
export const ASSET_PATHS = {
  // Core Assets
  LOGO: "https://github.com/rajsinghgill/jb-phonics-lab/blob/main/logo.png?raw=true",
  BACKGROUND:
    "https://github.com/rajsinghgill/jb-phonics-lab/blob/main/background.png?raw=true",

  // Navigation / Icons
  HERO_GIRL:
    "https://github.com/rajsinghgill/jb-phonics-lab/blob/main/hero-girl-vector.png?raw=true",
  BTN_BACK:
    "https://github.com/rajsinghgill/jb-phonics-lab/blob/main/btn-back.png?raw=true",
  BTN_LOGOUT:
    "https://github.com/rajsinghgill/jb-phonics-lab/blob/main/btn-logout.png?raw=true",

  // Tabs
  TABS: {
    LEVEL_1:
      "https://github.com/rajsinghgill/jb-phonics-lab/blob/main/tab-level-1.png?raw=true",
    LEVEL_2:
      "https://github.com/rajsinghgill/jb-phonics-lab/blob/main/tab-level-2.png?raw=true",
    LEVEL_3:
      "https://github.com/rajsinghgill/jb-phonics-lab/blob/main/tab-level-3.png?raw=true",
    MOCK_TESTS:
      "https://github.com/rajsinghgill/jb-phonics-lab/blob/main/tab-mock-tests.png?raw=true",
  },

  // Sound Images
  IMAGES: {
    S: "https://github.com/rajsinghgill/jb-phonics-lab/blob/main/card-s.png?raw=true",
    A: "https://github.com/rajsinghgill/jb-phonics-lab/blob/main/card-a.png?raw=true",
    T: "https://github.com/rajsinghgill/jb-phonics-lab/blob/main/card-t.png?raw=true",
    P: "https://github.com/rajsinghgill/jb-phonics-lab/blob/main/card-p.png?raw=true",
    DEFAULT:
      "https://github.com/rajsinghgill/jb-phonics-lab/blob/main/card-default.png?raw=true",
    // Level 3 Placeholders
    AI: "https://via.placeholder.com/150",
    OA: "https://via.placeholder.com/150",
    IGH: "https://via.placeholder.com/150",
    OW: "https://via.placeholder.com/150",
    OU: "https://via.placeholder.com/150",
    OI: "https://via.placeholder.com/150",
    AIR: "https://via.placeholder.com/150",
  },
};

// --- 2. HELPER FUNCTION ---
export const getAssetUrl = (path: string | undefined, context?: string) => {
  if (!path) {
    console.warn(`Missing asset for: ${context}`);
    return "https://via.placeholder.com/150";
  }
  return path;
};

// --- 3. LEVEL CONTENT LISTS ---

export const LEVEL_1_CONTENT = [
  { id: "s", alt: "S Sound", image: ASSET_PATHS.IMAGES.S },
  { id: "a", alt: "A Sound", image: ASSET_PATHS.IMAGES.A },
  { id: "t", alt: "T Sound", image: ASSET_PATHS.IMAGES.T },
  { id: "p", alt: "P Sound", image: ASSET_PATHS.IMAGES.P },
  { id: "i", alt: "I Sound", image: ASSET_PATHS.IMAGES.DEFAULT },
  { id: "n", alt: "N Sound", image: ASSET_PATHS.IMAGES.DEFAULT },
  { id: "m", alt: "M Sound", image: ASSET_PATHS.IMAGES.DEFAULT },
  { id: "d", alt: "D Sound", image: ASSET_PATHS.IMAGES.DEFAULT },
  { id: "g", alt: "G Sound", image: ASSET_PATHS.IMAGES.DEFAULT },
  { id: "o", alt: "O Sound", image: ASSET_PATHS.IMAGES.DEFAULT },
  { id: "c", alt: "C Sound", image: ASSET_PATHS.IMAGES.DEFAULT },
  { id: "k", alt: "K Sound", image: ASSET_PATHS.IMAGES.DEFAULT },
  { id: "ck", alt: "CK Sound", image: ASSET_PATHS.IMAGES.DEFAULT },
  { id: "e", alt: "E Sound", image: ASSET_PATHS.IMAGES.DEFAULT },
  { id: "u", alt: "U Sound", image: ASSET_PATHS.IMAGES.DEFAULT },
  { id: "r", alt: "R Sound", image: ASSET_PATHS.IMAGES.DEFAULT },
  { id: "h", alt: "H Sound", image: ASSET_PATHS.IMAGES.DEFAULT },
  { id: "b", alt: "B Sound", image: ASSET_PATHS.IMAGES.DEFAULT },
  { id: "f", alt: "F Sound", image: ASSET_PATHS.IMAGES.DEFAULT },
  { id: "l", alt: "L Sound", image: ASSET_PATHS.IMAGES.DEFAULT },
  { id: "j", alt: "J Sound", image: ASSET_PATHS.IMAGES.DEFAULT },
  { id: "v", alt: "V Sound", image: ASSET_PATHS.IMAGES.DEFAULT },
  { id: "w", alt: "W Sound", image: ASSET_PATHS.IMAGES.DEFAULT },
  { id: "x", alt: "X Sound", image: ASSET_PATHS.IMAGES.DEFAULT },
  { id: "y", alt: "Y Sound", image: ASSET_PATHS.IMAGES.DEFAULT },
  { id: "z", alt: "Z Sound", image: ASSET_PATHS.IMAGES.DEFAULT },
  { id: "qu", alt: "QU Sound", image: ASSET_PATHS.IMAGES.DEFAULT },
];

export const LEVEL_2_CONTENT = [
  { id: "sh", alt: "SH Sound", image: ASSET_PATHS.IMAGES.DEFAULT },
  { id: "ch", alt: "CH Sound", image: ASSET_PATHS.IMAGES.DEFAULT },
  { id: "th", alt: "TH Sound", image: ASSET_PATHS.IMAGES.DEFAULT },
  { id: "ng", alt: "NG Sound", image: ASSET_PATHS.IMAGES.DEFAULT },
  { id: "oo-short", alt: "Short OO", image: ASSET_PATHS.IMAGES.DEFAULT },
  { id: "oo-long", alt: "Long OO", image: ASSET_PATHS.IMAGES.DEFAULT },
  { id: "ar", alt: "AR Sound", image: ASSET_PATHS.IMAGES.DEFAULT },
  { id: "or", alt: "OR Sound", image: ASSET_PATHS.IMAGES.DEFAULT },
  { id: "ur", alt: "UR Sound", image: ASSET_PATHS.IMAGES.DEFAULT },
  { id: "ee", alt: "EE Sound", image: ASSET_PATHS.IMAGES.DEFAULT },
  { id: "er", alt: "ER Sound", image: ASSET_PATHS.IMAGES.DEFAULT },
];

export const LEVEL_3_CONTENT = [
  { id: "ai", alt: "AI Sound", image: ASSET_PATHS.IMAGES.AI },
  { id: "oa", alt: "OA Sound", image: ASSET_PATHS.IMAGES.OA },
  { id: "igh", alt: "IGH Sound", image: ASSET_PATHS.IMAGES.IGH },
  { id: "ow", alt: "OW Sound", image: ASSET_PATHS.IMAGES.OW },
  { id: "ou", alt: "OU Sound", image: ASSET_PATHS.IMAGES.OU },
  { id: "oi", alt: "OI Sound", image: ASSET_PATHS.IMAGES.OI },
  { id: "air", alt: "AIR Sound", image: ASSET_PATHS.IMAGES.AIR },
];

// --- 4. GAME LIST (UPDATED WITH NEW GAMES) ---
export const GAMES_LIST = [
  {
    id: "jump",
    title: "Super A Jump",
    url: "https://rajsinghgill.github.io/jb-phonics-lab/Super%20A%20Jump/super-a-game.html",
    image:
      "https://github.com/rajsinghgill/jb-phonics-lab/blob/main/btn-super-a-jump.png?raw=true",
    color: "bg-blue-500 border-blue-600",
  },
  {
    id: "snake",
    title: "Hungry Snake",
    url: "https://rajsinghgill.github.io/jb-phonics-lab/Hungry%20Snake/hungry-snake.html",
    image:
      "https://github.com/rajsinghgill/jb-phonics-lab/blob/main/btn-hungry-snake.png?raw=true",
    color: "bg-green-500 border-green-600",
  },
  {
    id: "trex",
    title: "T-Rex Hero",
    url: "https://rajsinghgill.github.io/jb-phonics-lab/t-rex%20game/trex-game.html",
    image:
      "https://github.com/rajsinghgill/jb-phonics-lab/blob/main/btn-trex-hero.png?raw=true",
    color: "bg-orange-500 border-orange-600",
  },
  {
    id: "crossroad",
    title: "Cross The Road",
    url: "https://rajsinghgill.github.io/jb-phonics-lab/Cross%20the%20Road/cross-the-road.html",
    image:
      "https://github.com/rajsinghgill/jb-phonics-lab/blob/main/btn-cross-the-road.png?raw=true",
    color: "bg-purple-500 border-purple-600",
  },
  // --- NEW GAMES ADDED BELOW ---
  {
    id: "chef",
    title: "Chef's Challenge",
    // Converted to github.io playable link
    url: "https://rajsinghgill.github.io/jb-phonics-lab/Chefs%20Challenge/chefs-challenge.html",
    image:
      "https://github.com/rajsinghgill/jb-phonics-lab/blob/main/btn-chefs-challenge.png?raw=true",
    color: "bg-red-500 border-red-600",
  },
  {
    id: "theo",
    title: "Theo The Thief",
    // Converted to github.io playable link
    url: "https://rajsinghgill.github.io/jb-phonics-lab/Theo%20The%20Thirsty%20Thief/theo-the-thirsty-thief.html",
    image:
      "https://github.com/rajsinghgill/jb-phonics-lab/blob/main/btn-theo-the-thirsty-thief.png?raw=true",
    color: "bg-teal-500 border-teal-600",
  },
];
