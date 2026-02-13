import React, { useState, useEffect, useMemo } from "react";
import {
  ASSET_PATHS,
  LEVEL_1_CONTENT,
  LEVEL_2_CONTENT,
  LEVEL_3_CONTENT,
  getAssetUrl,
} from "../constants";
import { AppLevel } from "../types";
import { ArrowLeft, LogOut, Lock, Star, Trophy, User } from "lucide-react";

interface LevelSelectionScreenProps {
  onLogout: () => void;
  onBack: () => void;
  onLessonSelect: (id: string) => void;
  initialLevel?: string;
  userName?: string;
}

// --- CONFIG: OPTIMIZED LOOKUPS ---
// Using a Set makes checking "is this lesson unlocked?" instant (O(1))
const AVAILABLE_LESSONS = new Set(["a", "t", "p", "ch", "th"]);

// --- STATIC DATA: COLORS ---
// Moved outside component to prevent re-creation on every render
const SOUND_COLORS: Record<string, string> = {
  // --- LEVEL 1 ---
  s: "bg-lime-400 border-lime-500",
  a: "bg-purple-400 border-purple-500",
  t: "bg-red-500 border-red-600",
  p: "bg-pink-400 border-pink-500", // Changed to pink-400 to match LessonPlayerP
  i: "bg-emerald-400 border-emerald-500",
  n: "bg-orange-500 border-orange-600",
  m: "bg-fuchsia-400 border-fuchsia-500",
  d: "bg-rose-500 border-rose-600",
  g: "bg-cyan-500 border-cyan-600",
  o: "bg-blue-500 border-blue-600",
  c: "bg-yellow-400 border-yellow-500",
  k: "bg-indigo-500 border-indigo-600",
  ck: "bg-pink-500 border-pink-600",
  e: "bg-teal-400 border-teal-500",
  u: "bg-violet-500 border-violet-600",
  r: "bg-green-500 border-green-600",
  h: "bg-sky-400 border-sky-500",
  b: "bg-red-400 border-red-500",
  f: "bg-slate-400 border-slate-500",
  l: "bg-lime-500 border-lime-600",
  j: "bg-amber-500 border-amber-600",
  v: "bg-purple-600 border-purple-700",
  w: "bg-blue-400 border-blue-500",
  x: "bg-rose-400 border-rose-500",
  y: "bg-yellow-500 border-yellow-600",
  z: "bg-cyan-400 border-cyan-500",
  qu: "bg-fuchsia-500 border-fuchsia-600",

  // --- LEVEL 2 ---
  sh: "bg-indigo-400 border-indigo-500",
  ch: "bg-pink-400 border-pink-500",
  th: "bg-teal-500 border-teal-600",
  ng: "bg-orange-400 border-orange-500",
  "oo-short": "bg-lime-500 border-lime-600",
  "oo-long": "bg-rose-500 border-rose-600",
  ar: "bg-sky-500 border-sky-600",
  or: "bg-amber-500 border-amber-600",
  ur: "bg-violet-400 border-violet-500",
  ee: "bg-yellow-400 border-yellow-500",
  er: "bg-green-400 border-green-500",

  // --- LEVEL 3 ---
  ai: "bg-red-500 border-red-600",
  oa: "bg-blue-500 border-blue-600",
  igh: "bg-purple-500 border-purple-600",
  ow: "bg-emerald-500 border-emerald-600",
  ou: "bg-orange-500 border-orange-600",
  oi: "bg-fuchsia-500 border-fuchsia-600",
  air: "bg-cyan-500 border-cyan-600",

  // Default fallback
  default: "bg-slate-300 border-slate-400",
};

const getColorForID = (id: string) => {
  return SOUND_COLORS[id.toLowerCase()] || SOUND_COLORS["default"];
};

const LevelSelectionScreen: React.FC<LevelSelectionScreenProps> = ({
  onLogout,
  onBack,
  onLessonSelect,
  initialLevel,
  userName = "Super Student",
}) => {
  const [currentLevel, setCurrentLevel] = useState<AppLevel>(
    (initialLevel as AppLevel) || AppLevel.LEVEL_1
  );

  useEffect(() => {
    if (initialLevel) {
      setCurrentLevel(initialLevel as AppLevel);
    }
  }, [initialLevel]);

  // Handle Level Content Switching
  const activeContent = useMemo(() => {
    switch (currentLevel) {
      case AppLevel.LEVEL_1:
        return LEVEL_1_CONTENT;
      case AppLevel.LEVEL_2:
        return LEVEL_2_CONTENT;
      case AppLevel.LEVEL_3:
        return LEVEL_3_CONTENT;
      default:
        return [];
    }
  }, [currentLevel]);

  const handleContentClick = (contentId: string) => {
    if (AVAILABLE_LESSONS.has(contentId)) {
      onLessonSelect(contentId);
    }
  };

  return (
    // TRANSPARENT ROOT DIV
    <div className="min-h-screen w-full flex flex-col relative overflow-x-hidden font-body text-slate-800">
      {/* --- HEADER --- */}
      <div className="sticky top-0 left-0 w-full bg-white/95 backdrop-blur-md border-b-4 border-blue-100 px-4 py-3 flex justify-between items-center z-50 shadow-sm">
        {/* Left: Logo */}
        <img
          src={getAssetUrl(ASSET_PATHS.LOGO, "LOGO")}
          alt="JB Phonics Lab"
          className="h-10 md:h-14 object-contain drop-shadow-sm cursor-pointer hover:rotate-3 transition-transform"
          onClick={onBack}
          loading="eager"
        />

        {/* Right: Profile Zone */}
        <div className="flex items-center gap-4 md:gap-6 font-body">
          {/* Gamification Stats */}
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

          {/* User & Logout */}
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
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <main className="relative z-10 w-full max-w-6xl mx-auto px-4 py-10 flex flex-col items-center">
        {/* Title Section */}
        <div className="text-center mb-10 animate-fade-in-down">
          <h1 className="font-header text-4xl md:text-6xl font-bold text-blue-900 mb-3 drop-shadow-md">
            Choose a Sound
          </h1>
          <p className="font-body text-slate-500 font-bold text-xl">
            Tap a block to start your adventure!
          </p>
        </div>

        {/* --- CHUNKY PILL NAVIGATION --- */}
        <div className="bg-white p-2 rounded-2xl shadow-xl shadow-blue-100/50 border-4 border-white flex flex-wrap justify-center gap-2 mb-12 transform hover:scale-[1.01] transition-transform max-w-3xl w-full">
          <NavPill
            label="Level 1"
            isActive={currentLevel === AppLevel.LEVEL_1}
            onClick={() => setCurrentLevel(AppLevel.LEVEL_1)}
            colorClass="bg-green-500 text-white shadow-green-200 ring-4 ring-green-100"
          />
          <NavPill
            label="Level 2"
            isActive={currentLevel === AppLevel.LEVEL_2}
            onClick={() => setCurrentLevel(AppLevel.LEVEL_2)}
            colorClass="bg-purple-500 text-white shadow-purple-200 ring-4 ring-purple-100"
          />
          <NavPill
            label="Level 3"
            isActive={currentLevel === AppLevel.LEVEL_3}
            onClick={() => setCurrentLevel(AppLevel.LEVEL_3)}
            colorClass="bg-orange-500 text-white shadow-orange-200 ring-4 ring-orange-100"
          />
          <NavPill
            label="Tests"
            isActive={currentLevel === AppLevel.MOCK_TESTS}
            onClick={() => setCurrentLevel(AppLevel.MOCK_TESTS)}
            colorClass="bg-blue-500 text-white shadow-blue-200 ring-4 ring-blue-100"
          />
        </div>

        {/* --- THE ARCADE GRID --- */}
        <div className="w-full bg-white/25 backdrop-blur-sm rounded-[3rem] p-8 md:p-12 border-4 border-white/30 shadow-2xl flex justify-center pb-12 mb-24">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
            {activeContent.map((item) => {
              const isLocked = !AVAILABLE_LESSONS.has(item.id);
              const colorClasses = getColorForID(item.id);

              let fontSizeClass = "text-6xl md:text-7xl";
              if (item.id.length === 2) {
                fontSizeClass = "text-5xl md:text-6xl";
              } else if (item.id.length > 2) {
                fontSizeClass = "text-3xl md:text-4xl leading-tight px-2";
              }

              const displayText =
                item.id === "oo-short"
                  ? "oo (short)"
                  : item.id === "oo-long"
                  ? "oo (long)"
                  : item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleContentClick(item.id)}
                  disabled={isLocked}
                  className={`
                            group relative 
                            w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40
                            rounded-3xl
                            flex items-center justify-center
                            transition-all duration-150 ease-out
                            overflow-hidden
                            ${
                              isLocked
                                ? "bg-gray-100 border-gray-300 border-b-[4px] cursor-not-allowed opacity-60"
                                : `${colorClasses} border-b-[8px] active:border-b-0 active:translate-y-[8px] shadow-xl hover:shadow-2xl hover:-translate-y-2 cursor-pointer`
                            }
                        `}
                >
                  {isLocked ? (
                    // LOCKED STATE CONTENT
                    <div className="flex flex-col items-center justify-center text-gray-300">
                      <Lock size={32} className="mb-2" />
                      <span className={`font-header font-bold text-2xl`}>
                        {displayText}
                      </span>
                    </div>
                  ) : (
                    // UNLOCKED STATE CONTENT
                    <>
                      <span
                        className={`font-header font-bold text-white drop-shadow-md group-hover:scale-110 transition-transform duration-300 pb-1 text-center ${fontSizeClass}`}
                      >
                        {displayText}
                      </span>
                      <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
                    </>
                  )}
                </button>
              );
            })}

            {/* Empty State */}
            {activeContent.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-center opacity-70">
                <div className="bg-white p-6 rounded-full shadow-lg mb-4">
                  <Lock className="text-slate-300 h-10 w-10" />
                </div>
                <h3 className="font-header text-3xl font-bold text-slate-600 mb-2">
                  Coming Soon!
                </h3>
                <p className="font-body text-slate-500 font-bold text-lg">
                  We are building this level.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* --- FLOATING BACK BUTTON --- */}
      <div className="fixed bottom-8 left-8 z-50">
        <button
          onClick={onBack}
          className="bg-white text-slate-600 hover:text-blue-600 hover:bg-blue-50 px-6 py-4 rounded-full shadow-xl shadow-blue-900/10 border-2 border-white hover:border-blue-200 transition-all flex items-center gap-3 font-header font-bold text-lg active:scale-95"
        >
          <ArrowLeft size={24} strokeWidth={3} />
          <span>Back</span>
        </button>
      </div>
    </div>
  );
};

// --- NAV PILL SUB-COMPONENT ---
const NavPill: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
  colorClass: string;
}> = ({ label, isActive, onClick, colorClass }) => (
  <button
    onClick={onClick}
    className={`
            flex-1 sm:flex-none
            px-8 py-3 rounded-xl font-header font-bold text-lg
            transition-all duration-200
            ${
              isActive
                ? `${colorClass} shadow-lg transform -translate-y-1`
                : "bg-transparent text-slate-400 hover:bg-slate-50 hover:text-slate-600"
            }
        `}
  >
    {label}
  </button>
);

export default LevelSelectionScreen;
