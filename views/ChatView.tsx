// Add missing React import to fix 'Cannot find namespace React' error.
import React, { useState, useRef, useMemo } from 'react';
import { Connection, ChatMessage } from '../types';
import { useTheme } from '../theme/ThemeContext';

interface ChatViewProps {
  connections: Connection[];
  likesCount: number;
  onSelectChat: (connectionId: string) => void;
  onCreateChat: () => void;
  onViewLikes: () => void;
  onMoveChat?: (connectionId: string, toCategory: 'primary' | 'general') => void;
  activeCallConnectionId?: string | null;
  activeCallType?: 'voice' | 'video' | null;
  chatHistories?: { [connectionId: string]: ChatMessage[] };
  isActive?: boolean; // GPU optimization: skip heavy renders when not visible
}

type ChatTab = 'primary' | 'general' | 'calls' | 'missed';

interface CallLogEntry {
  id: string;
  name: string;
  image: string;
  connectionId: string;
  type: 'video' | 'voice';
  direction: 'incoming' | 'outgoing';
  duration: string;
  date: string;
  time: string;
  missed: boolean;
  isGroup?: boolean;
}

const ChatView: React.FC<ChatViewProps> = ({ connections, likesCount, onSelectChat, onCreateChat, onViewLikes, onMoveChat, activeCallConnectionId, activeCallType, chatHistories, isActive = true }) => {
  const { currentTheme } = useTheme();
  const isLightTheme = currentTheme.name === 'Light';
  const isDarkTheme = currentTheme.name === 'Dark';
  const isOrangeTheme = currentTheme.name === 'Orange';
  const isPinkTheme = currentTheme.name === 'Pink';
  const isBrownTheme = currentTheme.name === 'Brown';
  const isColoredTheme = isOrangeTheme || isPinkTheme || isBrownTheme;

  // Theme-specific styling
  const getSelectedTabClass = () => {
    if (isDarkTheme) return 'bg-black text-white';
    if (isLightTheme) return 'bg-white/90 text-black backdrop-blur-sm';
    if (isOrangeTheme) return 'bg-orange-900 text-white';
    if (isPinkTheme) return 'bg-pink-900 text-white';
    if (isBrownTheme) return 'bg-amber-900 text-white';
    return 'bg-[var(--text-primary)] text-[var(--bg-primary)]';
  };

  const getStripBgClass = () => {
    if (isColoredTheme) return 'bg-black/30';
    return 'bg-[var(--bg-tertiary)]';
  };

  const getInnerStripBgClass = () => {
    if (isColoredTheme) return 'bg-black/20';
    return 'bg-white/5';
  };

  const [activeTab, setActiveTab] = useState<ChatTab>('primary');
  const [longPressMenu, setLongPressMenu] = useState<{ connId: string; x: number; y: number; currentCategory: 'primary' | 'general' } | null>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  // Swipe State
  const touchStartRef = useRef<{ x: number, y: number } | null>(null);
  const isSwipingRef = useRef(false);
  const TABS: ChatTab[] = ['primary', 'general', 'calls', 'missed'];

  const handleSwipe = (direction: 'left' | 'right') => {
    const currentIndex = TABS.indexOf(activeTab);
    if (direction === 'left') {
      if (currentIndex < TABS.length - 1) setActiveTab(TABS[currentIndex + 1]);
    } else {
      if (currentIndex > 0) setActiveTab(TABS[currentIndex - 1]);
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const diffX = e.changedTouches[0].clientX - touchStartRef.current.x;
    const diffY = e.changedTouches[0].clientY - touchStartRef.current.y;

    // Horizontal dominance and threshold (25px - reduced for easier swiping)
    if (Math.abs(diffX) > 25 && Math.abs(diffX) > Math.abs(diffY) * 2) {
      // Ignore if starting from a scrollable container (like new connections)
      const target = e.target as HTMLElement;
      const scrollable = target.closest('.overflow-x-auto');
      if (scrollable && scrollable.scrollWidth > scrollable.clientWidth) {
        return;
      }
      handleSwipe(diffX < 0 ? 'left' : 'right');
    }
    touchStartRef.current = null;
  };

  const onWheel = (e: React.WheelEvent) => {
    // Only handle horizontal wheel events (touchpad swipe usually)
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 30) {
      if (isSwipingRef.current) return;

      const target = e.target as HTMLElement;
      const scrollable = target.closest('.overflow-x-auto');
      if (scrollable && scrollable.scrollWidth > scrollable.clientWidth) return;

      handleSwipe(e.deltaX > 0 ? 'left' : 'right');
      isSwipingRef.current = true;
      setTimeout(() => isSwipingRef.current = false, 500); // Debounce
    }
  };

  // Kill video when leaving General tab, reload fresh when entering
  const prevActiveTab = useRef<ChatTab | null>(null);
  const videoDelayTimer = useRef<NodeJS.Timeout | null>(null);
  const [showBackgroundOverlay, setShowBackgroundOverlay] = useState(true);
  const [isVideoMounted, setIsVideoMounted] = useState(false); // Controls if video element exists

  React.useEffect(() => {
    // GPU optimization: If ChatView is not active, unmount video immediately
    if (!isActive) {
      setIsVideoMounted(false);
      setShowBackgroundOverlay(true);
      prevActiveTab.current = activeTab;
      return;
    }

    if (activeTab === 'general' && prevActiveTab.current !== 'general') {
      // Just entered General tab - show background, mount fresh video
      setShowBackgroundOverlay(true);
      setIsGeneralVideoReady(false);
      setIsVideoMounted(true); // Mount the video element

      // After 2 seconds, fade out overlay to reveal video
      if (videoDelayTimer.current) clearTimeout(videoDelayTimer.current);
      videoDelayTimer.current = setTimeout(() => {
        setShowBackgroundOverlay(false);
      }, 2000);
    } else if (activeTab !== 'general' && prevActiveTab.current === 'general') {
      // Just LEFT General tab - unmount video completely
      setIsVideoMounted(false);
      setShowBackgroundOverlay(true);
    }
    prevActiveTab.current = activeTab;

    return () => {
      if (videoDelayTimer.current) clearTimeout(videoDelayTimer.current);
    };
  }, [activeTab, isActive]);

  // Video loading state for general section
  const [isGeneralVideoReady, setIsGeneralVideoReady] = useState(false);
  const generalVideoRef = useRef<HTMLVideoElement>(null);

  const handleGeneralVideoProgress = () => {
    const video = generalVideoRef.current;
    if (video && video.buffered.length > 0) {
      const bufferedEnd = video.buffered.end(video.buffered.length - 1);
      if (bufferedEnd >= 2) {
        setIsGeneralVideoReady(true);
      }
    }
  };

  // Extract real call logs from chat histories
  const callLogs = useMemo<CallLogEntry[]>(() => {
    const logs: CallLogEntry[] = [];
    if (!chatHistories) return logs;

    Object.entries(chatHistories).forEach(([connectionId, messages]: [string, ChatMessage[]]) => {
      const connection = connections.find(c => c.id === connectionId);
      if (!connection) return;

      (messages as ChatMessage[]).forEach(msg => {
        if (msg.isCallLog && msg.timestamp) {
          // Extract duration from message text (format: "A video/voice call lasted MM:SS")
          const durationMatch = msg.text.match(/(\d{2}:\d{2})/);
          const duration = durationMatch ? durationMatch[1] : '';
          const isVideo = msg.text.includes('video');
          const date = new Date(msg.timestamp);

          logs.push({
            id: msg.id,
            name: connection.profile.name,
            image: connection.profile.images[0],
            connectionId: connection.id,
            type: isVideo ? 'video' : 'voice',
            direction: 'outgoing', // All calls from this app are outgoing
            duration,
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
            missed: !duration, // If no duration, it was missed
            isGroup: connection.isGroup
          });
        }
      });
    });

    // Sort by timestamp, most recent first
    return logs.sort((a, b) => {
      const allMessages = Object.values(chatHistories).flat() as ChatMessage[];
      const msgA = allMessages.find(m => m.id === a.id);
      const msgB = allMessages.find(m => m.id === b.id);
      return (msgB?.timestamp || 0) - (msgA?.timestamp || 0);
    });
  }, [chatHistories, connections]);

  // Separate connections into "new" (bubbles at top) and "active" (list below)
  const topConnections = connections.filter(c => !c.lastMessage);
  const activeChats = connections.filter(c => c.lastMessage);

  // Dynamic time update
  const [now, setNow] = useState(Date.now());

  React.useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 5000); // Update every 5 seconds for real-time feel
    return () => clearInterval(interval);
  }, []);

  const getDisplayTime = (conn: Connection) => {
    if (!conn.lastMessageTimestamp) return conn.lastMessageTime;

    const diff = now - conn.lastMessageTimestamp;
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Now';
    if (minutes < 60) return `${minutes} min${minutes !== 1 ? 's' : ''}`;
    if (minutes < 24 * 60) {
      const hours = Math.floor(minutes / 60);
      return `${hours} h`;
    }
    // If older than 24h, fallback to the stored string (which would be date/time)
    return conn.lastMessageTime;
  };


  // Filter active chats by category and sort active call to top
  const sortWithActiveCall = (chats: Connection[]) => {
    if (!activeCallConnectionId) return chats;
    return [...chats].sort((a, b) => {
      if (a.id === activeCallConnectionId) return -1;
      if (b.id === activeCallConnectionId) return 1;
      return 0;
    });
  };
  const primaryChats = sortWithActiveCall(activeChats.filter(c => c.category === 'primary' || !c.category));
  const generalChats = sortWithActiveCall(activeChats.filter(c => c.category === 'general'));

  // Long press handlers
  const handleLongPressStart = (e: React.TouchEvent | React.MouseEvent, connId: string, currentCategory: 'primary' | 'general') => {
    e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    longPressTimer.current = setTimeout(() => {
      setLongPressMenu({ connId, x: clientX, y: clientY, currentCategory });
    }, 600);
  };

  const handleLongPressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleMoveChat = (connId: string, toCategory: 'primary' | 'general') => {
    if (onMoveChat) {
      onMoveChat(connId, toCategory);
    }
    setLongPressMenu(null);
  };

  const renderGroupCircle = (imgs: string[], size: 'sm' | 'md' | 'lg') => {
    const dimMap = {
      sm: 'w-8 h-8',
      md: 'w-[62px] h-[62px]',
      lg: 'w-16 h-16'
    };
    const containerClass = `${dimMap[size]} rounded-2xl overflow-hidden bg-white/10 flex-shrink-0 relative`;

    if (imgs.length <= 1) return <img src={imgs[0] || ''} className={`${dimMap[size]} rounded-2xl object-cover`} />;

    const count = imgs.length;
    const cols = count <= 4 ? 2 : count <= 9 ? 3 : 4;

    return (
      <div className={containerClass}>
        <div
          className="grid w-full h-full gap-[0.5px]"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {imgs.map((img, i) => (
            <div key={i} className={`relative bg-black/10 ${count === 3 && i === 2 ? 'col-span-2' : ''}`}>
              <img src={img} className="absolute inset-0 w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCallLogs = (showOnlyMissed: boolean = false) => {
    const logs = showOnlyMissed ? callLogs.filter(c => c.missed) : callLogs;

    if (logs.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 px-2.5">
          <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-[var(--text-primary)]/80 mb-1">{showOnlyMissed ? 'No missed calls' : 'No call history'}</h3>
          <p className="text-[var(--text-secondary)] text-sm text-center">{showOnlyMissed ? "You haven't missed any calls recently" : 'Your call history will appear here'}</p>
        </div>
      );
    }

    // Group logs by date
    const groupedLogs: { [date: string]: CallLogEntry[] } = {};
    logs.forEach(log => {
      if (!groupedLogs[log.date]) groupedLogs[log.date] = [];
      groupedLogs[log.date].push(log);
    });

    return (
      <div className="mt-2">
        {Object.entries(groupedLogs).map(([date, dateLogs]) => (
          <div key={date}>
            <div className="px-2 py-2 bg-white/[0.02]">
              <span className="text-xs font-bold text-white/30 uppercase tracking-widest">{date}</span>
            </div>
            {dateLogs.map(log => (
              <div key={log.id} className="flex gap-4 items-center px-2 py-4 border-b border-[var(--border-color)] hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer snap-start">
                <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-[var(--border-color)]">
                  <img src={log.image} alt={log.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-bold text-base ${log.missed ? 'text-[var(--accent-primary)]' : 'text-[var(--text-primary)]'}`}>{log.name}</h3>
                    {log.isGroup && (
                      <span className="px-1.5 py-0.5 bg-[#4c1d95]/20 text-[#c084fc] text-[9px] font-bold rounded uppercase">Group</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    {log.direction === 'outgoing' ? (
                      <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                    ) : (
                      <svg className={`w-3.5 h-3.5 ${log.missed ? 'text-[#c084fc]' : 'text-blue-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    )}
                    <span className="text-[var(--text-secondary)] text-sm">
                      {log.type === 'video' ? '📹' : '📞'} {log.missed ? 'Missed' : log.direction === 'outgoing' ? 'Outgoing' : 'Incoming'}
                      {!log.missed && log.duration && ` • ${log.duration}`}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] text-[var(--text-secondary)] font-bold">{log.time}</span>
                  <button className="w-9 h-9 rounded-xl bg-green-500/20 flex items-center justify-center hover:bg-green-500/30 transition-colors">
                    {log.type === 'video' ? (
                      <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const renderGeneralSection = () => {
    if (generalChats.length > 0) {
      // Show chat list for general chats
      return (
        <div className="mt-0">
          {generalChats.map((conn) => (
            <div
              key={conn.id}
              onClick={() => !longPressMenu && onSelectChat(conn.id)}
              onTouchStart={(e) => handleLongPressStart(e, conn.id, 'general')}
              onTouchEnd={handleLongPressEnd}
              onMouseDown={(e) => handleLongPressStart(e, conn.id, 'general')}
              onMouseUp={handleLongPressEnd}
              onMouseLeave={handleLongPressEnd}
              className="flex gap-4 items-center px-2 py-4 hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer group active:bg-[var(--bg-secondary)] border-b border-[var(--border-color)] select-none snap-start"
            >
              <div className="relative flex-shrink-0">
                {conn.isGroup ? renderGroupCircle(conn.profile.images, 'lg') : (
                  <img
                    src={conn.profile.images[0]}
                    className="w-[68px] h-[68px] rounded-2xl object-cover shadow-lg border border-[var(--border-color)]"
                    alt={conn.profile.name}
                  />
                )}
              </div>
              <div className="flex-1 min-w-0 self-start mt-[6px]">
                <div className="flex justify-between items-center mb-0.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <h3 className="font-black text-[1.1rem] truncate text-[var(--text-primary)] tracking-tight">{conn.profile.name}</h3>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {conn.id === activeCallConnectionId && (
                        <div className="px-1.5 py-0.5 bg-green-500/20 border border-green-500/40 rounded-full flex items-center gap-1 animate-pulse">
                          <span className="text-xs">{activeCallType === 'video' ? '📹' : '📞'}</span>
                        </div>
                      )}
                      {conn.profile.isPro && (
                        <div className="w-[18px] h-[18px] bg-[#4c1d95] rounded-full flex items-center justify-center text-[10px] text-white font-black shadow-sm border border-white/10">P</div>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-500 font-black uppercase ml-3 flex-shrink-0 tracking-widest">{getDisplayTime(conn)}</span>
                </div>
                <div className="flex justify-between items-center gap-3">
                  <p className={`text-[0.95rem] truncate leading-tight ${conn.unreadCount > 0 ? 'text-[var(--text-primary)] font-bold' : 'text-[var(--text-secondary)] font-semibold'}`}>
                    {conn.id === activeCallConnectionId
                      ? (activeCallType === 'video' ? 'Video call in progress...' : 'Voice call in progress...')
                      : conn.lastMessage}
                  </p>
                  {conn.unreadCount > 0 && (
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${isLightTheme ? 'bg-black' : 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]'}`}></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Show empty state with video
    return (
      <div className="relative flex-1 min-h-[calc(100vh-140px)] flex flex-col items-center justify-start pt-16 overflow-hidden">
        {/* Video Background - only mounted when on General tab */}
        {isVideoMounted && (
          <video
            ref={generalVideoRef}
            autoPlay
            loop
            muted
            playsInline
            onProgress={handleGeneralVideoProgress}
            onCanPlayThrough={() => setIsGeneralVideoReady(true)}
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="https://videos.pexels.com/video-files/10994871/10994871-sd_540_960_25fps.mp4" type="video/mp4" />
          </video>
        )}

        {/* Video dim overlay - always visible when video is playing */}
        <div className={`absolute inset-0 bg-black/30 transition-opacity duration-700 ${isGeneralVideoReady && isVideoMounted ? 'opacity-100' : 'opacity-0'}`} />

        {/* App background overlay - covers video initially, fades out after 2 seconds */}
        <div className={`absolute inset-0 bg-[var(--bg-primary)] transition-opacity duration-700 ${showBackgroundOverlay ? 'opacity-100' : 'opacity-0'} z-10`} />

        {/* Overlay with message - positioned higher */}
        <div className="relative z-10 flex flex-col items-center justify-center px-8 py-12 bg-black/50 rounded-3xl mx-6 backdrop-blur-sm mt-8">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-5">
            <svg className="w-10 h-10 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2 text-center">No general chats yet</h3>
          <p className="text-white/70 text-sm text-center max-w-xs leading-relaxed">
            Messages from new connections appear here first.<br />
            Keep your connections here... find inspiration in someone new ✨
          </p>
        </div>
      </div>
    );
  };


  const renderPrimarySection = () => (
    <>
      {/* Vertical Chat List (Primary Chats) */}
      <div className="mt-0">
        {primaryChats.map((conn) => (
          <div
            key={conn.id}
            onClick={() => !longPressMenu && onSelectChat(conn.id)}
            onTouchStart={(e) => handleLongPressStart(e, conn.id, 'primary')}
            onTouchEnd={handleLongPressEnd}
            onMouseDown={(e) => handleLongPressStart(e, conn.id, 'primary')}
            onMouseUp={handleLongPressEnd}
            onMouseLeave={handleLongPressEnd}
            className="flex gap-4 items-center px-2 py-4 hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer group active:bg-[var(--bg-secondary)] border-b border-[var(--border-color)] select-none snap-start"
          >
            <div className="relative flex-shrink-0">
              {conn.isGroup ? renderGroupCircle(conn.profile.images, 'lg') : (
                <img
                  src={conn.profile.images[0]}
                  className="w-[68px] h-[68px] rounded-2xl object-cover shadow-lg border border-[var(--border-color)]"
                  alt={conn.profile.name}
                />
              )}
            </div>

            <div className="flex-1 min-w-0 self-start mt-[6px]">
              <div className="flex justify-between items-center mb-0.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <h3 className="font-black text-[1.1rem] truncate text-[var(--text-primary)] tracking-tight">{conn.profile.name}</h3>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {conn.id === activeCallConnectionId && (
                      <div className="px-1.5 py-0.5 bg-green-500/20 border border-green-500/40 rounded-full flex items-center gap-1 animate-pulse">
                        <span className="text-xs">{activeCallType === 'video' ? '📹' : '📞'}</span>
                      </div>
                    )}
                    {conn.profile.isPro && (
                      <div className="w-[18px] h-[18px] bg-[#4c1d95] rounded-full flex items-center justify-center text-[10px] text-white font-black shadow-sm border border-white/10">P</div>
                    )}
                  </div>
                </div>
                <span className="text-[10px] text-gray-500 font-black uppercase ml-3 flex-shrink-0 tracking-widest">{getDisplayTime(conn)}</span>
              </div>
              <div className="flex justify-between items-center gap-3">
                <p className={`text-[0.95rem] truncate leading-tight ${conn.unreadCount > 0 ? 'text-[var(--text-primary)] font-bold' : 'text-[var(--text-secondary)] font-semibold'}`}>
                  {conn.id === activeCallConnectionId
                    ? (activeCallType === 'video' ? 'Video call in progress...' : 'Voice call in progress...')
                    : conn.lastMessage}
                </p>
                {conn.unreadCount > 0 && (
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${isLightTheme ? 'bg-black' : 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]'}`}></div>
                )}
              </div>
            </div>
          </div>
        ))}


      </div>
    </>
  );

  // Theme-specific colors for FAB and Indicators
  const getThemeColorClasses = () => {
    if (isLightTheme) return {
      bg: 'bg-black',
      border: 'border-black/80',
      text: 'text-white',
      shadow: 'shadow-[0_12px_32px_rgba(0,0,0,0.3)]',
      dotBorder: 'border-white'
    };
    if (isOrangeTheme) return {
      bg: 'bg-orange-600',
      border: 'border-orange-600/80',
      text: 'text-white',
      shadow: 'shadow-[0_12px_32px_rgba(234,88,12,0.5)]',
      dotBorder: 'border-[#2d120a]'
    };
    if (isPinkTheme) return {
      bg: 'bg-pink-600',
      border: 'border-pink-600/80',
      text: 'text-white',
      shadow: 'shadow-[0_12px_32px_rgba(219,39,119,0.5)]',
      dotBorder: 'border-[#280514]'
    };
    if (isBrownTheme) return {
      bg: 'bg-amber-700',
      border: 'border-amber-700/80',
      text: 'text-white',
      shadow: 'shadow-[0_12px_32px_rgba(180,83,9,0.5)]',
      dotBorder: 'border-[#1a120b]'
    };
    // Default Dark (Indigo)
    return {
      bg: 'bg-[#4c1d95]',
      border: 'border-[#c084fc]',
      text: 'text-white',
      shadow: 'shadow-[0_12px_32px_rgba(76,29,149,0.5)]',
      dotBorder: 'border-[#0a0118]'
    };
  };

  const themeColors = getThemeColorClasses();

  // Check if we're showing general empty state (video background)
  const isShowingGeneralEmptyState = activeTab === 'general' && generalChats.length === 0;

  return (
    <div
      className={`h-screen bg-[var(--bg-primary)] ${isShowingGeneralEmptyState ? 'pb-0 overflow-hidden' : 'pb-40 overflow-y-auto'} overscroll-y-contain no-scrollbar snap-y snap-proximity scroll-smooth`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onWheel={onWheel}
    >
      {/* Horizontal Header Section */}
      <div className="pt-4 snap-start">
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-3 px-2">
          {/* Likes Card */}
          <div className="flex-shrink-0">
            <div
              onClick={onViewLikes}
              className="h-[48px] bg-[var(--bg-tertiary)] rounded-xl flex items-center justify-center gap-2 px-3.5 border-2 border-[var(--border-color)] cursor-pointer active:scale-95 transition-all shadow-lg hover:border-[var(--text-secondary)]"
            >
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span className="text-[17px] font-black text-[var(--text-primary)] leading-none">{likesCount}</span>
            </div>
          </div>

          {/* New Connections (Circles) */}
          {topConnections.map((conn) => (
            <div
              key={conn.id}
              onClick={() => onSelectChat(conn.id)}
              className="flex-shrink-0 relative cursor-pointer active:scale-95 transition-transform"
            >
              <div className={`w-[63px] h-[63px] rounded-2xl overflow-hidden border-[2.5px] ${themeColors.border} p-0.5 shadow-md`}>
                {conn.isGroup ? renderGroupCircle(conn.profile.images, 'md') : (
                  <img
                    src={conn.profile.images[0]}
                    className="w-full h-full rounded-2xl object-cover"
                    alt="Connection"
                  />
                )}
              </div>
              {!conn.isSeen && (
                <div className={`absolute top-0 right-0 w-4 h-4 ${themeColors.bg} border-[2px] ${themeColors.dotBorder} rounded-full shadow-sm`}></div>
              )}
            </div>
          ))}
        </div>

        {/* Tab Strip */}
        <div className="px-1.5 pb-0 snap-start">
          <div className={`flex gap-2 ${getStripBgClass()} rounded-2xl p-1.5`}>
            {/* Primary/General Toggle */}
            <div className={`flex-1 flex ${getInnerStripBgClass()} rounded-xl p-1`}>
              <button
                onClick={() => setActiveTab('primary')}
                className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${activeTab === 'primary'
                  ? `${getSelectedTabClass()} shadow-lg`
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
              >
                Primary
              </button>
              <button
                onClick={() => setActiveTab('general')}
                className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${activeTab === 'general'
                  ? `${getSelectedTabClass()} shadow-lg`
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
              >
                General
              </button>
            </div>
            {/* Call Logs */}
            <button
              onClick={() => setActiveTab('calls')}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${activeTab === 'calls'
                ? `${getSelectedTabClass()} shadow-lg`
                : `text-[var(--text-secondary)] hover:text-[var(--text-primary)] ${isColoredTheme ? 'bg-black/20' : 'bg-[var(--bg-tertiary)]'}`
                }`}
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
              </svg>
              Logs
            </button>
            {/* Missed Calls */}
            <button
              onClick={() => setActiveTab('missed')}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${activeTab === 'missed'
                ? `${getSelectedTabClass()} shadow-lg`
                : `text-[var(--text-secondary)] hover:text-[var(--text-primary)] ${isColoredTheme ? 'bg-black/20' : 'bg-[var(--bg-tertiary)]'}`
                }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Missed
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'primary' && renderPrimarySection()}
        {activeTab === 'general' && renderGeneralSection()}
        {activeTab === 'calls' && renderCallLogs(false)}
        {activeTab === 'missed' && renderCallLogs(true)}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-[calc(8rem-3vh)] right-6 z-50">
        <button
          onClick={onCreateChat}
          className={`w-16 h-16 ${themeColors.bg} ${themeColors.text} rounded-2xl flex items-center justify-center ${themeColors.shadow} transition-all active:scale-90 hover:scale-105`}
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Long Press Context Menu */}
      {longPressMenu && (
        <>
          <div
            className="fixed inset-0 z-[100]"
            onClick={() => setLongPressMenu(null)}
            onTouchStart={() => setLongPressMenu(null)}
          />
          <div
            className={`fixed z-[101] border border-white/20 rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 ${currentTheme.name === 'Hot Pink' ? 'bg-pink-900' :
              currentTheme.name === 'That Orange' ? 'bg-orange-900' :
                currentTheme.name === 'More Brown' ? 'bg-amber-900' :
                  'bg-[#1a0b2e]'
              }`}
            style={{ left: longPressMenu.x - 80, top: longPressMenu.y - 20 }}
          >
            <button
              onClick={() => handleMoveChat(longPressMenu.connId, longPressMenu.currentCategory === 'primary' ? 'general' : 'primary')}
              className="px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              {longPressMenu.currentCategory === 'primary' ? 'Move to General' : 'Move to Primary'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatView;