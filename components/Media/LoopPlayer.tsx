
import React from 'react';

interface LoopPlayerProps {
  src: string;
  className?: string;
}

const LoopPlayer: React.FC<LoopPlayerProps> = ({ src, className = "" }) => {
  return (
    <video 
      src={src}
      className={`w-full h-full object-cover ${className}`}
      autoPlay
      loop
      muted
      playsInline
    />
  );
};

export default LoopPlayer;
