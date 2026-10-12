'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play } from 'lucide-react';
import PlayerControls from './PlayerControls';

export default function DesktopVideoPlayer({
  src = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  poster = "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80",
  title = "Star Wars: The Force Awakens",
  genre = "Action / Adventure / Fantasy / Sci-Fi",
  thumbnail = "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=150&q=80"
}) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const timeoutRef = useRef(null);

  const formatTime = (secs) => {
    if (isNaN(secs)) return "00:00:00";
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    return h > 0 ? `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}` : `00:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
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
  };

  const handleSeek = (e) => {
    const t = parseFloat(e.target.value);
    setCurrentTime(t);
    if (videoRef.current) videoRef.current.currentTime = t;
  };

  const handleVolume = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    setIsMuted(vol === 0);
    if (videoRef.current) videoRef.current.volume = vol;
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    if (isMuted) { v.volume = volume || 0.5; setIsMuted(false); }
    else { v.volume = 0; setIsMuted(true); }
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

  const handleMouseMove = () => {
    setShowControls(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => isPlaying && setShowControls(false), 3000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto font-sans">
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
        className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800 group select-none isolate"
        style={{ transform: 'translateZ(0)' }}
      >
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          playsInline
          webkit-playsinline="true"
          x-webkit-airplay="allow"
          onClick={togglePlay}
          className="w-full h-full object-cover cursor-pointer"
        />

        {!isPlaying && (
          <div onClick={togglePlay} className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] cursor-pointer z-20">
            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-2xl hover:scale-105 transition transform">
              <Play className="w-12 h-12 text-white fill-white ml-1.5" />
            </div>
          </div>
        )}

        <div className={`absolute inset-x-0 bottom-0 z-30 transition-opacity duration-300 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-12 pb-4 px-6 flex flex-col gap-3 ${showControls || !isPlaying ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <PlayerControls 
            isPlaying={isPlaying}
            togglePlay={togglePlay}
            currentTime={currentTime}
            duration={duration}
            formatTime={formatTime}
            handleSeek={handleSeek}
            title={title}
            genre={genre}
            thumbnail={thumbnail}
            volume={volume}
            isMuted={isMuted}
            toggleMute={toggleMute}
            handleVolume={handleVolume}
            isFullscreen={isFullscreen}
            toggleFullscreen={toggleFullscreen}
            videoRef={videoRef}
          />
        </div>
      </div>
    </div>
  );
}
