import React, { useState, useRef } from 'react';

interface BufferedVideoProps {
    src: string;
    className?: string; // Additional classes for the video element
    fallbackColor?: string; // Color to show while loading
}

const BufferedVideo: React.FC<BufferedVideoProps> = ({
    src,
    className = "",
    fallbackColor = "#0a0118"
}) => {
    const [isReady, setIsReady] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleVideoProgress = () => {
        const video = videoRef.current;
        if (video && video.buffered.length > 0) {
            const bufferedEnd = video.buffered.end(video.buffered.length - 1);
            if (bufferedEnd >= 0.5) { // Show when we have at least 0.5s buffered
                setIsReady(true);
            }
        }
    };

    return (
        <div className="absolute inset-0 z-0 overflow-hidden">
            {/* Loading state - solid background */}
            <div
                className={`absolute inset-0 z-10 transition-opacity duration-500 ease-out ${isReady ? 'opacity-0' : 'opacity-100'}`}
                style={{ backgroundColor: fallbackColor }}
            />

            {/* Video */}
            <video
                ref={videoRef}
                src={src}
                className={`w-full h-full object-cover transition-opacity duration-500 ease-out ${isReady ? 'opacity-100' : 'opacity-0'} ${className}`}
                autoPlay
                muted
                loop
                playsInline
                onProgress={handleVideoProgress}
                onCanPlay={() => setIsReady(true)}
            />
        </div>
    );
};

export default BufferedVideo;
