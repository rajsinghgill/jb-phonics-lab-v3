import React, { useState, useEffect } from "react";
import VideoPlayer from "./VideoPlayer";
import {
  Star,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  RefreshCcw,
  Gamepad2,
  Play,
  XCircle,
  Trophy,
  User,
  LogOut,
  ThumbsUp,
  ThumbsDown,
  Lock,
  BookOpen,
  Type,
  MessageSquare,
  Layers,
  X,
  ChevronRight,
  ChevronLeft,
  Volume2,
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
  isTh: boolean;
  icon: string;
}

interface CookingItem {
  id: string;
  rime: string;
  icon: string;
}

// --- CONFIGURATION ---
const VIDEO_URL =
  "https://www.dropbox.com/scl/fi/or2zxqrf4yosu9mckhqs2/Letter-of-th_ver-2.mp4?rlkey=fw3x31n1yf7954uwevvsulhbj&st=yzdqyw7q&raw=1";
const GAME_URL =
  "https://rajsinghgill.github.io/jb-phonics-lab/Theo%20The%20Thirsty%20Thief/theo-the-thirsty-thief.html";
const STOPS = [46.5, 136, 9999];

// Base URL for audio
const AUDIO_BASE =
  "https://raw.githubusercontent.com/rajsinghgill/jb-phonics-lab/main/";

// --- LESSON CONTENT ---
const LESSON_SUMMARY = {
  sound: "th",
  soundAudio: "th-sound.mp3",
  words: [
    { text: "Think", icon: "🤔", audio: "think-sound.mp3" },
    { text: "Thin", icon: "📏", audio: "thin-sound.mp3" },
    { text: "Three", icon: "3️⃣", audio: "three-sound.mp3" },
    { text: "Teeth", icon: "🦷", audio: "teeth-sound.mp3" }, // Updated from Bath
  ] as VocabWord[],
  sentences: [
    { text: "The cat is thin.", audio: "the-cat-is-thin-sound.mp3" },
    { text: "I have three toys.", audio: "i-have-three-toys-sound.mp3" },
    {
      text: "I brush my teeth everyday.",
      audio: "i-brush-my-teeth-everyday-sound.mp3",
    },
  ],
};

// --- QUIZ DATA ---
// Quiz 1: Is it TH?
const Q1_ITEMS: QuizItem[] = [
  { id: "think", label: "Think", isTh: true, icon: "🤔" },
  { id: "tank", label: "Tank", isTh: false, icon: "🛡️" },
  { id: "thin", label: "Thin", isTh: true, icon: "📏" },
  { id: "tree", label: "Tree", isTh: false, icon: "🌳" },
  { id: "three", label: "Three", isTh: true, icon: "3️⃣" },
  { id: "teeth", label: "Teeth", isTh: true, icon: "🦷" }, // Updated
];

// Quiz 2: Blending
const Q2_WORDS: CookingItem[] = [
  { id: "thin", rime: "in", icon: "📏" },
  { id: "think", rime: "ink", icon: "🤔" },
  { id: "three", rime: "ree", icon: "3️⃣" },
];

// Quiz 3: Sentences
const Q3_QUESTIONS = [
  {
    sentenceParts: ["The cat is", "."],
    correct: "thin",
    options: ["thin", "tin", "ten"],
  },
  {
    sentenceParts: ["I have", "toys."],
    correct: "three",
    options: ["three", "tree", "free"],
  },
  {
    sentenceParts: ["I brush my", "everyday."],
    correct: "teeth",
    options: ["teeth", "tent", "team"],
  },
];

// --- HELPER COMPONENT: Highlights 'th' (case insensitive) anywhere in the text ---
const HighlightTh: React.FC<{ text: string }> = ({ text }) => {
  // Split by "th" or "Th" or "TH" keeping the delimiter
  const parts = text.split(/(th)/gi);
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === "th" ? (
          <span key={i} className="text-red-500">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </span>
  );
};

interface LessonPlayerProps {
  onBack: () => void;
  onLogout?: () => void;
  userName?: string;
}

const LessonPlayerTh: React.FC<LessonPlayerProps> = ({
  onBack,
  onLogout,
  userName = "Super Student",
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
    if (stage === 2) return 49;
    if (stage === 4) return 137;
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
    const fullUrl = `${AUDIO_BASE}${fileName}`;
    const audio = new Audio(fullUrl);
    audio.play().catch((err) => console.error("Audio playback error:", err));
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

  const handleVideoEnd = () => {
    if (stage === 4) {
      setIsPlaying(false);
      setShowVideoNext(true);
    }
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
  const [q1Index, setQ1Index] = useState(0);
  const [q1Feedback, setQ1Feedback] = useState<"correct" | "wrong" | null>(
    null
  );
  const [q2Filled, setQ2Filled] = useState<Record<string, boolean>>({
    thin: false,
    think: false,
    three: false,
  });
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [q3Index, setQ3Index] = useState(0);
  const [q3ShowSuccess, setQ3ShowSuccess] = useState(false);

  // --- QUIZ HANDLERS ---
  const handleQ1Choice = (choiceIsTh: boolean) => {
    const currentItem = Q1_ITEMS[q1Index];
    const isCorrect = choiceIsTh === currentItem.isTh;

    if (isCorrect) {
      setQ1Feedback("correct");
      if (currentItem.isTh) {
        // Find matching word audio if available, otherwise just correct feedback
        const wordMatch = LESSON_SUMMARY.words.find(
          (w) => w.text === currentItem.label
        );
        if (wordMatch) playAudio(null, wordMatch.audio);
      }
      setTimeout(() => {
        setQ1Feedback(null);
        if (q1Index < Q1_ITEMS.length - 1) {
          setQ1Index((prev) => prev + 1);
        } else {
          setIsCompleted(true);
        }
      }, 1000);
    } else {
      setQ1Feedback("wrong");
      setTimeout(() => setQ1Feedback(null), 800);
    }
  };

  const handleDrop = (targetId: string) => {
    if (draggedItem === "th") {
      setQ2Filled((prev) => ({ ...prev, [targetId]: true }));
      setDraggedItem(null);
    }
  };

  useEffect(() => {
    if (Object.values(q2Filled).every(Boolean) && stage === 3)
      setIsCompleted(true);
  }, [q2Filled, stage]);

  const handleQ3Select = (selectedWord: string) => {
    const currentQ = Q3_QUESTIONS[q3Index];
    if (selectedWord === currentQ.correct) {
      setQ3ShowSuccess(true);
      setTimeout(() => {
        setQ3ShowSuccess(false);
        if (q3Index < Q3_QUESTIONS.length - 1) {
          setQ3Index((prev) => prev + 1);
        } else {
          setIsCompleted(true);
        }
      }, 1500);
    }
  };

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
      case 1: // Activity 1 (Thumbs Up)
        const currentQ1 = Q1_ITEMS[q1Index];
        return (
          <div className="flex flex-col items-center gap-8 w-full max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-black text-gray-800 text-center">
              Does it have the <span className="text-red-500">th</span> sound?
            </h2>

            <div className="bg-white p-10 rounded-[3rem] shadow-xl border-8 border-blue-100 flex flex-col items-center gap-4 animate-in zoom-in duration-300">
              <span className="text-8xl">{currentQ1.icon}</span>
              <span className="text-4xl font-black text-blue-900">
                {currentQ1.label}
              </span>
            </div>

            <div className="flex gap-8 w-full justify-center">
              <button
                onClick={() => handleQ1Choice(true)}
                className={`flex-1 p-6 rounded-3xl border-b-8 transition-all flex flex-col items-center gap-2 ${
                  q1Feedback === "correct" && currentQ1.isTh
                    ? "bg-green-500 border-green-700 text-white scale-105"
                    : q1Feedback === "wrong" && !currentQ1.isTh
                    ? "bg-red-500 border-red-700 text-white animate-shake"
                    : "bg-blue-50 border-blue-200 hover:translate-y-[-4px] hover:bg-green-100"
                }`}
              >
                <ThumbsUp
                  size={64}
                  className={
                    q1Feedback === "correct" && currentQ1.isTh
                      ? "animate-bounce"
                      : ""
                  }
                />
                <span className="text-2xl font-black">Yes!</span>
              </button>

              <button
                onClick={() => handleQ1Choice(false)}
                className={`flex-1 p-6 rounded-3xl border-b-8 transition-all flex flex-col items-center gap-2 ${
                  q1Feedback === "correct" && !currentQ1.isTh
                    ? "bg-green-500 border-green-700 text-white scale-105"
                    : q1Feedback === "wrong" && currentQ1.isTh
                    ? "bg-red-500 border-red-700 text-white animate-shake"
                    : "bg-blue-50 border-blue-200 hover:translate-y-[-4px] hover:bg-red-100"
                }`}
              >
                <ThumbsDown
                  size={64}
                  className={
                    q1Feedback === "correct" && !currentQ1.isTh
                      ? "animate-bounce"
                      : ""
                  }
                />
                <span className="text-2xl font-black">No</span>
              </button>
            </div>
          </div>
        );

      case 3: // Activity 2 (Blending)
        return (
          <div className="flex flex-col items-center gap-10 w-full">
            <h2 className="text-3xl md:text-4xl font-black text-gray-800 text-center">
              Drag{" "}
              <span className="text-red-500 font-black px-2 bg-red-100 rounded-lg mx-1">
                th
              </span>
              to complete the word!
            </h2>

            <div className="w-full flex justify-center py-4">
              <div
                draggable
                onDragStart={() => setDraggedItem("th")}
                className="w-24 h-24 bg-red-500 text-white rounded-full shadow-xl border-b-8 border-red-700 flex items-center justify-center text-5xl font-black cursor-grab active:cursor-grabbing hover:scale-110 transition-transform z-20"
              >
                th
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
                  <div className="flex items-center text-5xl font-black text-gray-700 gap-1 bg-gray-50 px-4 py-2 rounded-2xl border-2 border-gray-200">
                    <div
                      className={`w-20 h-16 rounded-xl flex items-center justify-center transition-all ${
                        q2Filled[word.id]
                          ? "bg-green-500 text-white shadow-inner"
                          : "bg-gray-200 border-2 border-dashed border-gray-400"
                      }`}
                    >
                      {q2Filled[word.id] ? (
                        "th"
                      ) : (
                        <Lock size={24} className="text-gray-400" />
                      )}
                    </div>
                    <span>{word.rime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 5: // Activity 3 (Sentences)
        const currentQ3 = Q3_QUESTIONS[q3Index];
        return (
          <div className="flex flex-col items-center gap-10 w-full max-w-4xl">
            <h2 className="text-3xl font-black text-gray-800 text-center">
              Complete the Sentence! ({q3Index + 1}/{Q3_QUESTIONS.length})
            </h2>

            <div
              className={`w-full bg-white border-4 ${
                q3ShowSuccess
                  ? "border-green-500 bg-green-50"
                  : "border-blue-200"
              } rounded-3xl p-8 flex flex-wrap items-center justify-center gap-3 shadow-lg transition-colors duration-300`}
            >
              <span className="text-4xl font-bold text-gray-700">
                {currentQ3.sentenceParts[0]}
              </span>

              <div className="min-w-[150px] h-16 border-b-4 border-dashed border-gray-400 flex items-center justify-center">
                {q3ShowSuccess ? (
                  <span className="text-4xl font-black text-green-600 animate-in zoom-in">
                    {currentQ3.correct}
                  </span>
                ) : (
                  <span className="text-4xl font-black text-gray-200">?</span>
                )}
              </div>

              <span className="text-4xl font-bold text-gray-700">
                {currentQ3.sentenceParts[1]}
              </span>
            </div>

            <div className="flex flex-wrap justify-center gap-6 mt-4">
              {currentQ3.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQ3Select(option)}
                  disabled={q3ShowSuccess}
                  className="px-8 py-4 bg-orange-500 text-white rounded-2xl text-3xl font-black border-b-8 border-orange-700 hover:scale-105 active:scale-95 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );

      case 6: // Game
        return (
          <div className="w-full h-full flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-header text-2xl font-black text-orange-500 flex items-center gap-2">
                <Gamepad2 /> Theo The Thirsty Thief!
              </h2>
              <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-bold animate-pulse">
                PLAY NOW!
              </span>
            </div>

            <div className="w-full h-[600px] bg-black rounded-3xl overflow-hidden shadow-2xl border-8 border-white relative mx-auto max-w-5xl">
              <iframe
                src={GAME_URL}
                className="w-full h-full border-none absolute inset-0"
                title="Theo The Thirsty Thief Game"
                onLoad={() => setTimeout(() => setIsCompleted(true), 5000)}
              />
            </div>
          </div>
        );

      case 7: // Success
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
            <h1 className="text-6xl font-black text-blue-600 drop-shadow-md">
              AWESOME!
            </h1>
            <p className="text-3xl font-bold text-gray-700 italic">
              You mastered the sound{" "}
              <span className="text-red-500 text-5xl font-black">th</span>!
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
                <strong className="text-red-600">/th/</strong> sound. It's the
                sound in 'Three' and 'Thin'!
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
                    <HighlightTh text={w.text} />
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
                    <HighlightTh text={s.text} />
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
                setQ1Index(0);
                setQ1Feedback(null);
                setQ2Filled({ thin: false, think: false, three: false });
                setQ3Index(0);
                setQ3ShowSuccess(false);
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
                <HighlightTh
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
                <Volume2 size={24} /> /th/ Sound
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

export default LessonPlayerTh;
