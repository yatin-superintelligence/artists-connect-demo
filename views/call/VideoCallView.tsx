import React, { useState, useEffect, useRef } from 'react';
import { Profile } from '../../types';

interface MemberCallState {
    id: string;
    hasJoined: boolean;
    micOn: boolean;
    videoOn: boolean;
}

interface VideoCallViewProps {
    profile: Profile;
    userImage: string;
    onEndCall: (duration: number, callType: 'video') => void;
    onMinimize?: (duration: number, isMuted: boolean, isSpeaker: boolean, isVideoOff: boolean) => void;
    isGroup?: boolean;
    members?: Profile[];
    initialMuted?: boolean;
    initialVideoOff?: boolean;
    initialDuration?: number;
    onStateChange?: (state: { isMuted?: boolean; isVideoOff?: boolean }) => void;
}

// Mock effects and backgrounds
const EFFECTS = [
    { id: 'none', name: 'None', icon: '⊘' },
    { id: 'beauty', name: 'Beauty', icon: '✨' },
    { id: 'smooth', name: 'Smooth', icon: '🌟' },
    { id: 'warm', name: 'Warm', icon: '🔥' },
    { id: 'cool', name: 'Cool', icon: '❄️' },
    { id: 'vintage', name: 'Vintage', icon: '📷' },
    { id: 'noir', name: 'Noir', icon: '🎬' },
    { id: 'vivid', name: 'Vivid', icon: '🌈' },
    { id: 'soft', name: 'Soft', icon: '☁️' },
    { id: 'sharp', name: 'Sharp', icon: '💎' },
];

const BACKGROUNDS = [
    { id: 'none', name: 'None', color: 'transparent' },
    { id: 'blur', name: 'Blur', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { id: 'bedroom', name: 'Bedroom', color: 'linear-gradient(135deg, #f5af19 0%, #f12711 100%)' },
    { id: 'office', name: 'Office', color: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)' },
    { id: 'beach', name: 'Beach', color: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' },
    { id: 'forest', name: 'Forest', color: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)' },
    { id: 'city', name: 'City', color: 'linear-gradient(135deg, #232526 0%, #414345 100%)' },
    { id: 'abstract', name: 'Abstract', color: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)' },
    { id: 'space', name: 'Space', color: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' },
    { id: 'cozy', name: 'Cozy', color: 'linear-gradient(135deg, #8B4513 0%, #D2691E 100%)' },
];

const VideoCallView: React.FC<VideoCallViewProps> = ({
    profile,
    userImage,
    onEndCall,
    onMinimize,
    isGroup = false,
    members = [],
    initialMuted = false,
    initialVideoOff = false,
    initialDuration = 0,
    onStateChange
}) => {
    const [callDuration, setCallDuration] = useState(initialDuration);
    const [isConnecting, setIsConnecting] = useState(initialDuration === 0);
    const [isMuted, setIsMuted] = useState(initialMuted);
    const [isVideoOff, setIsVideoOff] = useState(initialVideoOff); // Default ON for user
    const [showEffectsPanel, setShowEffectsPanel] = useState(false);
    const [selectedEffect, setSelectedEffect] = useState('none');
    const [selectedBackground, setSelectedBackground] = useState('none');
    const [isFrontCamera, setIsFrontCamera] = useState(true);
    const [isMainViewSelf, setIsMainViewSelf] = useState(false);
    const [pipPosition, setPipPosition] = useState({ x: 16, y: 100 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const pipRef = useRef<HTMLDivElement>(null);
    const effectsScrollRef = useRef<HTMLDivElement>(null);
    const backgroundsScrollRef = useRef<HTMLDivElement>(null);

    // Simulated other person's state (mock)
    const otherPersonMicOn = true;
    const otherPersonVideoOn = false;

    // Mock group member states
    const [memberStates, setMemberStates] = useState<MemberCallState[]>([]);

    // Initialize member states when component mounts - all start as NOT joined
    useEffect(() => {
        if (isGroup && members.length > 0) {
            const initialStates = members.map(member => ({
                id: member.id,
                hasJoined: false, // All members start as not joined
                micOn: false,
                videoOn: false,
            }));
            setMemberStates(initialStates);
        }
    }, [isGroup, members]);

    // Simulate members joining after call connects
    useEffect(() => {
        if (!isConnecting && isGroup && members.length > 0) {
            members.forEach((member) => {
                const joinDelay = 1000 + Math.random() * 3000;
                setTimeout(() => {
                    if (Math.random() > 0.3) {
                        setMemberStates(prev => prev.map(s =>
                            s.id === member.id
                                ? { ...s, hasJoined: true, micOn: Math.random() > 0.4, videoOn: Math.random() > 0.5 }
                                : s
                        ));
                    }
                }, joinDelay);
            });
        }
    }, [isConnecting, isGroup, members]);

    useEffect(() => {
        const connectTimer = setTimeout(() => {
            setIsConnecting(false);
        }, 2000);
        return () => clearTimeout(connectTimer);
    }, []);

    useEffect(() => {
        if (isConnecting) return;
        const timer = setInterval(() => {
            setCallDuration(prev => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [isConnecting]);

    // Sync state changes back to parent
    useEffect(() => {
        if (onStateChange) {
            onStateChange({ isMuted, isVideoOff });
        }
    }, [isMuted, isVideoOff, onStateChange]);

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handlePipDragStart = (e: React.TouchEvent | React.MouseEvent) => {
        e.stopPropagation();
        setIsDragging(true);
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        dragStart.current = { x: clientX - pipPosition.x, y: clientY - pipPosition.y };
    };

    const handlePipDragMove = (e: React.TouchEvent | React.MouseEvent) => {
        if (!isDragging) return;
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        const newX = Math.max(8, Math.min(window.innerWidth - 120, clientX - dragStart.current.x));
        const newY = Math.max(60, Math.min(window.innerHeight - 200, clientY - dragStart.current.y));
        setPipPosition({ x: newX, y: newY });
    };

    const handlePipDragEnd = () => {
        setIsDragging(false);
    };

    const handlePipClick = () => {
        if (!isDragging) {
            setIsMainViewSelf(!isMainViewSelf);
        }
    };

    const mainViewImage = isMainViewSelf ? userImage : profile.images[0];
    const pipViewImage = isMainViewSelf ? profile.images[0] : userImage;
    const mainViewVideoOff = isMainViewSelf ? isVideoOff : !otherPersonVideoOn;
    const pipViewVideoOff = isMainViewSelf ? !otherPersonVideoOn : isVideoOff;
    const mainViewName = isMainViewSelf ? 'You' : profile.name;

    const handleWheelScroll = (e: React.WheelEvent<HTMLDivElement>, ref: React.RefObject<HTMLDivElement>) => {
        if (ref.current) {
            e.preventDefault();
            ref.current.scrollLeft += e.deltaY;
        }
    };

    const getMemberState = (memberId: string) => {
        return memberStates.find(s => s.id === memberId) || { hasJoined: false, micOn: false, videoOn: false };
    };

    const getEffectClass = () => {
        switch (selectedEffect) {
            case 'beauty': return 'brightness-110 contrast-105 saturate-110';
            case 'smooth': return 'brightness-105 blur-[0.5px]';
            case 'warm': return 'sepia-[0.3] saturate-110';
            case 'cool': return 'hue-rotate-[20deg] saturate-90';
            case 'vintage': return 'sepia-[0.5] contrast-90';
            case 'noir': return 'grayscale saturate-0 contrast-120';
            case 'vivid': return 'saturate-150 contrast-110';
            case 'soft': return 'brightness-110 contrast-90 saturate-90';
            case 'sharp': return 'contrast-125 saturate-110';
            default: return '';
        }
    };

    return (
        <div
            className="fixed inset-0 z-[200] bg-black flex flex-col animate-in fade-in duration-300"
            onMouseMove={handlePipDragMove}
            onMouseUp={handlePipDragEnd}
            onMouseLeave={handlePipDragEnd}
            onTouchMove={handlePipDragMove}
            onTouchEnd={handlePipDragEnd}
        >
            {/* Main Video View */}
            <div
                className="absolute inset-0 overflow-hidden transition-all duration-500 ease-out"
                style={{
                    paddingBottom: isGroup && members.length > 0 && !isConnecting ? '200px' : '0px'
                }}
            >
                {mainViewVideoOff ? (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#1a0b2e] to-[#0a0118]">
                        <div className={`rounded-full overflow-hidden border-4 border-white/10 mb-4 ${isMainViewSelf ? 'w-32 h-32' : 'w-48 h-48'}`}>
                            <img src={isMainViewSelf ? userImage : profile.images[0]} alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                        <p className="text-white/40 text-sm font-medium">
                            {isMainViewSelf ? 'Your camera is off' : `${mainViewName}'s camera is off`}
                        </p>
                    </div>
                ) : (
                    <div className="w-full h-full relative">
                        <img
                            src={mainViewImage}
                            alt="Video"
                            className={`w-full h-full object-cover ${isMainViewSelf ? getEffectClass() : ''} ${isMainViewSelf && !isFrontCamera ? 'scale-x-[-1]' : ''}`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
                        {isConnecting && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4 mx-auto" />
                                    <p className="text-white text-lg font-medium">Connecting...</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Header */}
            <header className="relative z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent">
                <button
                    onClick={() => onMinimize ? onMinimize(callDuration, isMuted, false, isVideoOff) : onEndCall(callDuration, 'video')}
                    className="p-2 text-white/80 hover:text-white transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <div className="text-center">
                    <h2 className="text-white font-bold text-lg">{profile.name}</h2>
                    <p className="text-white/60 text-sm">
                        {isConnecting ? 'Connecting...' : formatDuration(callDuration)}
                    </p>
                </div>
                <div className="w-10" />
            </header>

            {/* Other Person's Status */}
            {!isConnecting && !isGroup && (
                <div className="absolute top-20 right-4 z-10 flex flex-col gap-2">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-sm ${otherPersonMicOn ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                        <svg className={`w-4 h-4 ${otherPersonMicOn ? 'text-green-400' : 'text-red-400'}`} fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                        </svg>
                        <span className={`text-xs font-bold ${otherPersonMicOn ? 'text-green-400' : 'text-red-400'}`}>
                            {otherPersonMicOn ? 'Mic On' : 'Muted'}
                        </span>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-sm ${otherPersonVideoOn ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                        <svg className={`w-4 h-4 ${otherPersonVideoOn ? 'text-green-400' : 'text-red-400'}`} fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                        </svg>
                        <span className={`text-xs font-bold ${otherPersonVideoOn ? 'text-green-400' : 'text-red-400'}`}>
                            {otherPersonVideoOn ? 'Video On' : 'Video Off'}
                        </span>
                    </div>
                </div>
            )}

            {/* Group Members */}
            {isGroup && members.length > 0 && !isConnecting && (
                <div className="absolute bottom-56 left-0 right-0 z-10 px-4">
                    <div className="bg-black/60 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                        <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-3 text-center">Participants</h3>
                        <div className="flex gap-5 overflow-x-auto pb-2 px-2 no-scrollbar justify-center" style={{ scrollSnapType: 'x mandatory' }}>
                            {members.map(member => {
                                const state = getMemberState(member.id);
                                return (
                                    <div key={member.id} className="flex flex-col items-center gap-2 flex-shrink-0" style={{ scrollSnapAlign: 'start' }}>
                                        <div className="relative">
                                            <div className={`w-20 h-20 rounded-full overflow-hidden border-3 ${state.hasJoined ? 'border-green-500/70' : 'border-white/20 opacity-50'}`}>
                                                <img src={member.images[0]} alt={member.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="absolute -bottom-1 right-0 flex gap-1">
                                                {state.hasJoined ? (
                                                    <>
                                                        <div className={`w-6 h-6 rounded-full border-2 border-black flex items-center justify-center shadow-md ${state.micOn ? 'bg-green-500' : 'bg-red-500'}`}>
                                                            <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                                {state.micOn ? (
                                                                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                                                                ) : (
                                                                    <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z" />
                                                                )}
                                                            </svg>
                                                        </div>
                                                        <div className={`w-6 h-6 rounded-full border-2 border-black flex items-center justify-center shadow-md ${state.videoOn ? 'bg-green-500' : 'bg-red-500'}`}>
                                                            <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                                {state.videoOn ? (
                                                                    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                                                                ) : (
                                                                    <path d="M21 6.5l-4 4V7c0-.55-.45-1-1-1H9.82L21 17.18V6.5zM3.27 2L2 3.27 4.73 6H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.21 0 .39-.08.54-.18L19.73 21 21 19.73 3.27 2z" />
                                                                )}
                                                            </svg>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="w-6 h-6 rounded-full bg-gray-600 border-2 border-black flex items-center justify-center">
                                                        <span className="text-[10px] text-white/80">•</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <span className={`text-sm font-semibold ${state.hasJoined ? 'text-white' : 'text-white/50'}`}>
                                            {member.name.split(' ')[0]}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Self View PiP */}
            <div
                ref={pipRef}
                className={`absolute z-20 w-28 h-40 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl cursor-pointer select-none ${isDragging ? 'scale-105' : ''} transition-transform`}
                style={{ left: pipPosition.x, top: pipPosition.y }}
                onMouseDown={handlePipDragStart}
                onTouchStart={handlePipDragStart}
                onClick={handlePipClick}
            >
                {pipViewVideoOff ? (
                    <div className="w-full h-full bg-[#1a0b2e] flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20">
                            <img src={pipViewImage} alt="PiP" className="w-full h-full object-cover" />
                        </div>
                    </div>
                ) : (
                    <img
                        src={pipViewImage}
                        alt="PiP"
                        className={`w-full h-full object-cover ${!isMainViewSelf ? getEffectClass() : ''} ${!isFrontCamera && !isMainViewSelf ? 'scale-x-[-1]' : ''}`}
                    />
                )}
                <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                </div>
                <div className="absolute top-1 left-1 px-2 py-0.5 rounded-full bg-black/60 text-[9px] font-bold text-white/80">
                    {isMainViewSelf ? profile.name : 'You'}
                </div>
            </div>

            {/* Effects Panel */}
            {showEffectsPanel && (
                <div
                    className="fixed inset-0 z-[210] bg-black/80 backdrop-blur-md flex items-end justify-center"
                    onClick={() => setShowEffectsPanel(false)}
                >
                    <div
                        className="w-full max-w-lg bg-[#1a0b2e] rounded-t-[32px] p-6 border-t border-white/10 shadow-2xl animate-in slide-in-from-bottom duration-300"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="mb-6">
                            <h3 className="text-white font-bold text-sm mb-3 uppercase tracking-widest">Effects</h3>
                            <div
                                ref={effectsScrollRef}
                                className="flex overflow-x-auto gap-3 pb-2 scroll-smooth"
                                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                                onWheel={(e) => handleWheelScroll(e, effectsScrollRef)}
                            >
                                {EFFECTS.map(effect => (
                                    <button
                                        key={effect.id}
                                        onClick={() => setSelectedEffect(effect.id)}
                                        className={`flex-shrink-0 w-16 h-20 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${selectedEffect === effect.id ? 'bg-indigo-500 text-white' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}
                                    >
                                        <span className="text-2xl">{effect.icon}</span>
                                        <span className="text-[9px] font-bold uppercase">{effect.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="mb-6">
                            <h3 className="text-white font-bold text-sm mb-3 uppercase tracking-widest">Backgrounds</h3>
                            <div
                                ref={backgroundsScrollRef}
                                className="flex overflow-x-auto gap-3 pb-2 scroll-smooth"
                                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                                onWheel={(e) => handleWheelScroll(e, backgroundsScrollRef)}
                            >
                                {BACKGROUNDS.map(bg => (
                                    <button
                                        key={bg.id}
                                        onClick={() => setSelectedBackground(bg.id)}
                                        className={`flex-shrink-0 w-16 h-20 rounded-xl flex flex-col items-center justify-center gap-1 transition-all border-2 ${selectedBackground === bg.id ? 'border-indigo-500' : 'border-transparent'}`}
                                        style={{ background: bg.id === 'none' ? 'rgba(255,255,255,0.1)' : bg.color }}
                                    >
                                        {bg.id === 'none' && <span className="text-2xl text-white/60">⊘</span>}
                                        <span className="text-[9px] font-bold uppercase text-white drop-shadow-lg">{bg.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={() => setShowEffectsPanel(false)}
                            className="w-full py-3.5 bg-indigo-600 text-white font-bold rounded-full text-sm active:scale-95 transition-transform"
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}

            {/* Controls */}
            <div className="mt-auto relative z-10 pb-12 px-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-16">
                <div className="flex items-start justify-center gap-5 mb-2">
                    <div className="flex flex-col items-center gap-2">
                        <button
                            onClick={() => setIsFrontCamera(!isFrontCamera)}
                            disabled={isVideoOff}
                            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-90 ${isVideoOff ? 'bg-white/5 text-white/30 cursor-not-allowed' : 'bg-white/15 text-white hover:bg-white/25 backdrop-blur-sm'}`}
                        >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M9 12c0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3-3 1.34-3 3zm-1 0c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4zm11.5-4c.83 0 1.5.67 1.5 1.5v9c0 .83-.67 1.5-1.5 1.5h-15c-.83 0-1.5-.67-1.5-1.5v-9c0-.83.67-1.5 1.5-1.5h3.29l.71-1.7c.18-.44.6-.73 1.07-.73h5.86c.47 0 .89.29 1.07.73l.71 1.7h3.29zM12 17c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5z" />
                            </svg>
                        </button>
                        <span className="text-[9px] font-bold text-white/40 uppercase tracking-wide">Flip</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <button
                            onClick={() => setIsMuted(!isMuted)}
                            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-90 backdrop-blur-sm ${isMuted ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'bg-white/15 text-white hover:bg-white/25'}`}
                        >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V21c0 .55.45 1 1 1s1-.45 1-1v-3.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z" />
                            </svg>
                        </button>
                        <span className="text-[9px] font-bold text-white/40 uppercase tracking-wide">Mute</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <button
                            onClick={() => setIsVideoOff(!isVideoOff)}
                            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-90 backdrop-blur-sm ${isVideoOff ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'bg-white/15 text-white hover:bg-white/25'}`}
                        >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                            </svg>
                        </button>
                        <span className="text-[9px] font-bold text-white/40 uppercase tracking-wide">Video</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <button
                            onClick={() => setShowEffectsPanel(true)}
                            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-90 backdrop-blur-sm ${selectedEffect !== 'none' || selectedBackground !== 'none' ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30' : 'bg-white/15 text-white hover:bg-white/25'}`}
                        >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                            </svg>
                        </button>
                        <span className="text-[9px] font-bold text-white/40 uppercase tracking-wide">Effects</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <button
                            onClick={() => onEndCall(callDuration, 'video')}
                            className="w-14 h-14 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-500/40 hover:bg-red-600 active:scale-90 transition-all"
                        >
                            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.69-1.36-2.67-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z" />
                            </svg>
                        </button>
                        <span className="text-[9px] font-bold text-red-400/60 uppercase tracking-wide">End</span>
                    </div>
                </div>
            </div>

            <style>{`
                .scroll-smooth::-webkit-scrollbar { display: none; }
            `}</style>
        </div>
    );
};

export default VideoCallView;
