import React, { useRef, useEffect, useMemo } from "react";

interface VideoPlayerProps {
  videoUrl: string;
  onProgress?: (seconds: number) => void;
  onEnded?: () => void;
  playing?: boolean;
  startTime?: number;
  endTime?: number;
  title?: string; // For Accessibility
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  onProgress,
  onEnded,
  playing = false,
  startTime = 0,
  endTime = Infinity,
  title = "Lesson Video",
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Track last valid time to snap back to if user scrubs past limit
  const lastValidTime = useRef<number>(startTime);

  // --- 1. OPTIMIZE URL (CDN) ---
  // If the video is hosted on GitHub, use jsDelivr CDN for faster streaming.
  // If it's Dropbox or others, keep it as is.
  const optimizedUrl = useMemo(() => {
    if (videoUrl.includes("github.com") && videoUrl.includes("blob")) {
      return videoUrl
        .replace("github.com", "cdn.jsdelivr.net/gh")
        .replace("/blob/", "/")
        .replace("?raw=true", "");
    }
    return videoUrl;
  }, [videoUrl]);

  // --- 2. PLAY/PAUSE SYNC ---
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (playing) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          // Auto-play might be blocked by browser policies until user interaction
          console.warn("Autoplay prevented:", error);
        });
      }
    } else {
      video.pause();
    }
  }, [playing]);

  // --- 3. JUMP TO START TIME ---
  useEffect(() => {
    const video = videoRef.current;
    if (video && typeof startTime === "number") {
      // Only jump if we are significantly far away (prevents audio glitches)
      if (Math.abs(video.currentTime - startTime) > 0.5) {
        video.currentTime = startTime;
        lastValidTime.current = startTime;
      }
    }
  }, [startTime]);

  // --- 4. TIME UPDATE HANDLER (The Loop) ---
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;

    // Boundary Logic: Stop if we pass the endTime
    if (current >= endTime) {
      videoRef.current.pause();
      videoRef.current.currentTime = endTime; // Snap to exact end
      if (onEnded) onEnded(); // Trigger completion
      return;
    }

    // Safety: If UI says paused but video is playing, force pause.
    if (!playing && !videoRef.current.paused) {
      videoRef.current.pause();
    }

    lastValidTime.current = current;

    if (onProgress) {
      onProgress(current);
    }
  };

  // --- 5. SEEKING HANDLER (User Scrubbing) ---
  // Prevents users from dragging the bar past the allowed segment
  const handleSeeked = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;

    // If they drag past the end, snap back
    if (current > endTime) {
      videoRef.current.currentTime = lastValidTime.current;
      videoRef.current.pause();
    }
    // If they drag before start, snap forward
    else if (current < startTime) {
      videoRef.current.currentTime = startTime;
    }
  };

  return (
    <div className="w-full h-full bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 relative group bg-slate-900">
      <video
        ref={videoRef}
        src={optimizedUrl}
        title={title}
        className="w-full h-full object-contain"
        // UX & Controls
        controls={true}
        controlsList="nodownload" // Best Practice: Hide download button
        playsInline // Best Practice: Better mobile experience
        preload="auto" // Best Practice: Start buffering immediately
        // Event Listeners
        onTimeUpdate={handleTimeUpdate}
        onSeeked={handleSeeked}
        onEnded={onEnded}
      />
    </div>
  );
};

export default VideoPlayer;
