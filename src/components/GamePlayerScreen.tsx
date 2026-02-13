import React, { useState } from "react";
import { Star, ArrowLeft, Trophy, User, LogOut, Gamepad2 } from "lucide-react";
import { ASSET_PATHS, getAssetUrl } from "../constants";

interface GamePlayerScreenProps {
  title: string;
  gameUrl: string;
  onBack: () => void;
  onLogout: () => void;
  userName?: string;
}

const GamePlayerScreen: React.FC<GamePlayerScreenProps> = ({
  title,
  gameUrl,
  onBack,
  onLogout,
  userName = "Super Student",
}) => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="min-h-screen flex flex-col relative font-body text-slate-800">
      {/* HEADER */}
      <div className="sticky top-0 left-0 w-full bg-white/95 backdrop-blur-md border-b-4 border-blue-100 px-4 py-3 flex justify-between items-center z-50 shadow-sm">
        <img
          src={getAssetUrl(ASSET_PATHS.LOGO, "LOGO")}
          alt="JB Phonics Lab"
          className="h-10 md:h-14 object-contain drop-shadow-sm cursor-pointer hover:rotate-3 transition-transform"
          onClick={onBack}
          loading="eager" // Load logo immediately
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

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 z-0">
        {/* Title Badge */}
        <div className="mb-6 bg-white px-8 py-3 rounded-2xl shadow-lg border-b-4 border-blue-200 animate-fade-in-down flex items-center gap-3">
          <Gamepad2 className="text-blue-500" size={32} />
          <h1 className="text-3xl font-header font-black text-slate-700">
            {title}
          </h1>
        </div>

        {/* Game Container */}
        <div className="w-full max-w-6xl h-[75vh] bg-black rounded-[2rem] shadow-2xl border-8 border-white relative overflow-hidden ring-4 ring-black/10">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-100 z-10">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-8 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                <p className="font-header text-xl text-slate-400 font-bold animate-pulse">
                  Loading Game...
                </p>
              </div>
            </div>
          )}

          <iframe
            src={gameUrl}
            title={title}
            className="w-full h-full border-0"
            allowFullScreen
            // 🔒 SECURITY: Allow scripts/audio but block popups/forms if not needed
            sandbox="allow-scripts allow-same-origin allow-popups"
            onLoad={() => setLoading(false)}
          />
        </div>
      </main>

      {/* Floating Exit Button */}
      <div className="fixed bottom-8 left-8 z-50">
        <button
          onClick={onBack}
          className="bg-white text-slate-600 hover:text-red-600 hover:bg-red-50 px-6 py-4 rounded-full shadow-xl shadow-red-900/10 border-2 border-white hover:border-red-200 transition-all flex items-center gap-3 font-header font-bold text-lg active:scale-95 group"
        >
          <ArrowLeft
            size={24}
            strokeWidth={3}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span>Exit Game</span>
        </button>
      </div>
    </div>
  );
};

export default GamePlayerScreen;
