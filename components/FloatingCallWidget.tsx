import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Profile } from '../types';

interface FloatingCallWidgetProps {
    callType: 'voice' | 'video';
    profile: Profile;
    duration: number;
    isMuted: boolean;
    isSpeaker: boolean;
    isVideoOff?: boolean;
    isOnHold?: boolean;
    onToggleMute: () => void;
    onToggleSpeaker: () => void;
    onToggleVideo?: () => void;
    onToggleHold?: () => void;
    onEndCall: () => void;
    onExpand: () => void;
}

const FloatingCallWidget: React.FC<FloatingCallWidgetProps> = ({
    callType,
    profile,
    duration,
    isMuted,
    isSpeaker,
    isVideoOff = false,
    isOnHold = false,
    onToggleMute,
    onToggleSpeaker,
    onToggleVideo,
    onToggleHold,
    onEndCall,
    onExpand
}) => {
    const [position, setPosition] = useState({ x: 16, y: 100 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStartRef = useRef({ x: 0, y: 0 });
    const positionRef = useRef(position);
    const hasMoved = useRef(false);
    const widgetRef = useRef<HTMLDivElement>(null);

    // Keep positionRef in sync
    useEffect(() => {
        positionRef.current = position;
    }, [position]);

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Calculate widget width (60% of screen)
    const widgetWidth = Math.min(window.innerWidth * 0.6, 300);

    const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setIsDragging(true);
        hasMoved.current = false;
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        dragStartRef.current = { x: clientX - positionRef.current.x, y: clientY - positionRef.current.y };
    };

    // Use window-level event listeners for smoother dragging
    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging) return;
        const newX = Math.max(8, Math.min(window.innerWidth - widgetWidth - 8, e.clientX - dragStartRef.current.x));
        const newY = Math.max(60, Math.min(window.innerHeight - 100, e.clientY - dragStartRef.current.y));
        if (Math.abs(newX - positionRef.current.x) > 3 || Math.abs(newY - positionRef.current.y) > 3) {
            hasMoved.current = true;
        }
        setPosition({ x: newX, y: newY });
    }, [isDragging, widgetWidth]);

    const handleTouchMove = useCallback((e: TouchEvent) => {
        if (!isDragging) return;
        const touch = e.touches[0];
        const newX = Math.max(8, Math.min(window.innerWidth - widgetWidth - 8, touch.clientX - dragStartRef.current.x));
        const newY = Math.max(60, Math.min(window.innerHeight - 100, touch.clientY - dragStartRef.current.y));
        if (Math.abs(newX - positionRef.current.x) > 3 || Math.abs(newY - positionRef.current.y) > 3) {
            hasMoved.current = true;
        }
        setPosition({ x: newX, y: newY });
    }, [isDragging, widgetWidth]);

    const handleDragEnd = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleDragEnd);
            window.addEventListener('touchmove', handleTouchMove, { passive: false });
            window.addEventListener('touchend', handleDragEnd);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleDragEnd);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleDragEnd);
        };
    }, [isDragging, handleMouseMove, handleTouchMove, handleDragEnd]);

    const handleClick = () => {
        if (!hasMoved.current) {
            onExpand();
        }
    };

    return (
        <div
            ref={widgetRef}
            className="fixed z-[250] select-none touch-none"
            style={{
                left: position.x,
                top: position.y,
                width: widgetWidth
            }}
        >
            <div
                className={`bg-[#1a0b2e]/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden transition-transform ${isDragging ? 'scale-105' : ''}`}
                onMouseDown={handleDragStart}
                onTouchStart={handleDragStart}
                onClick={handleClick}
            >
                {/* Header with profile picture and call info */}
                <div className="flex items-center gap-3 p-3 border-b border-white/10 cursor-grab active:cursor-grabbing">
                    {/* Profile picture */}
                    <div className="relative flex-shrink-0">
                        <img
                            src={profile.images[0]}
                            alt={profile.name}
                            className="w-11 h-11 rounded-full object-cover border-2 border-white/20"
                        />
                        {/* Call type indicator */}
                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#1a0b2e] ${callType === 'video' ? 'bg-indigo-500' : 'bg-green-500'}`}>
                            {callType === 'video' ? (
                                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                                </svg>
                            ) : (
                                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
                                </svg>
                            )}
                        </div>
                    </div>

                    {/* Profile info */}
                    <div className="flex-1 min-w-0">
                        <p className="text-white font-bold text-sm truncate">{profile.name}</p>
                        <p className={`text-xs font-semibold ${isOnHold ? 'text-yellow-400' : 'text-green-400'}`}>
                            {isOnHold ? 'On Hold' : formatDuration(duration)}
                        </p>
                    </div>
                </div>

                {/* Control buttons */}
                <div className="flex items-center justify-around p-2 gap-1">
                    {/* Mute button */}
                    <button
                        onClick={(e) => { e.stopPropagation(); onToggleMute(); }}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90 ${isMuted ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'
                            }`}
                    >
                        <span className="text-base">{isMuted ? '🔇' : '🎤'}</span>
                    </button>

                    {/* Video button (only for video calls) */}
                    {callType === 'video' && onToggleVideo && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onToggleVideo(); }}
                            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90 ${isVideoOff ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                        >
                            {isVideoOff ? (
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M21 6.5l-4 4V7c0-.55-.45-1-1-1H9.82L21 17.18V6.5zM3.27 2L2 3.27 4.73 6H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.21 0 .39-.08.54-.18L19.73 21 21 19.73 3.27 2z" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                                </svg>
                            )}
                        </button>
                    )}

                    {/* Hold button (only for voice calls) */}
                    {callType === 'voice' && onToggleHold && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onToggleHold(); }}
                            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90 ${isOnHold ? 'bg-yellow-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                            </svg>
                        </button>
                    )}

                    {/* Speaker button */}
                    <button
                        onClick={(e) => { e.stopPropagation(); onToggleSpeaker(); }}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90 ${isSpeaker ? 'bg-indigo-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'
                            }`}
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            {isSpeaker ? (
                                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                            ) : (
                                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                            )}
                        </svg>
                    </button>

                    {/* End call button */}
                    <button
                        onClick={(e) => { e.stopPropagation(); onEndCall(); }}
                        className="w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-500/30 hover:bg-red-600 active:scale-90 transition-all"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.69-1.36-2.67-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FloatingCallWidget;
