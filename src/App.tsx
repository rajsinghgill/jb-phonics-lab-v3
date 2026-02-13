import React, { useState } from "react";
import { AppScreen, AppLevel } from "./types";
import { ASSET_PATHS, getAssetUrl, GAMES_LIST } from "./constants";

// --- IMPORT SCREENS ---
import StudentLogin from "./components/StudentLogin";
import DashboardMenu from "./components/DashboardMenu";
import LevelSelectionScreen from "./components/LevelSelectionScreen";
import GamePlayerScreen from "./components/GamePlayerScreen";
import AllGamesScreen from "./components/AllGamesScreen";

// --- IMPORT LESSON PLAYERS ---
import LessonPlayerA from "./components/LessonPlayerA";
import LessonPlayerT from "./components/LessonPlayerT";
import LessonPlayerCh from "./components/LessonPlayerCh";
import LessonPlayerTh from "./components/LessonPlayerTh";
import LessonPlayerP from "./components/LessonPlayerP";

export default function App() {
  // --- STATE ---
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(
    AppScreen.LOGIN
  );
  const [currentLevel, setCurrentLevel] = useState<AppLevel>(AppLevel.LEVEL_1);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [userName, setUserName] = useState("Student");

  // --- HANDLERS ---
  const handleLogin = () => {
    setCurrentScreen(AppScreen.DASHBOARD);
  };

  const handleLogout = () => {
    setCurrentScreen(AppScreen.LOGIN);
    setUserName("Student");
  };

  const handleNavigateToLevels = () => {
    setCurrentScreen(AppScreen.LEVELS);
    setCurrentLevel(AppLevel.LEVEL_1);
  };

  const handleYoungReaders = () => {
    window.location.href = "https://yr.cambridge.e-legends.com.hk/";
  };

  const handleLessonSelect = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setCurrentScreen(AppScreen.LESSON);
  };

  const handleBackToLevels = () => {
    setCurrentScreen(AppScreen.LEVELS);
  };

  const handleGameSelect = (gameId: string) => {
    setSelectedGameId(gameId);
    setCurrentScreen(AppScreen.GAME);
  };

  const handleViewAllGames = () => {
    setCurrentScreen(AppScreen.ALL_GAMES);
  };

  // Helper to find active game data
  const activeGame = GAMES_LIST.find((g) => g.id === selectedGameId);

  // Dashboard Assets Bundle
  const dashboardAssets = {
    bgSimple: getAssetUrl(ASSET_PATHS.CORE.BACKGROUND),
    logo: getAssetUrl(ASSET_PATHS.CORE.LOGO),
    cardYoungReaders: getAssetUrl(ASSET_PATHS.CARDS.YOUNG_READERS),
    cardPhonicsLab: getAssetUrl(ASSET_PATHS.CARDS.PHONICS_LAB),
  };

  // --- RENDER ---
  return (
    <div className="relative min-h-screen font-body bg-blue-50">
      {/* GLOBAL BACKGROUND */}
      <div
        className="jb-background-tint"
        style={{
          backgroundImage: `url(${getAssetUrl(ASSET_PATHS.CORE.BACKGROUND)})`,
        }}
      />

      <div className="relative z-10 pb-12">
        {/* LOGIN SCREEN */}
        {currentScreen === AppScreen.LOGIN && (
          <StudentLogin
            onLogin={handleLogin}
            assets={{
              bgSimple: getAssetUrl(ASSET_PATHS.CORE.BACKGROUND),
              logo: getAssetUrl(ASSET_PATHS.CORE.LOGO),
              // Using login-hero-square because hero-girl-vector is missing
              heroImage: getAssetUrl(ASSET_PATHS.CORE.LOGIN_HERO),
            }}
          />
        )}

        {/* DASHBOARD */}
        {currentScreen === AppScreen.DASHBOARD && (
          <DashboardMenu
            onLogout={handleLogout}
            onNavigateToLevels={handleNavigateToLevels}
            onYoungReaders={handleYoungReaders}
            onGameSelect={handleGameSelect}
            onViewAllGames={handleViewAllGames}
            userName={userName}
            assets={dashboardAssets}
          />
        )}

        {/* LEVEL SELECTION */}
        {currentScreen === AppScreen.LEVELS && (
          <LevelSelectionScreen
            onLogout={handleLogout}
            onBack={() => setCurrentScreen(AppScreen.DASHBOARD)}
            onLessonSelect={handleLessonSelect}
            initialLevel={currentLevel}
            userName={userName}
          />
        )}

        {/* ALL GAMES SCREEN */}
        {currentScreen === AppScreen.ALL_GAMES && (
          <AllGamesScreen
            onBack={() => setCurrentScreen(AppScreen.DASHBOARD)}
            onLogout={handleLogout}
            onGameSelect={handleGameSelect}
            userName={userName}
          />
        )}

        {/* GAME PLAYER SCREEN */}
        {currentScreen === AppScreen.GAME && activeGame && (
          <GamePlayerScreen
            title={activeGame.title}
            gameUrl={activeGame.url}
            onBack={() => setCurrentScreen(AppScreen.ALL_GAMES)}
            onLogout={handleLogout}
            userName={userName}
          />
        )}

        {/* SPECIFIC LESSON PLAYERS */}
        {currentScreen === AppScreen.LESSON && (
          <>
            {selectedLessonId === "a" && (
              <LessonPlayerA onBack={handleBackToLevels} />
            )}
            {selectedLessonId === "t" && (
              <LessonPlayerT onBack={handleBackToLevels} />
            )}
            {selectedLessonId === "ch" && (
              <LessonPlayerCh onBack={handleBackToLevels} />
            )}
            {selectedLessonId === "th" && (
              <LessonPlayerTh onBack={handleBackToLevels} />
            )}
            {selectedLessonId === "p" && (
              <LessonPlayerP onBack={handleBackToLevels} />
            )}

            {/* Fallback */}
            {!["a", "t", "ch", "th", "p"].includes(selectedLessonId || "") && (
              <div className="min-h-screen flex flex-col items-center justify-center text-center p-10 bg-white/80 backdrop-blur">
                <h1 className="font-header text-4xl text-slate-400 mb-4">
                  Lesson "{selectedLessonId?.toUpperCase()}" Coming Soon!
                </h1>
                <button
                  onClick={handleBackToLevels}
                  className="bg-blue-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-600 transition-all"
                >
                  Back to Map
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* BETA DISCLAIMER BANNER */}
      <div className="fixed bottom-0 left-0 w-full bg-yellow-300/95 text-yellow-900 text-center text-sm md:text-base py-2 px-4 font-bold z-[100] border-t border-yellow-400 backdrop-blur-sm shadow-lg">
        JB Phonics Lab is currently in beta. This version is under development
        and intended for testing purposes only. Features and stability are
        subject to change.
      </div>
    </div>
  );
}
