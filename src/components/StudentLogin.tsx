import React, { useState } from "react";
import { ArrowRight } from "lucide-react";

// --- INTERFACES ---
interface LoginProps {
  onLogin: () => void;
  assets: {
    bgSimple: string;
    logo: string;
    [key: string]: string | undefined;
  };
}

// --- CONSTANTS ---
// 1. JS Delivr CDN for instant loading (High Priority)
const HERO_IMAGE_URL =
  "https://cdn.jsdelivr.net/gh/rajsinghgill/jb-phonics-lab@main/login-hero-square.png";

// Helper: specific fix to ensure props also use CDN if they are github raw links
const toCDN = (url: string) => {
  if (!url) return "";
  return url
    .replace(
      "https://github.com/rajsinghgill/jb-phonics-lab/blob/main",
      "https://cdn.jsdelivr.net/gh/rajsinghgill/jb-phonics-lab@main"
    )
    .replace("?raw=true", "");
};

export default function StudentLogin({ onLogin, assets }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  // Convert incoming assets to fast CDN links immediately
  const fastLogo = toCDN(assets?.logo);
  const fastBg = toCDN(assets?.bgSimple);

  return (
    <div className="min-h-screen w-full flex font-body bg-white">
      {/* --- LEFT SIDE: HERO CITY --- */}
      {/* Optimized: Priority Loading for Largest Contentful Paint (LCP) */}
      <div className="hidden lg:flex w-1/2 bg-[#2e1065] relative items-center justify-center overflow-hidden border-r-4 border-blue-900">
        <div className="absolute inset-0 z-10 w-full h-full">
          <img
            src={HERO_IMAGE_URL}
            alt="JB Phonics Hero"
            className="w-full h-full object-cover object-center"
            loading="eager"
            fetchPriority="high"
          />
        </div>
      </div>

      {/* --- RIGHT SIDE: LOGIN FORM --- */}
      <div className="w-full lg:w-1/2 flex flex-col relative bg-white">
        {/* Mobile Background: Uses CDN link now */}
        <div
          className="absolute inset-0 lg:hidden z-0 opacity-20"
          style={{
            backgroundImage: `url(${fastBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Content Container */}
        <div className="relative z-10 flex-grow flex flex-col items-center justify-center p-8 sm:p-12">
          {/* Logo */}
          <div className="mb-8 transform hover:rotate-3 transition-transform duration-300">
            <img
              src={fastLogo}
              alt="JB Phonics Lab Logo"
              className="h-24 md:h-32 object-contain drop-shadow-md"
              loading="eager"
            />
          </div>

          <div className="text-center mb-10">
            <h1 className="font-header text-4xl md:text-5xl font-bold text-slate-800 mb-2">
              Welcome Back!
            </h1>
            <p className="text-slate-500 text-lg font-bold">
              Ready to start your adventure?
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="w-full max-w-sm flex flex-col gap-5"
          >
            {/* Username Input: Added htmlFor, id, and autoComplete */}
            <div className="group">
              <label
                htmlFor="username"
                className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 ml-2 cursor-pointer"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                name="username"
                autoComplete="username"
                placeholder="Student Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-4 rounded-2xl border-4 border-gray-100 bg-gray-50 text-gray-700 font-bold text-lg focus:border-blue-300 focus:bg-white focus:outline-none transition-all placeholder:text-gray-300 shadow-inner"
              />
            </div>

            {/* Password Input: Added htmlFor, id, and autoComplete */}
            <div className="group">
              <label
                htmlFor="password"
                className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 ml-2 cursor-pointer"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 rounded-2xl border-4 border-gray-100 bg-gray-50 text-gray-700 font-bold text-lg focus:border-blue-300 focus:bg-white focus:outline-none transition-all placeholder:text-gray-300 shadow-inner"
              />
            </div>

            <button
              type="submit"
              className="mt-6 w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-header font-bold text-xl py-4 rounded-2xl shadow-xl shadow-blue-200 border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-3"
            >
              <span>Let's Go!</span>
              <ArrowRight size={24} />
            </button>
          </form>

          <p className="mt-8 text-slate-400 text-sm font-bold">
            Need help?{" "}
            <span className="text-blue-500 cursor-pointer hover:underline">
              Ask your teacher
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
