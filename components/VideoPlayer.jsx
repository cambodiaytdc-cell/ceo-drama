'use client';

import React from 'react';
import MobileVideoPlayer from './MobileVideoPlayer';
import DesktopVideoPlayer from './DesktopVideoPlayer';

export default function VideoPlayer(props) {
  return (
    <div className="w-full max-w-5xl mx-auto p-2 sm:p-4">
      {/* Mobile Optimized Player */}
      <div className="block md:hidden">
        <MobileVideoPlayer {...props} />
      </div>

      {/* Desktop Optimized Player */}
      <div className="hidden md:block">
        <DesktopVideoPlayer {...props} />
      </div>
    </div>
  );
}
