import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Post } from '../data/profiles/posts';
import { Profile } from '../types';
import { useTheme } from '../theme/ThemeContext';

interface PostModalProps {
    post: Post;
    profile: Profile;
    onClose: () => void;
    distanceUnit?: 'km' | 'miles';
}

const PostModal: React.FC<PostModalProps> = ({ post, profile, onClose, distanceUnit = 'km' }) => {
    const { currentTheme } = useTheme();
    const isLightTheme = currentTheme.name === 'Classic Artist Circle Light';
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const getDisplayDistance = (distStr: string) => {
        if (!distStr || distanceUnit === 'km') return distStr;
        const match = distStr.match(/(\d+)/);
        if (!match) return distStr;
        const km = parseInt(match[1]);
        const miles = Math.round(km * 0.621371);
        return distStr.replace(match[1], miles.toString()).replace('km', 'miles');
    };

    const handlePrev = () => {
        setActiveImageIndex(prev => (prev > 0 ? prev - 1 : post.images.length - 1));
    };

    const handleNext = () => {
        setActiveImageIndex(prev => (prev < post.images.length - 1 ? prev + 1 : 0));
    };

    const content = (
        <div className="fixed inset-0 z-[9999] bg-[var(--bg-primary)] flex flex-col animate-in fade-in duration-500 overflow-hidden">
            {/* Header with back button and profile info */}
            <header className="flex items-center gap-4 px-2 py-4 border-b border-[var(--border-color)]">
                <button
                    onClick={onClose}
                    className="w-10 h-10 bg-[var(--bg-tertiary)] rounded-xl flex items-center justify-center text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors flex-shrink-0"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* Profile Photo */}
                <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-white/20">
                    <img src={profile.images[0]} alt={profile.name} className="w-full h-full object-cover" />
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                    <h1 className="text-2xl font-black text-[var(--text-primary)]">{profile.name}</h1>
                    <div className="flex items-center gap-2 text-[var(--text-secondary)] text-[14px] font-medium">
                        {profile.age > 0 && (
                            <>
                                <span>{profile.age}</span>
                                <span className="opacity-50">•</span>
                            </>
                        )}
                        <span>{profile.artistTypes?.[0] || 'Artist'}</span>

                    </div>
                    {profile.distance && (
                        <p className={`${isLightTheme ? 'text-[var(--text-secondary)]' : 'text-white/40'} text-[13px] font-medium`}>{getDisplayDistance(profile.distance)}</p>
                    )}
                </div>
            </header>

            {/* Content - Desktop: Side by side, Mobile: Stacked */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Image Section */}
                <div className="relative flex-1 flex items-center justify-center bg-[var(--bg-primary)] min-h-[40vh] md:min-h-0">
                    <img
                        src={post.images[activeImageIndex]}
                        alt=""
                        className="max-w-full max-h-full object-contain cursor-zoom-in"
                        onClick={() => setIsFullscreen(true)}
                    />

                    {/* Image navigation arrows */}
                    {post.images.length > 1 && (
                        <>
                            <button
                                onClick={handlePrev}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={handleNext}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>

                            {/* Dots indicator */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                {post.images.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImageIndex(idx)}
                                        className={`w-2 h-2 rounded-full transition-all ${idx === activeImageIndex ? 'bg-white w-4' : 'bg-white/40'}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Caption Section - Just the text, no label */}
                <div className="md:w-[400px] lg:w-[450px] xl:w-[500px] bg-[var(--bg-primary)] px-3 py-6 md:border-l md:border-[var(--border-color)] overflow-y-auto">
                    <p className="text-[var(--text-primary)] text-[16px] leading-relaxed font-medium">
                        {post.caption}
                    </p>
                </div>
            </div>
        </div>
    );

    const fullscreenViewer = isFullscreen && (
        <div
            className="fixed inset-0 z-[10000] bg-black flex items-center justify-center"
            onClick={() => { setIsFullscreen(false); setZoomLevel(1); setPanPosition({ x: 0, y: 0 }); }}
        >
            {/* Close button */}
            <button
                onClick={() => { setIsFullscreen(false); setZoomLevel(1); setPanPosition({ x: 0, y: 0 }); }}
                className="absolute top-4 right-4 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white z-10 hover:bg-white/20 transition-colors"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            {/* Zoom controls */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                <button
                    onClick={(e) => { e.stopPropagation(); setZoomLevel(prev => Math.max(0.5, prev - 0.5)); }}
                    className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                </button>
                <span className="flex items-center text-white font-bold text-lg min-w-[60px] justify-center">
                    {Math.round(zoomLevel * 100)}%
                </span>
                <button
                    onClick={(e) => { e.stopPropagation(); setZoomLevel(prev => Math.min(4, prev + 0.5)); }}
                    className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </button>
            </div>

            {/* Zoomable Image */}
            <div
                className="overflow-visible w-full h-full flex items-center justify-center cursor-grab"
                style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                onClick={(e) => e.stopPropagation()}
                onWheel={(e) => {
                    e.preventDefault();
                    const delta = e.deltaY > 0 ? -0.03 : 0.03;
                    setZoomLevel(prev => Math.max(0.5, Math.min(4, prev + delta)));
                }}
                onMouseDown={(e) => {
                    if (zoomLevel > 1) {
                        setIsDragging(true);
                        setDragStart({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y });
                    }
                }}
                onMouseMove={(e) => {
                    if (isDragging && zoomLevel > 1) {
                        setPanPosition({
                            x: e.clientX - dragStart.x,
                            y: e.clientY - dragStart.y
                        });
                    }
                }}
                onMouseUp={() => setIsDragging(false)}
                onMouseLeave={() => setIsDragging(false)}
            >
                <img
                    src={post.images[activeImageIndex]}
                    alt=""
                    className="max-w-full max-h-full object-contain transition-transform duration-100 select-none"
                    style={{
                        transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)`,
                        transformOrigin: 'center'
                    }}
                    draggable={false}
                />
            </div>
        </div>
    );

    return createPortal(
        <>
            {content}
            {fullscreenViewer}
        </>,
        document.body
    );
};

export default PostModal;
