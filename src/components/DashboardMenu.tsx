import React from "react";
import { LogOut, Star, Trophy, Play, User, ArrowRight } from "lucide-react";

// --- 1. NEW ASSETS (Optimized CDN Links) ---
const CDN_BASE = "https://cdn.jsdelivr.net/gh/rajsinghgill/jb-phonics-lab@main";

const NEW_ASSETS = {
  // Section Headers
  iconClassroom: `${CDN_BASE}/my-classroom-vector.png`,
  iconArcade: `${CDN_BASE}/arcade-vector.png`,

  // Game Buttons
  gameSnake: `${CDN_BASE}/btn-hungry-snake.png`,
  gameTrex: `${CDN_BASE}/btn-trex-hero.png`,
  gameJump: `${CDN_BASE}/btn-super-a-jump.png`,
  gameCrossRoad: `${CDN_BASE}/btn-cross-the-road.png`,
};

// Helper: Ensure props use CDN if they come as raw github links
const toCDN = (url: string | undefined) => {
  if (!url) return "";
  return url
    .replace(
      "https://github.com/rajsinghgill/jb-phonics-lab/blob/main",
      CDN_BASE
    )
    .replace("?raw=true", "");
};

interface Assets {
  bgSimple: string;
  logo: string;
  cardYoungReaders: string;
  cardPhonicsLab: string;
  btnFlappy?: string;
  btnSnake?: string;
  btnYummy?: string;
  btnAllGames?: string;
}

interface DashboardMenuProps {
  onLogout: () => void;
  onNavigateToLevels: () => void;
  onYoungReaders: () => void;
  onGameSelect: (gameId: string) => void;
  onViewAllGames: () => void;
  assets: Assets;
  userName?: string;
}

const DashboardMenu: React.FC<DashboardMenuProps> = ({
  onLogout,
  onNavigateToLevels,
  onYoungReaders,
  onGameSelect,
  onViewAllGames,
  assets,
  userName = "Super Student",
}) => {
  // Convert prop assets to fast CDN versions
  const fastLogo = toCDN(assets?.logo);
  const fastCardYR = toCDN(assets?.cardYoungReaders);
  const fastCardPL = toCDN(assets?.cardPhonicsLab);

  return (
    // TRANSPARENT ROOT DIV
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden text-slate-800 font-body">
      {/* --- HEADER --- */}
      <div className="sticky top-0 left-0 w-full bg-white/95 backdrop-blur-md border-b-4 border-blue-100 px-4 py-3 flex justify-between items-center z-50 shadow-sm">
        {/* Left: Logo */}
        <img
          src={fastLogo}
          alt="JB Phonics Lab"
          className="h-10 md:h-14 object-contain drop-shadow-sm"
          loading="eager" // Priority load
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

          {/* Separator */}
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
              <span className="hidden sm:inline">Exit</span>
            </button>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="relative z-10 flex-grow w-full max-w-7xl mx-auto p-4 pt-8 md:pt-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* LEFT: LEARNING ZONE (65%) */}
          <div className="w-full lg:w-[65%] flex flex-col gap-4">
            {/* Classroom Header */}
            <SectionHeader
              imageSrc={NEW_ASSETS.iconClassroom}
              title="My Classroom"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Young Readers */}
              <DashboardCard
                onClick={onYoungReaders}
                image={fastCardYR}
                title="Young Readers"
                subtitle="Stories & Reading"
                themeClasses="border-indigo-400 shadow-indigo-200 hover:border-indigo-500 text-indigo-900"
              />
              {/* Phonics Lab */}
              <DashboardCard
                onClick={onNavigateToLevels}
                image={fastCardPL}
                title="Phonics Lab"
                subtitle="Learn Your ABCs"
                themeClasses="border-yellow-400 shadow-yellow-200 hover:border-yellow-500 text-yellow-900"
              />
            </div>
          </div>

          {/* RIGHT: ARCADE ZONE (35%) */}
          <div className="w-full lg:w-[35%] flex flex-col gap-4">
            {/* Arcade Header */}
            <SectionHeader imageSrc={NEW_ASSETS.iconArcade} title="Arcade" />

            {/* Vertical List Layout */}
            <div className="flex flex-col gap-3">
              {/* Game 1: Super A Jump */}
              <ArcadeListCard
                onClick={() => onGameSelect("jump")}
                title="Super A Jump"
                color="bg-blue-50 border-blue-200 text-blue-800"
                iconBg="bg-blue-200"
                image={NEW_ASSETS.gameJump}
              />

              {/* Game 2: T-REX Hero */}
              <ArcadeListCard
                onClick={() => onGameSelect("trex")}
                title="T-REX Hero"
                color="bg-orange-50 border-orange-200 text-orange-800"
                iconBg="bg-orange-200"
                image={NEW_ASSETS.gameTrex}
              />

              {/* Game 3: Hungry Snake */}
              <ArcadeListCard
                onClick={() => onGameSelect("snake")}
                title="Hungry Snake"
                color="bg-green-50 border-green-200 text-green-800"
                iconBg="bg-green-200"
                image={NEW_ASSETS.gameSnake}
              />

              {/* Game 4: Cross The Road */}
              <ArcadeListCard
                onClick={() => onGameSelect("crossroad")}
                title="Cross the Road"
                color="bg-purple-50 border-purple-200 text-purple-800"
                iconBg="bg-purple-200"
                image={NEW_ASSETS.gameCrossRoad}
              />

              {/* View All Button */}
              <button
                onClick={onViewAllGames}
                className="w-full py-3 rounded-2xl bg-white border-b-4 border-blue-200 text-blue-600 font-bold hover:brightness-95 active:scale-95 transition-all font-header mt-1 flex items-center justify-center gap-2 shadow-sm"
              >
                <span>View All Games</span>
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const SectionHeader: React.FC<{ imageSrc: string; title: string }> = ({
  imageSrc,
  title,
}) => (
  <div className="flex items-center gap-3 px-2 mb-2">
    <div className="w-12 h-12 transform -rotate-6 transition-transform hover:rotate-0">
      <img
        src={imageSrc}
        alt="icon"
        className="w-full h-full object-contain drop-shadow-md"
        loading="lazy"
      />
    </div>
    <h2 className="text-2xl font-header font-bold text-slate-700 tracking-wide drop-shadow-sm">
      {title}
    </h2>
  </div>
);

const DashboardCard: React.FC<{
  onClick: () => void;
  image: string;
  title: string;
  subtitle: string;
  themeClasses: string;
}> = ({ onClick, image, title, subtitle, themeClasses }) => (
  <div
    onClick={onClick}
    className={`group bg-white rounded-3xl p-4 cursor-pointer transition-all duration-300 transform hover:-translate-y-2 border-b-8 shadow-lg hover:shadow-xl active:scale-95 ${themeClasses}`}
  >
    <div className="w-full aspect-square rounded-2xl overflow-hidden mb-4 relative bg-gray-50 shadow-inner">
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="eager"
      />
    </div>
    <div className="text-center">
      <h3 className="font-header font-bold text-2xl mb-1">{title}</h3>
      <p className="font-body text-xs font-bold uppercase tracking-wider opacity-70">
        {subtitle}
      </p>
    </div>
  </div>
);

const ArcadeListCard: React.FC<{
  onClick: () => void;
  title: string;
  color: string;
  iconBg: string;
  image: string;
}> = ({ onClick, title, color, iconBg, image }) => (
  <div
    onClick={onClick}
    className={`group flex items-center gap-4 p-3 pr-4 rounded-2xl border-b-4 cursor-pointer hover:brightness-95 active:scale-95 transition-all bg-white shadow-sm ${color}`}
  >
    <div
      className={`${iconBg} w-16 h-16 rounded-xl shrink-0 border-2 border-white shadow-sm overflow-hidden relative`}
    >
      <img
        src={image}
        className="w-full h-full object-cover drop-shadow-sm group-hover:scale-110 transition-transform"
        alt={title}
        loading="lazy"
      />
    </div>
    <div className="flex-grow">
      <h4 className="font-header font-bold text-lg leading-tight">{title}</h4>
      <span className="font-body text-xs font-bold opacity-60 uppercase">
        Play Now
      </span>
    </div>
    <div className="bg-white/50 p-2 rounded-full text-current">
      <Play size={20} className="fill-current" />
    </div>
  </div>
);

export default DashboardMenu;
