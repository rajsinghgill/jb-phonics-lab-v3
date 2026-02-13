import React, { useState, useEffect } from "react";
import VideoPlayer from "./VideoPlayer";
import {
  Star,
  ArrowRight,
  ArrowLeft,
  Gamepad2,
  Play,
  CheckCircle2,
  Trophy,
  User,
  LogOut,
  Utensils,
  RefreshCcw,
  BookOpen,
  Layers,
  X,
  ChevronRight,
  ChevronLeft,
  Volume2,
  Type,
  MessageSquare,
  Speaker,
} from "lucide-react";
import { ASSET_PATHS, getAssetUrl } from "../constants";

// --- TYPES ---
type FlowStage = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

interface VocabWord {
  text: string;
  icon: string;
  audio: string;
}

interface QuizItem {
  id: string;
  label: string;
  isTarget: boolean;
  icon: string;
}

interface CookingItem {
  id: string;
  rime: string;
  icon: string;
}

// --- CONFIGURATION ---
const VIDEO_URL =
  "https://www.dropbox.com/scl/fi/g8mxs44l62atrr94lqgqq/2025.mp4?rlkey=zzz376nplw0b08runvfwge32k&st=95ia97oe&raw=1";
const GAME_URL =
  "https://rajsinghgill.github.io/jb-phonics-lab/Super%20A%20Jump/super-a-game.html";
const STOPS = [64, 177, 9999];

// 🚀 OPTIMIZATION: Use CDN for instant audio loading
const AUDIO_BASE =
  "https://cdn.jsdelivr.net/gh/rajsinghgill/jb-phonics-lab@main/";

// --- LESSON CONTENT ---
const LESSON_SUMMARY = {
  sound: "a",
  soundAudio: "a-sound.mp3",
  words: [
    { text: "Apple", icon: "🍎", audio: "apple-sound.mp3" },
    { text: "Ant", icon: "🐜", audio: "ant-sound.mp3" },
    { text: "Axe", icon: "🪓", audio: "axe-sound.mp3" },
    { text: "Arrow", icon: "🏹", audio: "arrow-sound.mp3" },
  ] as VocabWord[],
  sentences: [
    { text: "The ant is red.", audio: "the-ant-is-red-sound.mp3" },
    { text: "I see an apple.", audio: "i-see-an-apple-sound.mp3" },
    { text: "The cat is fat.", audio: "the-cat-is-fat-sound.mp3" },
  ],
};

// --- QUIZ DATA ---
const Q1_ITEMS: QuizItem[] = [
  { id: "apple", label: "Apple", isTarget: true, icon: "🍎" },
  { id: "dog", label: "Dog", isTarget: false, icon: "🐶" },
  { id: "ant", label: "Ant", isTarget: true, icon: "🐜" },
  { id: "axe", label: "Axe", isTarget: true, icon: "🪓" },
  { id: "sun", label: "Sun", isTarget: false, icon: "☀️" },
  { id: "arrow", label: "Arrow", isTarget: true, icon: "🏹" },
];

const Q2_WORDS: CookingItem[] = [
  { id: "apple", rime: "pple", icon: "🍎" },
  { id: "ant", rime: "nt", icon: "🐜" },
  { id: "axe", rime: "xe", icon: "🪓" },
];

const Q3_DATA = [
  {
    target: ["The", "ant", "is", "red"],
    scramble: ["red", "The", "is", "ant"],
  },
  {
    target: ["I", "see", "an", "apple"],
    scramble: ["apple", "see", "an", "I"],
  },
  {
    target: ["The", "cat", "is", "fat"],
    scramble: ["fat", "cat", "is", "The"],
  },
];

// --- HELPER COMPONENT: Highlights 'a' or 'A' ---
const HighlightA: React.FC<{ text: string }> = ({ text }) => {
  const parts = text.split(" ");
  return (
    <span>
      {parts.map((word, i) => {
        // Simple check for 'a' anywhere in the word for this level
        // OR strict start check depending on your preference.
        // Let's do strict start check to match other lessons:
        const startsWithA = word.toLowerCase().startsWith("a");
        // For sentences like "The cat is fat", we might want to highlight the middle 'a' too?
        // Let's stick to the "Start" rule for consistency with T and P for now,
        // unless you want every 'a' highlighted.

        // Actually, for "The cat is fat", highlighting the medial 'a' is better for Level 1 Phonics.
        // Let's highlight EVERY 'a' for this lesson.
        const wordParts = word.split(/(a)/gi);

        return (
          <span key={i}>
            {wordParts.map((part, j) =>
              part.toLowerCase() === "a" ? (
                <span key={j} className="text-red-500">
                  {part}
                </span>
              ) : (
                part
              )
            )}
            {i < parts.length - 1 ? " " : ""}
          </span>
        );
      })}
    </span>
  );
};

interface LessonPlayerProps {
  onBack: () => void;
  onLogout?: () => void;
  userName?: string;
}

const LessonPlayerA: React.FC<LessonPlayerProps> = ({
  onBack,
  onLogout,
  userName = "Student",
}) => {
  const [stage, setStage] = useState<FlowStage>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Video States
  const [videoStarted, setVideoStarted] = useState(false);
  const [showVideoNext, setShowVideoNext] = useState(false);

  // Flashcard States
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [currentFlashcard, setCurrentFlashcard] = useState(0);

  // --- HELPERS ---
  const getStartTime = () => {
    if (stage === 0) return 0;
    if (stage === 2) return 67;
    if (stage === 4) return 187;
    return 0;
  };

  const getEndTime = () => {
    if (stage === 0) return STOPS[0];
    if (stage === 2) return STOPS[1];
    if (stage === 4) return Infinity;
    return Infinity;
  };

  const playAudio = (e: React.MouseEvent | null, fileName: string) => {
    if (e) e.stopPropagation();
    // Using CDN Link for now, even if files missing, it won't crash the app (just 404 in console)
    const fullUrl = `${AUDIO_BASE}${fileName}`;
    const audio = new Audio(fullUrl);
    audio.play().catch((err) => console.log("Audio placeholder missing:", err));
  };

  // --- SCROLL BLOCKER ---
  useEffect(() => {
    const blockKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "];
    const handleKeyDown = (e: KeyboardEvent) => {
      if (stage === 6 && blockKeys.includes(e.key)) {
        e.preventDefault();
        return false;
      }
    };

    if (stage === 6) {
      window.addEventListener("keydown", handleKeyDown, { passive: false });
    } else {
      window.removeEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [stage]);

  // --- STAGE MANAGEMENT ---
  useEffect(() => {
    if ([0, 2, 4].includes(stage)) {
      setShowVideoNext(false);
      if (stage === 0) {
        setVideoStarted(false);
        setIsPlaying(false);
      } else {
        setVideoStarted(true);
        setIsPlaying(true);
      }
    } else {
      setIsPlaying(false);
      setShowVideoNext(false);
    }
  }, [stage]);

  const handleStartVideo = () => {
    setVideoStarted(true);
    setIsPlaying(true);
  };

  const handleProgress = (seconds: number) => {
    if (showVideoNext) return;
    if (stage === 0 && seconds >= STOPS[0]) {
      setIsPlaying(false);
      setShowVideoNext(true);
    } else if (stage === 2 && seconds >= STOPS[1]) {
      setIsPlaying(false);
      setShowVideoNext(true);
    }
  };

  // --- FIXED: HANDLE VIDEO END ---
  const handleVideoEnd = () => {
    setIsPlaying(false);
    setShowVideoNext(true);
  };

  const handleInternalNext = () => {
    if (stage < 7) {
      setIsPlaying(false);
      setStage((stage + 1) as FlowStage);
      setIsCompleted(false);
    }
  };

  const handleInternalBack = () => {
    if (stage > 0) {
      setIsPlaying(false);
      setStage((stage - 1) as FlowStage);
      setIsCompleted(false);
    }
  };

  // --- QUIZ STATES ---
  const [q1Popped, setQ1Popped] = useState<string[]>([]);
  const [q2Filled, setQ2Filled] = useState<Record<string, boolean>>({
    apple: false,
    ant: false,
    axe: false,
  });
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [q3Index, setQ3Index] = useState(0);
  const [q3BuiltSentence, setQ3BuiltSentence] = useState<string[]>([]);
  const [q3ShowSuccess, setQ3ShowSuccess] = useState(false);
  const [q3Error, setQ3Error] = useState<string | null>(null);

  // --- QUIZ HANDLERS ---
  const handleBubbleClick = (item: QuizItem) => {
    if (item.isTarget) {
      if (!q1Popped.includes(item.id)) {
        setQ1Popped((prev) => [...prev, item.id]);
      }
    }
  };

  useEffect(() => {
    const correctIds = Q1_ITEMS.filter((i) => i.isTarget).map((i) => i.id);
    const allPopped = correctIds.every((id) => q1Popped.includes(id));
    if (allPopped && q1Popped.length > 0) setIsCompleted(true);
  }, [q1Popped]);

  const handleDrop = (targetId: string) => {
    if (draggedItem === "a") {
      setQ2Filled((prev) => ({ ...prev, [targetId]: true }));
      setDraggedItem(null);
    }
  };

  useEffect(() => {
    if (Object.values(q2Filled).every(Boolean) && stage === 3)
      setIsCompleted(true);
  }, [q2Filled, stage]);

  const currentQ3 = Q3_DATA[q3Index];
  const handleWordClick = (word: string) => {
    const nextIndex = q3BuiltSentence.length;
    if (word === currentQ3.target[nextIndex]) {
      setQ3BuiltSentence([...q3BuiltSentence, word]);
    } else {
      setQ3Error(word);
      setTimeout(() => setQ3Error(null), 500);
    }
  };

  useEffect(() => {
    if (
      q3BuiltSentence.length === currentQ3.target.length &&
      q3BuiltSentence.length > 0
    ) {
      setQ3ShowSuccess(true);
      const timer = setTimeout(() => {
        if (q3Index < Q3_DATA.length - 1) {
          setQ3BuiltSentence([]);
          setQ3Index((prev) => prev + 1);
          setQ3ShowSuccess(false);
        } else {
          setIsCompleted(true);
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [q3BuiltSentence, currentQ3.target.length, q3Index]);

  // Flashcards
  const handleNextCard = () => {
    setCurrentFlashcard((prev) => (prev + 1) % LESSON_SUMMARY.words.length);
  };
  const handlePrevCard = () => {
    setCurrentFlashcard((prev) =>
      prev === 0 ? LESSON_SUMMARY.words.length - 1 : prev - 1
    );
  };

  // --- RENDERERS ---
  const renderQuizContent = () => {
    switch (stage) {
      case 1:
        return (
          <div className="flex flex-col items-center gap-8 w-full">
            <h2 className="font-header text-3xl md:text-4xl font-bold text-gray-800 text-center">
              Tap the bubbles with the <span className="text-red-500">/a/</span>{" "}
              sound!
            </h2>
            <div className="flex flex-wrap justify-center gap-6 max-w-4xl">
              {Q1_ITEMS.map((item) => {
                if (q1Popped.includes(item.id)) return null;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleBubbleClick(item)}
                    className={`w-32 h-32 md:w-40 md:h-40 rounded-full flex flex-col items-center justify-center gap-1 shadow-xl border-4 transition-all animate-in zoom-in duration-500 ${
                      !item.isTarget
                        ? "active:bg-red-100 active:border-red-400 active:animate-shake"
                        : "active:scale-110 active:opacity-0"
                    } bg-blue-50 border-blue-300 hover:bg-white hover:scale-105`}
                  >
                    <span className="text-5xl">{item.icon}</span>
                    <span className="font-header text-xl font-bold text-blue-900">
                      {item.label}
                    </span>
                  </button>
                );
              })}
              {Q1_ITEMS.filter((i) => i.isTarget).every((i) =>
                q1Popped.includes(i.id)
              ) && (
                <div className="font-header text-4xl font-bold text-green-600 animate-bounce p-10 flex flex-col items-center gap-4">
                  <CheckCircle2 size={64} />
                  <span>Great Job!</span>
                </div>
              )}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col items-center gap-10 w-full">
            <h2 className="font-header text-3xl md:text-4xl font-bold text-gray-800 text-center">
              Drag{" "}
              <span className="text-red-500 px-2 bg-red-100 rounded-lg mx-1">
                a
              </span>{" "}
              into the cooking pot!
            </h2>
            <div className="w-full flex justify-center py-4">
              <div
                draggable
                onDragStart={() => setDraggedItem("a")}
                className="w-24 h-24 bg-red-500 text-white rounded-full shadow-xl border-b-8 border-red-700 flex items-center justify-center text-5xl font-header font-bold cursor-grab active:cursor-grabbing hover:scale-110 transition-transform z-20"
              >
                a
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-6 w-full">
              {Q2_WORDS.map((word) => (
                <div
                  key={word.id}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(word.id)}
                  className="bg-white p-6 rounded-3xl shadow-xl border-4 border-gray-100 flex flex-col items-center gap-4 min-w-[200px]"
                >
                  <span className="text-6xl">{word.icon}</span>
                  <div className="flex items-center text-5xl font-header font-bold text-gray-700 bg-gray-50 px-6 py-3 rounded-2xl border-2 border-gray-200">
                    <div
                      className={`w-16 h-16 mr-2 rounded-full flex items-center justify-center transition-all ${
                        q2Filled[word.id]
                          ? "bg-red-500 text-white"
                          : "bg-gray-200 border-2 border-dashed border-gray-400"
                      }`}
                    >
                      {q2Filled[word.id] ? (
                        "a"
                      ) : (
                        <Utensils size={24} className="text-gray-400" />
                      )}
                    </div>
                    <span>{word.rime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="flex flex-col items-center gap-8 w-full">
            <div className="flex items-center gap-4">
              <h2 className="font-header text-3xl font-bold text-gray-800 text-center">
                Build the Sentence!
              </h2>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold text-sm">
                {q3Index + 1} / 3
              </span>
            </div>
            {q3ShowSuccess && (
              <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                <div className="bg-green-500 text-white px-8 py-4 rounded-3xl shadow-2xl animate-bounce text-3xl font-header font-bold">
                  Correct! 🎉
                </div>
              </div>
            )}
            <div
              className={`min-h-[120px] w-full max-w-4xl bg-white border-4 ${
                q3ShowSuccess
                  ? "border-green-400 bg-green-50"
                  : "border-blue-200"
              } rounded-3xl p-6 flex flex-wrap items-center justify-center gap-3 shadow-inner transition-colors duration-300`}
            >
              {q3BuiltSentence.length === 0 && (
                <span className="text-gray-300 font-bold text-2xl italic font-body">
                  Tap words below...
                </span>
              )}
              {q3BuiltSentence.map((word, i) => (
                <div
                  key={i}
                  className="px-6 py-3 bg-red-100 text-red-800 rounded-xl font-header font-bold text-2xl border-2 border-red-300 animate-in fade-in zoom-in"
                >
                  {word}
                </div>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {currentQ3.scramble.map((word, index) => {
                const totalInBuilt = q3BuiltSentence.filter(
                  (w) => w === word
                ).length;
                const previousInstances = currentQ3.scramble
                  .slice(0, index)
                  .filter((w) => w === word).length;
                const isUsed = totalInBuilt > previousInstances;
                if (isUsed) return <div key={index} className="w-32 h-16" />;
                return (
                  <button
                    key={index}
                    onClick={() => handleWordClick(word)}
                    className={`w-auto px-8 py-4 rounded-2xl text-2xl font-header font-bold border-b-4 transition-all shadow-lg ${
                      q3Error === word
                        ? "bg-red-500 text-white border-red-700 animate-shake"
                        : "bg-orange-500 text-white border-orange-700 hover:scale-105 active:scale-95"
                    }`}
                  >
                    {word}
                  </button>
                );
              })}
            </div>
          </div>
        );
      case 6:
        return (
          <div className="w-full h-full flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-header text-2xl font-bold text-orange-500 flex items-center gap-2">
                <Gamepad2 /> Super A Jump
              </h2>
              <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-bold animate-pulse font-header">
                PLAY NOW!
              </span>
            </div>
            <div className="w-full h-[600px] bg-black rounded-3xl overflow-hidden shadow-2xl border-8 border-white relative mx-auto max-w-5xl">
              <iframe
                src={GAME_URL}
                className="w-full h-full border-none absolute inset-0"
                title="Super A Game"
                onLoad={() => setTimeout(() => setIsCompleted(true), 5000)}
              />
            </div>
          </div>
        );
      case 7:
        return (
          <div className="text-center space-y-8 py-10">
            <div className="flex justify-center gap-6">
              {[1, 2, 3].map((i) => (
                <Star
                  key={i}
                  size={100}
                  className="text-yellow-400 fill-current drop-shadow-2xl animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
            <h1 className="font-header text-6xl font-bold text-blue-600 drop-shadow-md">
              AWESOME!
            </h1>
            <p className="font-header text-3xl font-bold text-gray-700 italic">
              You mastered the letter{" "}
              <span className="text-red-500 text-5xl">a</span>!
            </p>
            <div className="flex justify-center animate-bounce mt-8">
              <span className="text-gray-400 text-sm font-bold uppercase tracking-widest">
                Scroll down for Summary
              </span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative font-body text-slate-800">
      {/* HEADER */}
      <div className="sticky top-0 left-0 w-full bg-white/95 backdrop-blur-md border-b-4 border-blue-100 px-4 py-3 flex justify-between items-center z-50 shadow-sm">
        <img
          src={getAssetUrl(ASSET_PATHS.LOGO, "LOGO")}
          alt="JB Phonics Lab"
          className="h-10 md:h-14 object-contain drop-shadow-sm cursor-pointer hover:rotate-3 transition-transform"
          onClick={onBack}
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
              className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 px-4 py-2 rounded-xl transition-all border-2 border-red-100 font-bold text-sm ml-2"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Exit</span>
            </button>
          </div>
        </div>
      </div>

      <main className="flex-1 flex flex-col items-center p-4 md:p-10 z-0 gap-10">
        {/* === LESSON PLAYER CARD === */}
        <div className="w-full max-w-5xl bg-white rounded-[2.5rem] md:rounded-[4rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col border-[12px] border-white min-h-[600px] relative">
          <div className="bg-gray-50 px-8 py-4 border-b-2 border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {stage > 0 && (
                <button
                  onClick={handleInternalBack}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-full transition-colors mr-2"
                  title="Previous Step"
                >
                  <ArrowLeft size={24} strokeWidth={3} />
                </button>
              )}
              {stage < 7 ? (
                <>
                  <span className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                    {stage + 1}
                  </span>
                  <span className="text-gray-400 font-bold uppercase tracking-widest text-sm">
                    Stage progress
                  </span>
                </>
              ) : (
                <span className="text-green-500 font-black uppercase tracking-widest flex items-center gap-2">
                  <CheckCircle2 size={24} /> Complete
                </span>
              )}
            </div>
            {stage < 7 && (
              <div className="flex-1 max-w-xs mx-4 bg-gray-200 h-3 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-700 ease-out"
                  style={{ width: `${((stage + 1) / 7) * 100}%` }}
                />
              </div>
            )}
          </div>

          <div className="flex-1 p-8 md:p-12 flex flex-col relative overflow-y-auto">
            <div
              className={`${
                [0, 2, 4].includes(stage) ? "block" : "hidden"
              } w-full h-full flex flex-col items-center justify-center space-y-4`}
            >
              <div className="w-full aspect-video relative rounded-3xl overflow-hidden shadow-2xl">
                <VideoPlayer
                  videoUrl={VIDEO_URL}
                  playing={isPlaying && !showVideoNext}
                  startTime={getStartTime()}
                  endTime={getEndTime()}
                  onProgress={handleProgress}
                  onEnded={handleVideoEnd}
                />
                {!videoStarted && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-40">
                    <button
                      onClick={handleStartVideo}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full shadow-2xl border-b-4 border-blue-800 flex items-center gap-3 text-2xl font-header font-bold transform hover:scale-105 transition-all"
                    >
                      <Play size={32} fill="currentColor" /> PRESS PLAY
                    </button>
                  </div>
                )}
                {showVideoNext && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-40 animate-in fade-in">
                    <button
                      onClick={handleInternalNext}
                      className="bg-green-500 hover:bg-green-600 text-white px-10 py-5 rounded-full shadow-2xl border-b-8 border-green-700 flex items-center gap-4 text-2xl font-header font-bold transform hover:scale-105 transition-all animate-bounce"
                    >
                      START ACTIVITY <ArrowRight size={32} />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-blue-500 font-bold text-xl flex items-center gap-2 mt-4">
                <span className="animate-pulse"></span>
              </p>
              <p className="text-gray-400 text-sm italic">
                Note: If watching in full screen, please minimize to continue.
              </p>
            </div>

            {![0, 2, 4].includes(stage) && (
              <div className="flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full flex justify-center">
                {renderQuizContent()}
              </div>
            )}

            {(isCompleted || stage === 6) && stage !== 7 && (
              <div className="absolute bottom-10 right-10 z-50">
                <button
                  onClick={handleInternalNext}
                  className="bg-green-500 hover:bg-green-600 text-white p-6 md:px-10 md:py-6 rounded-full shadow-2xl border-b-8 border-green-700 flex items-center gap-4 text-3xl font-header font-bold group transition-all animate-bounce"
                >
                  NEXT{" "}
                  <ArrowRight
                    size={40}
                    className="group-hover:translate-x-2 transition-transform"
                  />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* === EXPANDED LESSON SUMMARY === */}
        <div className="w-full max-w-5xl flex flex-col gap-8 animate-fade-in-up pb-10">
          <div className="flex items-center gap-4 px-4">
            <div className="h-1 flex-1 bg-white/50 rounded-full"></div>
            <span className="text-slate-500 font-bold uppercase tracking-widest text-lg flex items-center gap-2">
              <BookOpen size={24} /> Lesson Overview
            </span>
            <div className="h-1 flex-1 bg-white/50 rounded-full"></div>
          </div>

          {/* SECTION 1: TARGET SOUND */}
          <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 border-4 border-white shadow-xl flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:scale-110 transition-transform"></div>

            <div
              className="bg-red-100 p-6 rounded-3xl border-4 border-red-200 cursor-pointer hover:scale-110 transition-transform"
              onClick={(e) => playAudio(e, LESSON_SUMMARY.soundAudio)}
            >
              <Volume2 size={48} className="text-red-500" />
            </div>

            <div className="flex-1 text-center md:text-left">
              <h3 className="font-header text-3xl font-bold text-red-900 mb-2">
                Target Sound
              </h3>
              <p className="font-body text-slate-600 text-lg">
                In this lesson, we mastered the{" "}
                <strong className="text-red-600">/a/</strong> sound. This is a
                short vowel sound, like in Apple and Ant!
              </p>
            </div>

            <div
              className="text-7xl font-header font-bold text-white bg-red-500 w-32 h-32 rounded-3xl flex items-center justify-center border-b-8 border-red-700 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform cursor-pointer"
              onClick={(e) => playAudio(e, LESSON_SUMMARY.soundAudio)}
            >
              {LESSON_SUMMARY.sound}
            </div>
          </div>

          {/* SECTION 2: VOCABULARY BUILDER */}
          <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 border-4 border-white shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 p-3 rounded-2xl">
                <Type size={32} className="text-blue-600" />
              </div>
              <h3 className="font-header text-3xl font-bold text-blue-900">
                Vocabulary Builder
              </h3>
              <span className="text-sm text-blue-400 font-bold ml-auto animate-pulse">
                Click cards to hear sound 🔊
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {LESSON_SUMMARY.words.map((w, i) => (
                <div
                  key={i}
                  onClick={(e) => playAudio(e, w.audio)}
                  className="bg-white rounded-3xl p-6 border-2 border-blue-50 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center gap-3 cursor-pointer active:scale-95 active:border-blue-300"
                >
                  <span className="text-6xl drop-shadow-sm">{w.icon}</span>
                  <span className="font-header text-2xl font-bold text-slate-700">
                    <HighlightA text={w.text} />
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 3: SENTENCE PRACTICE */}
          <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 border-4 border-white shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-100 p-3 rounded-2xl">
                <MessageSquare size={32} className="text-green-600" />
              </div>
              <h3 className="font-header text-3xl font-bold text-green-900">
                Sentence Practice
              </h3>
            </div>

            <div className="space-y-4">
              {LESSON_SUMMARY.sentences.map((s, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 bg-green-50 px-6 py-5 rounded-3xl border-l-8 border-green-400 shadow-sm hover:bg-green-100 transition-colors group"
                >
                  <div className="bg-white text-green-700 w-10 h-10 rounded-full flex items-center justify-center font-black shadow-sm flex-shrink-0 border-2 border-green-200">
                    {i + 1}
                  </div>
                  <p className="font-body text-xl md:text-2xl font-bold text-slate-700 leading-tight flex-1">
                    <HighlightA text={s.text} />
                  </p>
                  <button
                    onClick={(e) => playAudio(e, s.audio)}
                    className="p-3 bg-white text-green-600 rounded-full shadow-md hover:scale-110 active:scale-95 transition-all border-2 border-green-100"
                  >
                    <Speaker size={24} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="flex flex-wrap justify-center gap-6 mt-4">
            <button
              onClick={() => setShowFlashcards(true)}
              className="px-8 py-4 bg-teal-500 text-white rounded-2xl text-xl font-header font-bold shadow-lg border-b-4 border-teal-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <Layers size={24} /> Flashcards
            </button>

            <button
              onClick={() => {
                setStage(0);
                setQ1Popped([]);
                setQ2Filled({ apple: false, ant: false, axe: false });
                setQ3Index(0);
                setQ3BuiltSentence([]);
                setIsCompleted(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="px-8 py-4 bg-orange-500 text-white rounded-2xl text-xl font-header font-bold shadow-lg border-b-4 border-orange-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <RefreshCcw size={24} /> Restart
            </button>
          </div>
        </div>
      </main>

      <div className="fixed bottom-8 left-8 z-50">
        <button
          onClick={onBack}
          className="bg-white text-slate-600 hover:text-blue-600 hover:bg-blue-50 px-6 py-4 rounded-full shadow-xl shadow-blue-900/10 border-2 border-white hover:border-blue-200 transition-all flex items-center gap-3 font-header font-bold text-lg active:scale-95"
        >
          <ArrowLeft size={24} strokeWidth={3} />
          <span>Exit Lesson</span>
        </button>
      </div>

      {showFlashcards && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[3rem] p-8 md:p-12 relative flex flex-col items-center gap-6 animate-in zoom-in duration-300 border-8 border-teal-100">
            <button
              onClick={() => setShowFlashcards(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-all"
            >
              <X size={32} />
            </button>

            <h2 className="text-3xl font-header font-bold text-gray-800">
              Flashcards
            </h2>

            <div className="w-64 h-80 bg-white border-4 border-blue-100 rounded-[2rem] shadow-2xl flex flex-col items-center justify-center gap-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-blue-50/50 -z-10" />
              <span className="text-9xl drop-shadow-md group-hover:scale-110 transition-transform duration-300">
                {LESSON_SUMMARY.words[currentFlashcard].icon}
              </span>
              <span className="text-4xl font-header font-bold text-blue-900">
                <HighlightA
                  text={LESSON_SUMMARY.words[currentFlashcard].text}
                />
              </span>
            </div>

            {/* AUDIO BUTTONS */}
            <div className="flex gap-4 w-full justify-center">
              <button
                onClick={(e) => playAudio(e, LESSON_SUMMARY.soundAudio)}
                className="flex-1 py-3 bg-orange-100 text-orange-600 rounded-xl font-bold border-b-4 border-orange-200 active:border-b-0 active:translate-y-1 hover:bg-orange-200 transition-all flex items-center justify-center gap-2"
              >
                <Volume2 size={24} /> /a/ Sound
              </button>
              <button
                onClick={(e) =>
                  playAudio(e, LESSON_SUMMARY.words[currentFlashcard].audio)
                }
                className="flex-1 py-3 bg-blue-100 text-blue-600 rounded-xl font-bold border-b-4 border-blue-200 active:border-b-0 active:translate-y-1 hover:bg-blue-200 transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare size={24} /> Word
              </button>
            </div>

            <div className="flex items-center gap-8 mt-2">
              <button
                onClick={handlePrevCard}
                className="p-4 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 active:scale-95 transition-all shadow-md"
              >
                <ChevronLeft size={32} />
              </button>

              <span className="text-gray-400 font-header font-bold text-lg">
                {currentFlashcard + 1} / {LESSON_SUMMARY.words.length}
              </span>

              <button
                onClick={handleNextCard}
                className="p-4 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 active:scale-95 transition-all shadow-md"
              >
                <ChevronRight size={32} />
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default LessonPlayerA;
