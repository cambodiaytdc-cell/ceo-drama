'use client';

import React from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, Minimize, 
  Settings, Share2, SkipBack, SkipForward, Subtitles 
} from 'lucide-react';

export default function PlayerControls({
  isPlaying,
  togglePlay,
  currentTime,
  duration,
  formatTime,
  handleSeek,
  title,
  genre,
  thumbnail,
  volume,
  isMuted,
  toggleMute,
  handleVolume,
  isFullscreen,
  toggleFullscreen,
  videoRef
}) {
  const progressPct = (currentTime / (duration || 1)) * 100;

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex flex-col gap-1 w-full">
        <div className="relative flex items-center w-full group/slider">
          <input type="range" min={0} max={duration || 100} value={currentTime} onChange={handleSeek} className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer z-10" />
          <div className="w-full h-1.5 bg-gray-700/80 rounded-full overflow-hidden relative">
            <div className="absolute top-0 left-0 h-full bg-orange-500 rounded-full transition-all" style={{ width: `${progressPct}%` }} />
          </div>
          <div className="absolute h-3.5 w-3.5 bg-orange-500 rounded-full shadow-md pointer-events-none transform -translate-x-1/2 transition-transform group-hover/slider:scale-125" style={{ left: `${progressPct}%` }} />
        </div>
        <div className="flex justify-between items-center text-xs text-gray-300 font-medium px-0.5">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <img src={thumbnail} alt={title} className="w-10 h-14 sm:w-12 sm:h-16 rounded-lg object-cover border border-white/20 shadow-md shrink-0 hidden xs:block" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-white font-bold text-sm sm:text-base truncate">{title}</h3>
              <button className="text-gray-400 hover:text-white shrink-0 hidden md:block" title="Share"><Share2 className="w-4 h-4" /></button>
            </div>
            <p className="text-xs text-gray-400 truncate">{genre}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button onClick={() => { if (videoRef.current) videoRef.current.currentTime -= 10; }} className="text-gray-300 hover:text-white transition hidden md:flex p-1.5 rounded-full hover:bg-white/10"><SkipBack className="w-5 h-5" /></button>
          <button onClick={togglePlay} className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center shadow-lg transition transform hover:scale-105 shrink-0">
            {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
          </button>
          <button onClick={() => { if (videoRef.current) videoRef.current.currentTime += 10; }} className="text-gray-300 hover:text-white transition hidden md:flex p-1.5 rounded-full hover:bg-white/10"><SkipForward className="w-5 h-5" /></button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0 justify-end flex-1">
          <div className="hidden sm:flex items-center gap-2 bg-black/40 px-2.5 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
            <button onClick={toggleMute} className="text-gray-300 hover:text-white transition">
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-orange-500" /> : <Volume2 className="w-4 h-4 text-gray-300" />}
            </button>
            <input type="range" min={0} max={1} step={0.05} value={isMuted ? 0 : volume} onChange={handleVolume} className="w-16 sm:w-20 accent-orange-500 h-1 bg-gray-600 rounded-lg cursor-pointer" />
          </div>
          <button className="text-gray-300 hover:text-white transition p-1.5 rounded-full hover:bg-white/10 hidden lg:block"><Subtitles className="w-5 h-5" /></button>
          <button className="text-gray-300 hover:text-white transition p-1.5 rounded-full hover:bg-white/10 hidden md:block"><Settings className="w-5 h-5" /></button>
          <button onClick={toggleFullscreen} className="text-gray-300 hover:text-white transition p-2 rounded-xl bg-black/40 hover:bg-orange-500 hover:text-white border border-white/10 backdrop-blur-md shadow-lg">
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
