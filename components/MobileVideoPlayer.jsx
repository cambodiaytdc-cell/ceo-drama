'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Maximize, Minimize } from 'lucide-react';

export default function MobileVideoPlayer({
  src = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  poster = "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80",
  title = "Star Wars: The Force Awakens",
  genre = "Action / Adventure / Sci-Fi"
}) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const formatTime = (secs) => {
    if (isNaN(secs)) return "00:00";
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
  };

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => setCurrentTime(v.currentTime);
    const onMeta = () => setDuration(v.duration);
    const onEnd = () => setIsPlaying(false);
    v.addEventListener('timeupdate', onTime);
    v.addEventListener('loadedmetadata', onMeta);
    v.addEventListener('ended', onEnd);
    return () => {
      v.removeEventListener('timeupdate', onTime);
      v.removeEventListener('loadedmetadata', onMeta);
      v.removeEventListener('ended', onEnd);
    };
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (isPlaying) { v.pause(); setIsPlaying(false); }
    else { v.play().catch(e => console.log(e)); setIsPlaying(true); }
    setShowControls(true);
  };

  const handleSeek = (e) => {
    const t = parseFloat(e.target.value);
    setCurrentTime(t);
    if (videoRef.current) videoRef.current.currentTime = t;
  };

  const toggleFullscreen = () => {
    const c = containerRef.current;
    if (!c) return;
    if (!document.fullscreenElement) {
      c.requestFullscreen?.() || c.webkitRequestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.() || document.webkitExitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const progressPct = (currentTime / (duration || 1)) * 100;

  return (
    <div className="w-full max-w-full font-sans">
      <div 
        ref={containerRef}
        onClick={() => setShowControls(prev => !prev)}
        className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-xl border border-gray-800 select-none isolate"
      >
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          playsInline
          webkit-playsinline="true"
          x-webkit-airplay="allow"
          className="w-full h-full object-cover"
        />

        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20 pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-orange-500/90 flex items-center justify-center shadow-lg text-white">
              <Play className="w-8 h-8 fill-white ml-1" />
            </div>
          </div>
        )}

        <div className={`absolute inset-0 z-30 bg-black/50 transition-opacity flex flex-col justify-between p-3 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="flex justify-between items-start">
            <div className="min-w-0 pr-2">
              <h2 className="text-white font-bold text-sm truncate">{title}</h2>
              <p className="text-[10px] text-gray-300 truncate">{genre}</p>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
              className="p-2 rounded-lg bg-black/60 text-white border border-white/20 shrink-0"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center justify-center gap-6">
            <button onClick={(e) => { e.stopPropagation(); if (videoRef.current) videoRef.current.currentTime -= 10; }} className="p-3 rounded-full bg-black/60 text-white active:scale-95 transition">
              <SkipBack className="w-6 h-6" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); togglePlay(); }} className="p-4 rounded-full bg-orange-500 text-white shadow-xl active:scale-95 transition">
              {isPlaying ? <Pause className="w-8 h-8 fill-white" /> : <Play className="w-8 h-8 fill-white ml-0.5" />}
            </button>
            <button onClick={(e) => { e.stopPropagation(); if (videoRef.current) videoRef.current.currentTime += 10; }} className="p-3 rounded-full bg-black/60 text-white active:scale-95 transition">
              <SkipForward className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-col gap-1 w-full">
            <div className="relative flex items-center w-full py-2">
              <input type="range" min={0} max={duration || 100} value={currentTime} onChange={handleSeek} onClick={(e) => e.stopPropagation()} className="absolute inset-0 w-full h-8 opacity-0 cursor-pointer z-10" />
              <div className="w-full h-2 bg-gray-700/80 rounded-full overflow-hidden relative">
                <div className="absolute top-0 left-0 h-full bg-orange-500 rounded-full" style={{ width: `${progressPct}%` }} />
              </div>
            </div>
            <div className="flex justify-between items-center text-[11px] text-gray-200 font-medium">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
