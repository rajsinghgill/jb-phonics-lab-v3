import React from "react";
import {
  ArrowLeft,
  Gamepad2,
  Play,
  Star,
  Trophy,
  User,
  LogOut,
} from "lucide-react";
import { ASSET_PATHS, getAssetUrl } from "../constants";

// --- 1. OPTIMIZED DATA (CDN LINKS) ---
const CDN_BASE = "https://cdn.jsdelivr.net/gh/rajsinghgill/jb-phonics-lab@main";

const GAMES_DATA = [
  {
    id: "jump",
    title: "Super A Jump",
    image: `${CDN_BASE}/btn-super-a-jump.png`,
    color: "bg-blue-100",
  },
  {
    id: "trex",
    title: "T-Rex Hero",
    image: `${CDN_BASE}/btn-trex-hero.png`,
    color: "bg-orange-100",
  },
  {
    id: "snake",
    title: "Hungry Snake",
    image: `${CDN_BASE}/btn-hungry-snake.png`,
    color: "bg-green-100",
  },
  {
    id: "chef",
    title: "Chef's Challenge",
    image: `${CDN_BASE}/btn-chefs-challenge.png`, // ✅ Verified filename
    color: "bg-pink-100",
  },
  {
    id: "theo",
    title: "Theo The Thief",
    image: `${CDN_BASE}/btn-theo-the-thirsty-thief.png`, // ✅ Updated filename
    color: "bg-teal-100",
  },
  {
    id: "crossroad",
    title: "Cross The Road",
    image: `${CDN_BASE}/btn-cross-the-road.png`,
    color: "bg-purple-100",
  },
];

interface AllGamesScreenProps {
  onBack: () => void;
  onLogout: () => void;
  onGameSelect: (gameId: string) => void;
  userName?: string;
}

const AllGamesScreen: React.FC<AllGamesScreenProps> = ({
  onBack,
  onLogout,
  onGameSelect,
  userName = "Super Student",
}) => {
  return (
    // TRANSPARENT ROOT - Background comes from App.tsx
    <div className="min-h-screen flex flex-col relative font-body text-slate-800">
      {/* --- HEADER --- */}
      <div className="sticky top-0 left-0 w-full bg-white/95 backdrop-blur-md border-b-4 border-blue-100 px-4 py-3 flex justify-between items-center z-50 shadow-sm">
        <img
          src={getAssetUrl(ASSET_PATHS.LOGO, "LOGO")}
          alt="JB Phonics Lab"
          className="h-10 md:h-14 object-contain drop-shadow-sm cursor-pointer hover:rotate-3 transition-transform"
          onClick={onBack}
          loading="eager"
        />

        <div className="flex items-center gap-4 md:gap-6 font-body">
          <div className="hidden md:flex items-center gap-4 bg-blue-50 px-4 py-2 rounded-2xl border-2 border-blue-100">
            <div className="flex items-center gap-2 text-yellow-500 font-bold">
              <Star className="fill-yellow-400 text-yellow-500" size={22} />
              <span className="text-lg">12</span>
            </div>
            <div className="w-0.5 h-6 bg-blue-200"></div>
            <div className="flex items-center gap-2 text-orange-500 font-bold">
              <Trophy className="fill-orange-400 text-orange-500" size={20} />
              <span className="text-lg">Lvl 3</span>
            </div>
          </div>
          <div className="hidden md:block w-px h-8 bg-gray-200"></div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                Student
              </p>
              <p className="text-base font-extrabold text-blue-900 leading-none">
                {userName}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center border-2 border-blue-200 text-blue-600">
              <User size={20} />
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 px-4 py-2 rounded-xl transition-all border-2 border-red-100 font-bold text-sm ml-2 active:scale-95"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Exit</span>
            </button>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <main className="relative z-10 w-full max-w-6xl mx-auto px-4 py-10 flex flex-col items-center">
        {/* Title Section */}
        <div className="text-center mb-12 animate-fade-in-down">
          <div className="inline-flex items-center gap-3 justify-center mb-3">
            <Gamepad2 size={48} className="text-blue-900" />
            <h1 className="font-header text-4xl md:text-6xl font-black text-blue-900 drop-shadow-md">
              Game Zone!
            </h1>
          </div>
          <p className="font-body text-slate-500 font-bold text-xl">
            Pick a game to play!
          </p>
        </div>

        {/* --- GAME GRID --- */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-24">
          {GAMES_DATA.map((game) => (
            <button
              key={game.id}
              onClick={() => onGameSelect(game.id)}
              className="group relative bg-white rounded-[2rem] p-4 shadow-xl border-b-8 border-slate-200 hover:border-blue-300 hover:shadow-2xl active:border-b-0 active:translate-y-2 transition-all duration-200 flex flex-col gap-4 overflow-hidden"
            >
              {/* Image Container */}
              <div
                className={`w-full aspect-[4/3] ${game.color} rounded-2xl overflow-hidden relative shadow-inner`}
              >
                <img
                  src={game.image}
                  alt={game.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />

                {/* Play Overlay */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-125 transition-transform duration-300">
                    <Play
                      size={32}
                      className="fill-blue-500 text-blue-500 ml-1"
                    />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="w-full flex items-center justify-between px-2 pb-2">
                <div className="text-left">
                  <h2 className="font-header text-2xl font-black text-blue-900 leading-tight">
                    {game.title}
                  </h2>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:text-blue-500 transition-colors">
                    Click to Play
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>

      {/* --- FLOATING BACK BUTTON --- */}
      <div className="fixed bottom-8 left-8 z-50">
        <button
          onClick={onBack}
          className="bg-white text-slate-600 hover:text-blue-600 hover:bg-blue-50 px-6 py-4 rounded-full shadow-xl shadow-blue-900/10 border-2 border-white hover:border-blue-200 transition-all flex items-center gap-3 font-header font-bold text-lg active:scale-95"
        >
          <ArrowLeft size={24} strokeWidth={3} />
          <span>Dashboard</span>
        </button>
      </div>
    </div>
  );
};

export default AllGamesScreen;
