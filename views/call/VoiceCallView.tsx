import React, { useState, useEffect } from 'react';
import { Profile } from '../../types';

interface MemberCallState {
    id: string;
    hasJoined: boolean;
    micOn: boolean;
}

interface VoiceCallViewProps {
    profile: Profile;
    onEndCall: (duration: number, callType: 'voice') => void;
    onMinimize?: (duration: number, isMuted: boolean, isSpeaker: boolean, isOnHold: boolean) => void;
    isGroup?: boolean;
    members?: Profile[];
    initialMuted?: boolean;
    initialSpeaker?: boolean;
    initialOnHold?: boolean;
    initialDuration?: number;
    onStateChange?: (state: { isMuted?: boolean; isSpeaker?: boolean; isOnHold?: boolean }) => void;
}

const VoiceCallView: React.FC<VoiceCallViewProps> = ({
    profile,
    onEndCall,
    onMinimize,
    isGroup = false,
    members = [],
    initialMuted = false,
    initialSpeaker = false,
    initialOnHold = false,
    initialDuration = 0,
    onStateChange
}) => {
    const [callDuration, setCallDuration] = useState(initialDuration);
    const [isConnecting, setIsConnecting] = useState(initialDuration === 0);
    const [isMuted, setIsMuted] = useState(initialMuted);
    const [isSpeaker, setIsSpeaker] = useState(initialSpeaker);
    const [isOnHold, setIsOnHold] = useState(initialOnHold);

    // Mock group member states - randomized for demo
    const [memberStates, setMemberStates] = useState<MemberCallState[]>([]);

    // Initialize member states when component mounts - all start as NOT joined
    useEffect(() => {
        if (isGroup && members.length > 0) {
            const initialStates = members.map(member => ({
                id: member.id,
                hasJoined: false, // All members start as not joined
                micOn: false,
            }));
            setMemberStates(initialStates);
        }
    }, [isGroup, members]);

    // Simulate members joining after call connects
    useEffect(() => {
        if (!isConnecting && isGroup && members.length > 0) {
            // Randomly have members join over time
            members.forEach((member, index) => {
                const joinDelay = 1000 + Math.random() * 3000; // 1-4 seconds
                setTimeout(() => {
                    if (Math.random() > 0.3) { // 70% chance to join
                        setMemberStates(prev => prev.map(s =>
                            s.id === member.id
                                ? { ...s, hasJoined: true, micOn: Math.random() > 0.4 }
                                : s
                        ));
                    }
                }, joinDelay);
            });
        }
    }, [isConnecting, isGroup, members]);

    // Simulate connection delay
    useEffect(() => {
        const connectTimer = setTimeout(() => {
            setIsConnecting(false);
        }, 2000);
        return () => clearTimeout(connectTimer);
    }, []);

    // Call timer
    useEffect(() => {
        if (isConnecting || isOnHold) return;
        const timer = setInterval(() => {
            setCallDuration(prev => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [isConnecting, isOnHold]);

    // Sync state changes back to parent
    useEffect(() => {
        if (onStateChange) {
            onStateChange({ isMuted, isSpeaker, isOnHold });
        }
    }, [isMuted, isSpeaker, isOnHold, onStateChange]);

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getMemberState = (memberId: string) => {
        return memberStates.find(s => s.id === memberId) || { hasJoined: false, micOn: false };
    };



    return (
        <div className="fixed inset-0 z-[200] bg-gradient-to-b from-[#1a0b2e] via-[#0a0118] to-[#0a0118] flex flex-col animate-in fade-in duration-300">
            {/* Background gradient animation */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px]" />
            </div>

            {/* Header */}
            <header className="relative z-10 flex items-center justify-between p-4">
                <button
                    onClick={() => onMinimize ? onMinimize(callDuration, isMuted, isSpeaker, isOnHold) : onEndCall(callDuration, 'voice')}
                    className="p-2 text-white/60 hover:text-white transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <span className="text-white/40 text-sm font-medium">Voice Call</span>
                <div className="w-10" />
            </header>

            {/* Profile Section */}
            <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-6">
                {/* Profile Picture */}
                <div className={`relative mb-6 ${isConnecting ? 'animate-pulse' : ''}`}>
                    <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl">
                        <img
                            src={profile.images[0]}
                            alt={profile.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {/* Pulsing ring animation when connecting */}
                    {isConnecting && (
                        <>
                            <div className="absolute inset-0 rounded-full border-4 border-indigo-500/50 animate-ping" />
                            <div className="absolute inset-[-8px] rounded-full border-2 border-indigo-400/30 animate-pulse" />
                        </>
                    )}
                    {/* On hold indicator */}
                    {isOnHold && (
                        <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                            </svg>
                        </div>
                    )}
                </div>

                {/* Name */}
                <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">{profile.name}</h1>

                {/* Call Status */}
                <p className={`text-lg font-medium mb-6 ${isConnecting ? 'text-indigo-400' : isOnHold ? 'text-yellow-400' : 'text-white/60'}`}>
                    {isConnecting ? 'Connecting...' : isOnHold ? 'On Hold' : formatDuration(callDuration)}
                </p>

                {/* Status indicators */}
                <div className="flex items-center gap-3 mb-6">
                    {isMuted && (
                        <span className="px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-xs font-bold text-red-400">
                            Muted
                        </span>
                    )}
                    {isSpeaker && (
                        <span className="px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-xs font-bold text-indigo-400">
                            Speaker On
                        </span>
                    )}
                </div>

                {/* Group Members Section */}
                {isGroup && members.length > 0 && (
                    <div className="w-full max-w-md mt-0 mb-2">
                        <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2 text-center">Participants</h3>
                        <div className="flex gap-4 overflow-x-auto pb-1 px-4 no-scrollbar justify-center" style={{ scrollSnapType: 'x mandatory' }}>
                            {members.map(member => {
                                const state = getMemberState(member.id);
                                return (
                                    <div key={member.id} className="flex flex-col items-center gap-1.5 flex-shrink-0" style={{ scrollSnapAlign: 'start' }}>
                                        <div className="relative">
                                            <div className={`w-16 h-16 rounded-full overflow-hidden border-2 ${state.hasJoined ? 'border-green-500/60' : 'border-white/10 opacity-50'}`}>
                                                <img src={member.images[0]} alt={member.name} className="w-full h-full object-cover" />
                                            </div>
                                            {/* Status indicator dot */}
                                            <div className={`absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full border-2 border-[#0a0118] flex items-center justify-center ${state.hasJoined ? 'bg-green-500' : 'bg-gray-500'}`}>
                                                {state.hasJoined ? (
                                                    state.micOn ? (
                                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z" />
                                                        </svg>
                                                    )
                                                ) : (
                                                    <span className="text-[8px] text-white">•</span>
                                                )}
                                            </div>
                                        </div>
                                        <span className={`text-xs font-semibold ${state.hasJoined ? 'text-white/80' : 'text-white/40'}`}>
                                            {member.name.split(' ')[0]}
                                        </span>
                                        <span className={`text-[10px] font-bold uppercase ${state.hasJoined ? 'text-green-400' : 'text-white/30'}`}>
                                            {state.hasJoined ? (state.micOn ? 'Speaking' : 'Muted') : 'Not Joined'}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>


            {/* Controls Section */}
            <div className="relative z-10 pb-12 px-6">
                {/* Control Buttons Row */}
                <div className="flex items-start justify-center gap-6 mb-8">
                    {/* Mute Button */}
                    <div className="flex flex-col items-center gap-2">
                        <button
                            onClick={() => setIsMuted(!isMuted)}
                            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all active:scale-90 ${isMuted
                                ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                                : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                        >
                            {isMuted ? (
                                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z" />
                                </svg>
                            ) : (
                                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V21c0 .55.45 1 1 1s1-.45 1-1v-3.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z" />
                                </svg>
                            )}
                        </button>
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-wide">Mute</span>
                    </div>

                    {/* Speaker Button */}
                    <div className="flex flex-col items-center gap-2">
                        <button
                            onClick={() => setIsSpeaker(!isSpeaker)}
                            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all active:scale-90 ${isSpeaker
                                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                                : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                        >
                            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                                {isSpeaker ? (
                                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                                ) : (
                                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                                )}
                            </svg>
                        </button>
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-wide">Speaker</span>
                    </div>

                    {/* Hold Button */}
                    <div className="flex flex-col items-center gap-2">
                        <button
                            onClick={() => setIsOnHold(!isOnHold)}
                            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all active:scale-90 ${isOnHold
                                ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/30'
                                : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                        >
                            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                            </svg>
                        </button>
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-wide">Hold</span>
                    </div>


                </div>

                {/* End Call Button */}
                <div className="flex flex-col items-center gap-2">
                    <button
                        onClick={() => onEndCall(callDuration, 'voice')}
                        className="w-20 h-20 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-500/40 hover:bg-red-600 active:scale-90 transition-all"
                    >
                        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.69-1.36-2.67-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z" />
                        </svg>
                    </button>
                    <span className="text-[10px] font-bold text-red-400/60 uppercase tracking-wide">End Call</span>
                </div>
            </div>

            <style>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        .animate-ping {
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
        </div>
    );
};

export default VoiceCallView;
