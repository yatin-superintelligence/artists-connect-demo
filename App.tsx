
import React, { useState, useEffect, useRef } from 'react';
import { ThemeProvider } from './theme/ThemeContext';
import { themes } from './theme/themes';
import { ThemeName } from './theme/types';
import BottomNav from './components/BottomNav';
import FloatingCallWidget from './components/FloatingCallWidget';
import DiscoverView from './views/DiscoverView';
import LikesView from './views/LikesView';
import ChatView from './views/ChatView';
import CreateChatView from './views/CreateChatView';
import IndividualChatView from './views/IndividualChatView';
import ProfileView from './views/ProfileView';
import EditProfileView from './views/EditProfileView';
import ProView from './views/ProView';
import OutOfSparksView from './views/OutOfSparksView';
import SendSparkView from './views/SendSparkView';
import UpliftView from './views/UpliftView';
import VerifyProfileView from './views/VerifyProfileView';
import ProfilePhotosView from './views/ProfilePhotosView';

import FilterModal from './views/FilterModal';
import AppSettingsView from './views/AppSettingsView';
import HelpCenterView from './views/HelpCenterView';


import MatchView from './views/MatchView';
import AcknowledgementView from './views/AcknowledgementView';
import { Tab, Profile, Connection, ChatMessage } from './types';
import { DISCOVER_PROFILES } from './data/profiles/discover/profiles';
import { CHAT_CONNECTIONS } from './data/profiles/chat/connections';
import { LIKES_PROFILES } from './data/profiles/likes/profiles';
import { INITIAL_CHAT_HISTORIES } from './data/chats/history';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Discover);
  const [discoverActiveIndex, setDiscoverActiveIndex] = useState(0);
  const [hasAcknowledged, setHasAcknowledged] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [proVariant, setProVariant] = useState<'lastSeen' | 'likes' | 'general' | 'incognito' | null>(null);
  const [outOfSparksName, setOutOfSparksName] = useState<string | null>(null);
  const [showSendSpark, setShowSendSpark] = useState(false);
  const [showUplift, setShowUplift] = useState(false);
  const [showVerifyProfile, setShowVerifyProfile] = useState(false);
  const [showProfilePhotos, setShowProfilePhotos] = useState(false);

  const [showAppSettings, setShowAppSettings] = useState(false);
  const [showHelpCenter, setShowHelpCenter] = useState(false);


  const [showMagazine, setShowMagazine] = useState(false);
  const [showThemes, setShowThemes] = useState(false);
  const [matchProfile, setMatchProfile] = useState<Profile | null>(null);

  // Back button navigation state
  const [tabHistory, setTabHistory] = useState<Tab[]>([Tab.Discover]);
  const doubleBackRef = useRef<boolean>(false);

  // Global call state - persists when minimized
  const [activeGlobalCall, setActiveGlobalCall] = useState<{
    type: 'voice' | 'video';
    profile: Profile;
    connectionId: string;
    startTime: number;
    isMuted: boolean;
    isSpeaker: boolean;
    isVideoOff: boolean;
    isOnHold: boolean;
    isCallVisible: boolean; // true = full call view, false = minimized widget
  } | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [likes, setLikes] = useState<Profile[]>(LIKES_PROFILES);
  const [hiddenProfileIds, setHiddenProfileIds] = useState<string[]>([]);
  const [chatHistories, setChatHistories] = useState<Record<string, ChatMessage[]>>(INITIAL_CHAT_HISTORIES);
  const [initialGroupMembers, setInitialGroupMembers] = useState<string[]>([]);

  const [activeFilterTab, setActiveFilterTab] = useState<string | null>(null);
  const [discoverFadeIn, setDiscoverFadeIn] = useState(false);
  const [discoverFadeOut, setDiscoverFadeOut] = useState(false);
  const discoverFadeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Track when filter opens/closes to trigger fade animations
  const prevFilterTabRef = useRef<string | null>(null);
  useEffect(() => {
    // Filter just opened (was null, now has value)
    if (!prevFilterTabRef.current && activeFilterTab) {
      setDiscoverFadeIn(false);
      setDiscoverFadeOut(true);
      // No timer needed - we keep fadeOut true while filter is open
    }
    // Filter just closed (was open, now null)
    else if (prevFilterTabRef.current && !activeFilterTab) {
      setDiscoverFadeOut(false);
      setDiscoverFadeIn(true);
      // Clear fade-in state after animation completes
      if (discoverFadeTimerRef.current) clearTimeout(discoverFadeTimerRef.current);
      discoverFadeTimerRef.current = setTimeout(() => {
        setDiscoverFadeIn(false);
      }, 600);
    }
    prevFilterTabRef.current = activeFilterTab;
  }, [activeFilterTab]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (discoverFadeTimerRef.current) clearTimeout(discoverFadeTimerRef.current);
    };
  }, []);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('current');
  const [distanceValue, setDistanceValue] = useState<number>(114);
  const [distanceUnit, setDistanceUnit] = useState<'km' | 'miles'>('km');
  const [minAge, setMinAge] = useState<number>(18);
  const [maxAge, setMaxAge] = useState<number>(75);
  const [selectedArtistTypes, setSelectedArtistTypes] = useState<string[]>([]);

  const [connections, setConnections] = useState<Connection[]>(CHAT_CONNECTIONS);
  const [myProfile, setMyProfile] = useState<Profile>({
    id: 'me',
    name: 'Roxanne',
    age: 25,
    profileType: 'Artist',

    distance: '0 km away',
    bio: 'I see the world in brushstrokes and pixels. As a painter and digital artist, I\'m obsessed with capturing the fleeting moments that others might miss—the way light hits a messy studio floor, or the glitchy beauty of a corrupted file.\n\nMy hands are usually covered in paint, even when I\'m working on my iPad. I believe art isn\'t just what you create, but how you live. Looking for someone who isn\'t afraid to get their hands dirty or debate the merits of brutalism over coffee.\n\nLet\'s make something beautiful, or at least something honest.',
    images: [
      'https://images.pexels.com/photos/4442088/pexels-photo-4442088.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1820559/pexels-photo-1820559.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    isVerified: true,
    artistTypes: ['Painter (oil)', 'Digital artist'],
    interests: ['Art', 'Architecture', 'Music', 'Photography', 'Coffee'],
    hiddenBio: 'I have a collection of vintage polaroids and a secret appreciation for bad 80s synth-pop.',
    isHidden: false,
    isIncognito: false
  });

  // Call duration timer for active call
  useEffect(() => {
    if (activeGlobalCall) {
      callTimerRef.current = setInterval(() => {
        setCallDuration(Math.floor((Date.now() - activeGlobalCall.startTime) / 1000));
      }, 1000);
    } else {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
        callTimerRef.current = null;
      }
      setCallDuration(0);
    }
    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    };
  }, [activeGlobalCall]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isBootVideoReady, setIsBootVideoReady] = useState(false);
  const [isBootPhase1, setIsBootPhase1] = useState(true);
  const [isBootPhase2Ready, setIsBootPhase2Ready] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Adaptive Boot Screen Logic - Starts ONLY after acknowledgement
  // Use lazy initializer to avoid flash
  const [bootStyles, setBootStyles] = useState(() => {
    // 1. Check local storage first
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('feeld-theme-preference');
      if (saved && (saved === 'Orange' || saved === 'Pink' || saved === 'Brown')) {
        const theme = themes[saved as ThemeName];
        if (theme) {
          return { bg: theme.colors.bgPrimary, text: '#ffffff' };
        }
      }

      // 2. Check system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return { bg: '#ffffff', text: '#000000' };
      }
    }

    // 3. Default fallback (Dark)
    return { bg: '#0a0118', text: '#ffffff' };
  });

  // Staggered preloading state - views mount one by one during boot
  const [preloadedViews, setPreloadedViews] = useState<Set<Tab>>(new Set([Tab.Discover]));

  // Phase 1: Dark background for 2s minimum, but wait for video to load
  // Phase 1: Dark background for 2s minimum
  // If video loads within 3s, show it. If not by 3s, force proceed (to avoid infinite stuck)
  useEffect(() => {
    // Check at 1s - if ready, proceed immediately
    const checkTimer = setTimeout(() => {
      if (isBootVideoReady && hasAcknowledged) {
        setIsBootPhase1(false);
        setIsBootPhase2Ready(true);
      }
    }, 1000);

    // Force proceed at 2s - if still not ready, just move on (Phase 2 has logic to handle missing video)
    const forceTimer = setTimeout(() => {
      if (isBootPhase1 && hasAcknowledged) { // Only if still stuck in Phase 1 AND acknowledged
        setIsBootPhase1(false);
        setIsBootPhase2Ready(true);
      }
    }, 2000);

    return () => {
      clearTimeout(checkTimer);
      clearTimeout(forceTimer);
    };
  }, [isBootVideoReady, isBootPhase1, hasAcknowledged]);

  // If video loads after 2s timer, immediately start phase 2
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isBootVideoReady && isBootPhase1 && hasAcknowledged) {
        setIsBootPhase1(false);
        setIsBootPhase2Ready(true);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [isBootVideoReady, isBootPhase1, hasAcknowledged]);

  // Phase 2: Play video once phase 1 is done - with adaptive timing
  // If video loads within first 3 seconds of phase 2, show video for full 6s boot
  // If video doesn't load in 3s, end boot early at 4s (no point waiting for nothing)
  useEffect(() => {
    if (isBootPhase2Ready && videoRef.current) {
      let ended = false;

      // Check if video is already ready when phase 2 starts
      if (isBootVideoReady) {
        videoRef.current.play().catch(() => { });
      }

      // Early exit timer: If video NOT loaded by 3s, exit quickly at 4s total
      const earlyFadeTimer = setTimeout(() => {
        if (!isBootVideoReady && !ended) {
          setIsFadingOut(true);
        }
      }, 3000);

      const earlyHideTimer = setTimeout(() => {
        if (!isBootVideoReady && !ended) {
          ended = true;
          setShowSplash(false);
        }
      }, 4000);

      // Full boot timer: If video loaded, show it for full duration (fade at 4s, hide at 5s of phase 2)
      const fullFadeTimer = setTimeout(() => {
        if (isBootVideoReady && !ended) {
          setIsFadingOut(true);
        }
      }, 4000);

      const fullHideTimer = setTimeout(() => {
        if (isBootVideoReady && !ended) {
          ended = true;
          setShowSplash(false);
        }
      }, 5000);

      return () => {
        clearTimeout(earlyFadeTimer);
        clearTimeout(earlyHideTimer);
        clearTimeout(fullFadeTimer);
        clearTimeout(fullHideTimer);
      };
    }
  }, [isBootPhase2Ready, isBootVideoReady]);

  // Staggered preloading of views during boot
  useEffect(() => {
    // Preload profile images immediately
    DISCOVER_PROFILES.forEach(p => {
      const img = new Image();
      img.src = p.images[0];
    });
    LIKES_PROFILES.forEach(p => {
      const img = new Image();
      img.src = p.images[0];
    });
    CHAT_CONNECTIONS.forEach(c => {
      const img = new Image();
      img.src = c.profile.images[0];
    });

    // Stagger view preloading: Likes at 500ms, Chat at 1000ms, Profile at 1500ms
    const likesTimer = setTimeout(() => {
      setPreloadedViews(prev => new Set([...prev, Tab.Likes]));
    }, 500);
    const chatTimer = setTimeout(() => {
      setPreloadedViews(prev => new Set([...prev, Tab.Chat]));
    }, 1000);
    const profileTimer = setTimeout(() => {
      setPreloadedViews(prev => new Set([...prev, Tab.Profile]));
    }, 1500);

    return () => {
      clearTimeout(likesTimer);
      clearTimeout(chatTimer);
      clearTimeout(profileTimer);
    };
  }, []);

  // Preload popup videos AFTER boot splash ends
  useEffect(() => {
    if (!showSplash) {
      const videoUrls = [
        'https://videos.pexels.com/video-files/5649214/5649214-sd_960_540_25fps.mp4', // Majestic
        'https://images.pexels.com/video-files/6568126/6568126-sd_506_960_25fps.mp4', // Magazine
        'https://images.pexels.com/video-files/8451945/8451945-sd_540_960_25fps.mp4', // Community & About
        'https://videos.pexels.com/video-files/6560039/6560039-sd_506_960_25fps.mp4', // HelpCenter Support
        'https://videos.pexels.com/video-files/7364275/7364275-sd_540_960_30fps.mp4', // MiniBrowser
        'https://videos.pexels.com/video-files/7565634/7565634-sd_540_960_25fps.mp4', // Share Profile
        'https://videos.pexels.com/video-files/6959721/6959721-sd_540_960_25fps.mp4', // Chat General tab empty state
      ];
      videoUrls.forEach(url => {
        const video = document.createElement('video');
        video.preload = 'auto';
        video.muted = true;
        video.src = url;
        video.load();
      });
    }
  }, [showSplash]);

  // Back button navigation - initial history trap (push 2 states so first back doesn't exit)
  useEffect(() => {
    window.history.pushState({ app: true }, '', window.location.href);
    window.history.pushState({ app: true }, '', window.location.href);
  }, []);

  // Push history state whenever entering a navigable state
  // This ensures each screen/modal has its own history entry for proper back navigation
  useEffect(() => {
    const hasActiveOverlay = activeGlobalCall?.isCallVisible || proVariant || activeFilterTab ||
      matchProfile || showSendSpark || showUplift || showVerifyProfile || showProfilePhotos ||
      showAppSettings || showHelpCenter ||
      showMagazine || showThemes ||
      outOfSparksName || isCreatingChat || isEditingProfile || activeChatId;

    if (hasActiveOverlay) {
      window.history.pushState({ app: true }, '', window.location.href);
    }
  }, [
    activeGlobalCall?.isCallVisible, proVariant, activeFilterTab, matchProfile,
    showSendSpark, showUplift, showVerifyProfile, showProfilePhotos,
    showAppSettings, showHelpCenter,
    showMagazine, showThemes, outOfSparksName, isCreatingChat, isEditingProfile, activeChatId
  ]);

  // Back button navigation - handle popstate
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // Check if a child component already handled this event
      if ((window as any).__backHandled) return;

      const state = event.state || {};
      let handled = false;

      // Global check: If a child component has an active overlay/popup, let it handle the back button
      if ((window as any).__chatOverlayOpen || (window as any).__internalPopupOpen || (window as any).__postModalOpen) return;

      // Priority 1: Modals & Overlays
      if (activeGlobalCall?.isCallVisible) {
        setActiveGlobalCall(prev => prev ? { ...prev, isCallVisible: false } : null);
        handled = true;
      } else if (proVariant) {
        setProVariant(null);
        handled = true;
      } else if (activeFilterTab) {
        setActiveFilterTab(null);
        handled = true;
      } else if (matchProfile) {
        setHiddenProfileIds(prev => [...prev, matchProfile.id]);
        setMatchProfile(null);
        handled = true;
      } else if (showSendSpark) {
        setShowSendSpark(false);
        handled = true;
      } else if (showUplift) {
        setShowUplift(false);
        handled = true;
      } else if (showVerifyProfile) {
        setShowVerifyProfile(false);
        handled = true;
      } else if (showProfilePhotos) {
        setShowProfilePhotos(false);
        handled = true;

      } else if (showAppSettings) {
        setShowAppSettings(false);
        handled = true;
      } else if (showHelpCenter) {
        setShowHelpCenter(false);
        handled = true;

      } else if (showMagazine) {
        setShowMagazine(false);
        handled = true;
      } else if (showThemes) {
        setShowThemes(false);
        handled = true;
      } else if (outOfSparksName) {
        setOutOfSparksName(null);
        handled = true;
      }
      // Priority 2: Sub-views
      else if (isCreatingChat) {
        setIsCreatingChat(false);
        setInitialGroupMembers([]);
        handled = true;
      } else if (isEditingProfile) {
        setIsEditingProfile(false);
        handled = true;
      } else if (activeChatId) {
        setActiveChatId(null);
        handled = true;
      }
      // Priority 3: Tab History
      else if (tabHistory.length > 1) {
        const newHistory = [...tabHistory];
        newHistory.pop();
        const prevTab = newHistory[newHistory.length - 1];
        setTabHistory(newHistory);
        setActiveTab(prevTab);
        handled = true;
      }

      if (handled) {
        window.history.pushState({ app: true }, '', window.location.href);
      } else {
        // Root level - Double back to exit (only on navigation panel)
        // Only allow exit if: no active chat, no overlays, at root tab
        const isOnNavigationPanel = !activeChatId && !(window as any).__chatOverlayOpen && tabHistory.length <= 1;

        if (isOnNavigationPanel) {
          if (!doubleBackRef.current) {
            doubleBackRef.current = true;
            window.history.pushState({ app: true }, '', window.location.href);

            setTimeout(() => {
              doubleBackRef.current = false;
            }, 2000);
          } else {
            // Second press within 2s - Force Exit
            // We are currently at the history state *before* the trap (because we just popped)
            // So calling back() once more should exit the app logic entirely
            window.history.back();
          }
        } else {
          // Not on navigation panel - just push state to prevent accidental exit
          window.history.pushState({ app: true }, '', window.location.href);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [
    activeGlobalCall, proVariant, activeFilterTab, matchProfile,
    showSendSpark, showUplift, showVerifyProfile, showProfilePhotos,
    showAppSettings, showHelpCenter,
    showMagazine, showThemes, outOfSparksName, isCreatingChat, isEditingProfile,
    activeChatId, tabHistory
  ]);

  const handleUpdateChatHistory = (id: string, messages: ChatMessage[]) => {
    setChatHistories(prev => ({ ...prev, [id]: messages }));
    // Move this chat to top of connections list (like a new message does)
    setConnections(prev => {
      const connIndex = prev.findIndex(c => c.id === id);
      if (connIndex === -1) return prev;
      // Get the last message to update the connection's preview
      const lastMsg = messages[messages.length - 1];
      let lastMessageText = lastMsg?.text || prev[connIndex].lastMessage;
      if (lastMsg?.isCallLog) {
        // Extract duration from message text (format: "A video/voice call lasted MM:SS")
        const durationMatch = lastMsg.text.match(/(\d{2}:\d{2})/);
        const duration = durationMatch ? ` (${durationMatch[1]})` : '';
        lastMessageText = lastMsg.text.includes('video')
          ? `📹 Video call${duration}`
          : `📞 Voice call${duration}`;
      }
      // New connections (no lastMessage yet) go to general
      const isNewConnection = !prev[connIndex].lastMessage;
      const updatedItem = {
        ...prev[connIndex],
        lastMessage: lastMessageText,
        lastMessageTime: 'Now',
        lastMessageTimestamp: Date.now(),
        isSeen: true,
        unreadCount: 0,
        category: isNewConnection ? 'general' as const : prev[connIndex].category
      };
      const newArr = [...prev];
      newArr.splice(connIndex, 1);
      return [updatedItem, ...newArr];
    });
  };

  const handleSendMessage = (id: string, text: string) => {
    setConnections(prev => {
      const connIndex = prev.findIndex(c => c.id === id);
      if (connIndex === -1) return prev;
      // New connections (no lastMessage) go to general first
      const isNewConnection = !prev[connIndex].lastMessage;
      const updatedItem = {
        ...prev[connIndex],
        lastMessage: text,
        lastMessageTime: 'NOW',
        isSeen: true,
        unreadCount: 0,
        category: isNewConnection ? 'general' as const : prev[connIndex].category
      };
      const newArr = [...prev];
      newArr.splice(connIndex, 1);
      return [updatedItem, ...newArr];
    });
  };

  const handleMoveChat = (connectionId: string, toCategory: 'primary' | 'general') => {
    setConnections(prev => prev.map(c =>
      c.id === connectionId ? { ...c, category: toCategory } : c
    ));
  };

  const handleMarkSeen = (id: string) => {
    setConnections(prev => prev.map(c => c.id === id ? { ...c, isSeen: true, unreadCount: 0 } : c));
  };

  const handleAction = (profile: Profile, type: 'like' | 'dislike') => {
    const alreadyLikedUs = likes.some(lp => lp.id === profile.id);
    if (type === 'like' && alreadyLikedUs) {
      setConnections(prev => {
        if (prev.find(c => c.profile.id === profile.id)) return prev;
        const newConnection: Connection = { id: `match-${profile.id}`, profile: profile, unreadCount: 0, isSeen: false };
        return [newConnection, ...prev];
      });
      setLikes(prev => prev.filter(l => l.id !== profile.id));
      setMatchProfile(profile);
    } else {
      setHiddenProfileIds(prev => [...prev, profile.id]);
    }
  };

  const handleMatchSendMessage = () => {
    if (!matchProfile) return;
    const connectionId = `match-${matchProfile.id}`;
    setActiveChatId(connectionId);
    window.history.pushState({ chatView: true }, '', window.location.href);
    setHiddenProfileIds(prev => [...prev, matchProfile.id]);
    setMatchProfile(null);
    setActiveTab(Tab.Chat);
  };

  const handleMatchMaybeLater = () => {
    if (matchProfile) {
      setHiddenProfileIds(prev => [...prev, matchProfile.id]);
      setMatchProfile(null);
    }
  };

  // Pre-mounted views - all render but only active one is visible
  const renderPreloadedViews = () => (
    <>
      {/* Discover - always mounted */}
      <div
        className={discoverFadeIn ? 'discover-fade-in' : discoverFadeOut ? 'discover-fade-out' : ''}
        style={{ display: activeTab === Tab.Discover ? 'block' : 'none', height: '100%' }}
      >
        <DiscoverView
          profiles={DISCOVER_PROFILES}
          userInterests={myProfile.interests}
          onOpenPro={() => setProVariant('lastSeen')}
          onOpenOutOfSparks={(name) => setOutOfSparksName(name)}
          onOpenFilter={(filter) => setActiveFilterTab(filter)}
          onAction={handleAction}
          hiddenProfileIds={hiddenProfileIds}
          distanceLabel={`${distanceValue} ${distanceUnit}`}
          ageLabel={maxAge === 75 ? `Age ${minAge}+` : `Age ${minAge}-${maxAge}`}
          artistTypeLabel={`${selectedArtistTypes.length} Artist${selectedArtistTypes.length !== 1 ? 's' : ''}`}
          distanceUnit={distanceUnit}
          isInterestsActive={selectedInterests.length > 0}
          isLocationActive={selectedLocation !== 'current'}
          isAgeActive={minAge > 18 || maxAge < 75}
          isProfileHidden={myProfile.isHidden}
          onUnhideProfile={() => setMyProfile(prev => ({ ...prev, isHidden: false }))}
          activeIndex={discoverActiveIndex}
          onActiveIndexChange={setDiscoverActiveIndex}
          isActive={activeTab === Tab.Discover}
        />
      </div>

      {/* Likes - preloaded after 500ms */}
      {preloadedViews.has(Tab.Likes) && (
        <div style={{ display: activeTab === Tab.Likes ? 'block' : 'none' }}>
          <LikesView
            likes={likes}
            onOpenPro={() => setProVariant('likes')}
            onOpenUplift={() => setShowUplift(true)}
          />
        </div>
      )}

      {/* Chat - preloaded after 1000ms */}
      {preloadedViews.has(Tab.Chat) && (
        <div style={{ display: activeTab === Tab.Chat ? 'block' : 'none' }}>
          <ChatView
            connections={connections}
            likesCount={likes.length}
            onSelectChat={(id) => {
              setActiveChatId(id);
              window.history.pushState({ chatView: true }, '', window.location.href);
            }}
            onCreateChat={() => setIsCreatingChat(true)}
            onViewLikes={() => setActiveTab(Tab.Likes)}
            onMoveChat={handleMoveChat}
            activeCallConnectionId={activeGlobalCall ? activeGlobalCall.connectionId : null}
            activeCallType={activeGlobalCall ? activeGlobalCall.type : null}
            chatHistories={chatHistories}
            isActive={activeTab === Tab.Chat}
          />
        </div>
      )}

      {/* Profile - preloaded after 1500ms */}
      {preloadedViews.has(Tab.Profile) && (
        <div style={{ display: activeTab === Tab.Profile ? 'block' : 'none' }}>
          <ProfileView
            profile={myProfile}
            onEdit={() => setIsEditingProfile(true)}
            onOpenPro={() => setProVariant('general')}
            onOpenSparks={() => setShowSendSpark(true)}
            onOpenUplift={() => setShowUplift(true)}
            onOpenVerify={() => setShowVerifyProfile(true)}
            onOpenProfilePhotos={() => setShowProfilePhotos(true)}

            onOpenSearchSettings={() => setActiveFilterTab('Interests')}
            onOpenAppSettings={() => setShowAppSettings(true)}
            onOpenHelpCenter={() => setShowHelpCenter(true)}


            showMagazine={showMagazine}
            setShowMagazine={setShowMagazine}
            showThemes={showThemes}
            setShowThemes={setShowThemes}
          />
        </div>
      )}
    </>
  );

  const activeChat = connections.find(c => c.id === activeChatId);

  if (!hasAcknowledged) {
    return <AcknowledgementView onAcknowledge={() => setHasAcknowledged(true)} />;
  }

  return (
    <ThemeProvider>
      <div
        className="w-full min-h-screen relative shadow-2xl text-[var(--text-primary)] transition-colors duration-300 font-sans select-none overflow-hidden"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        <main className="animate-in fade-in duration-700">
          {renderPreloadedViews()}
        </main>

        {!activeChatId && !matchProfile && (
          <BottomNav
            activeTab={activeTab}
            onTabChange={(tab) => {
              if (tab === activeTab) {
                // Same tab clicked - smooth scroll to top using native CSS
                // Find scrollable elements in the current view
                const scrollableSelectors = [
                  '.profile-card',  // Discover profile cards
                  '.overflow-y-auto',
                  '.overflow-auto'
                ];

                scrollableSelectors.forEach(selector => {
                  const elements = document.querySelectorAll(selector);
                  elements.forEach(el => {
                    if (el instanceof HTMLElement && el.scrollTop > 0) {
                      el.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  });
                });

                // Also scroll window just in case
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                // Different tab - normal behavior
                window.scrollTo({ top: 0 });
                setTabHistory(prev => [...prev, tab]);
                window.history.pushState({ app: true }, '', window.location.href);
                setActiveTab(tab);
              }
            }}
          />
        )}

        {matchProfile && (
          <MatchView profile={matchProfile} onSendMessage={handleMatchSendMessage} onMaybeLater={handleMatchMaybeLater} />
        )}

        {activeChatId && activeChat && (
          <IndividualChatView
            connection={activeChat}
            onBack={() => setActiveChatId(null)}
            onSendMessage={(text) => handleSendMessage(activeChat.id, text)}
            onMarkSeen={() => handleMarkSeen(activeChat.id)}
            chatHistory={chatHistories[activeChat.id] || []}
            onUpdateHistory={(messages) => handleUpdateChatHistory(activeChat.id, messages)}
            onCreateGroupChat={() => {
              setInitialGroupMembers([activeChat.id]);
              setIsCreatingChat(true);
            }}
            onMinimizeCall={(callType, callState) => {
              setActiveGlobalCall({
                type: callType,
                profile: activeChat.profile,
                connectionId: activeChat.id,
                startTime: Date.now() - (callState.duration * 1000),
                isMuted: callState.isMuted,
                isSpeaker: callState.isSpeaker,
                isVideoOff: callState.isVideoOff || false,
                isOnHold: callState.isOnHold || false,
                isCallVisible: false
              });
              // Stay in the chat - don't navigate away
            }}
            onOpenLastSeen={() => setProVariant('lastSeen')}
            activeGlobalCall={activeGlobalCall}
            onUpdateCallState={(updates) => setActiveGlobalCall(prev => prev ? { ...prev, ...updates } : null)}
            onStartCall={(callType) => {
              if (!activeGlobalCall) {
                setActiveGlobalCall({
                  type: callType,
                  profile: activeChat.profile,
                  connectionId: activeChat.id,
                  startTime: Date.now(),
                  isMuted: false,
                  isSpeaker: false,
                  isVideoOff: false,
                  isOnHold: false,
                  isCallVisible: true
                });
              }
            }}
            onEndCall={() => setActiveGlobalCall(null)}
            userImage={myProfile.images[0]}
            distanceUnit={distanceUnit}
          />
        )}

        {isCreatingChat && (
          <CreateChatView
            connections={connections}
            userImage={myProfile.images[0]}
            initialSelectedIds={initialGroupMembers}
            onClose={() => {
              setIsCreatingChat(false);
              setInitialGroupMembers([]);
            }}
            onCreateGroup={(name, members) => {
              const newGroupId = `group-${Date.now()}`;
              const newGroup: Connection = {
                id: newGroupId,
                isGroup: true,
                members: members,
                unreadCount: 0,
                lastMessage: `You created the group "${name}"`,
                lastMessageTime: 'NOW',
                isSeen: true,
                profile: {
                  id: `profile-${newGroupId}`,
                  name: name,
                  age: 0,
                  profileType: 'Group',

                  distance: '',
                  bio: '',
                  images: [myProfile.images[0], ...members.map(m => m.images[0])]
                }
              };
              setConnections([newGroup, ...connections]);
              setIsCreatingChat(false);
              setActiveChatId(newGroupId);
            }}
          />
        )}

        {isEditingProfile && (
          <EditProfileView
            profile={myProfile}
            onBack={() => setIsEditingProfile(false)}
            onOpenPro={(variant) => setProVariant(variant || 'general')}
            onOpenPhotos={() => setShowProfilePhotos(true)}
            onSave={(updated) => setMyProfile(updated)}
          />
        )}

        {proVariant && <ProView variant={proVariant} onClose={() => setProVariant(null)} />}
        {outOfSparksName && <OutOfSparksView profileName={outOfSparksName} onClose={() => setOutOfSparksName(null)} onOpenPro={() => { setOutOfSparksName(null); setProVariant('general'); }} />}
        {showSendSpark && <SendSparkView onClose={() => setShowSendSpark(false)} onOpenPro={() => { setShowSendSpark(false); setProVariant('general'); }} />}
        {showUplift && <UpliftView onClose={() => setShowUplift(false)} />}
        {showVerifyProfile && <VerifyProfileView onBack={() => setShowVerifyProfile(false)} />}
        {showProfilePhotos && <ProfilePhotosView onBack={() => setShowProfilePhotos(false)} onOpenVerify={() => { setShowProfilePhotos(false); setShowVerifyProfile(true); }} profileImage={myProfile.images[0]} />}

        {showAppSettings && <AppSettingsView onBack={() => setShowAppSettings(false)} />}
        {showHelpCenter && <HelpCenterView onBack={() => setShowHelpCenter(false)} />}



        {activeFilterTab && (
          <FilterModal
            initialFilterName={activeFilterTab}
            initialSelectedInterests={selectedInterests}
            initialLocation={selectedLocation}
            initialDistanceValue={distanceValue}
            initialDistanceUnit={distanceUnit}
            initialMinAge={minAge}
            initialMaxAge={maxAge}
            initialSelectedArtistTypes={selectedArtistTypes}
            onClose={() => setActiveFilterTab(null)}
            onOpenPro={(variant) => { setActiveFilterTab(null); setProVariant(variant || 'general'); }}
            onSave={(data) => {
              setSelectedInterests(data.interests);
              setSelectedLocation(data.location);
              setDistanceValue(data.distanceValue);
              setDistanceUnit(data.distanceUnit);
              setMinAge(data.minAge);
              setMaxAge(data.maxAge);
              setSelectedArtistTypes(data.artistTypes);
              setActiveFilterTab(null);
            }}
          />
        )}

        {/* Floating Call Widget - show when call is active but minimized */}
        {activeGlobalCall && !activeGlobalCall.isCallVisible && (
          <FloatingCallWidget
            callType={activeGlobalCall.type}
            profile={activeGlobalCall.profile}
            duration={callDuration}
            isMuted={activeGlobalCall.isMuted}
            isSpeaker={activeGlobalCall.isSpeaker}
            isVideoOff={activeGlobalCall.isVideoOff}
            isOnHold={activeGlobalCall.isOnHold}
            onToggleMute={() => setActiveGlobalCall(prev => prev ? { ...prev, isMuted: !prev.isMuted } : null)}
            onToggleSpeaker={() => setActiveGlobalCall(prev => prev ? { ...prev, isSpeaker: !prev.isSpeaker } : null)}
            onToggleVideo={() => setActiveGlobalCall(prev => prev ? { ...prev, isVideoOff: !prev.isVideoOff } : null)}
            onToggleHold={() => setActiveGlobalCall(prev => prev ? { ...prev, isOnHold: !prev.isOnHold } : null)}
            onEndCall={() => {
              // Log the call in chat history before ending
              if (activeGlobalCall) {
                const duration = callDuration;
                const mins = Math.floor(duration / 60);
                const secs = duration % 60;
                const durationStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
                const callLogMessage: ChatMessage = {
                  id: `call-${Date.now()}`,
                  text: activeGlobalCall.type === 'video'
                    ? `A video call lasted ${durationStr}`
                    : `A voice call lasted ${durationStr}`,
                  sender: 'system',
                  timestamp: Date.now(),
                  isCallLog: true
                };
                const existingHistory = chatHistories[activeGlobalCall.connectionId] || [];
                handleUpdateChatHistory(activeGlobalCall.connectionId, [...existingHistory, callLogMessage]);
              }
              setActiveGlobalCall(null);
            }}
            onExpand={() => {
              // Show full call view and navigate to that chat
              setActiveGlobalCall(prev => prev ? { ...prev, isCallVisible: true } : null);
              setActiveChatId(activeGlobalCall.connectionId);
            }}
          />
        )}

        {/* Boot Splash Overlay - renders on top but fades out to reveal app content */}
        {showSplash && (
          <div
            className={`fixed inset-0 flex items-center justify-center z-[100] overflow-hidden transition-opacity duration-1000 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}
            style={{ backgroundColor: bootStyles.bg, transition: 'background-color 0.3s ease, opacity 1s ease' }}
          >
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              onLoadedMetadata={(e) => { e.currentTarget.currentTime = 0; }}
              onCanPlay={() => setIsBootVideoReady(true)}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${isBootPhase2Ready && isBootVideoReady ? 'opacity-100' : 'opacity-0'}`}
              src="https://videos.pexels.com/video-files/10994873/10994873-sd_360_640_25fps.mp4"
            />
            <div className={`absolute inset-0 bg-black/30 z-10 transition-opacity duration-1000 ${isBootPhase2Ready && isBootVideoReady ? 'opacity-100' : 'opacity-0'}`} />
            <div
              className={`relative z-20 flex flex-col items-center justify-center text-center transition-colors duration-1000 space-y-2 boot-text-glitch ${isBootPhase2Ready && isBootVideoReady ? 'boot-text-glassy' : ''}`}
              style={{
                color: (isBootPhase2Ready && isBootVideoReady && bootStyles.bg === '#ffffff')
                  ? '#ffffff'
                  : (bootStyles.text === '#000000' ? '#1a1a1a' : bootStyles.text),
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
              }}
            >
              <h1 className="text-[2.1rem] font-bold tracking-tight">Yatin Taneja's</h1>
              <h1 className="text-[2.1rem] font-bold tracking-tight">Article Circle</h1>
              <h1 className="text-[2.1rem] font-bold tracking-tight">App Prototype</h1>
            </div>
          </div>
        )}

        {/* Fade animations for Discover section when filter opens/closes */}
        <style>{`
          @keyframes glitch {
            0%, 100% { 
              transform: translate(0);
              opacity: 1;
            }
            10% { 
              transform: translate(-2px, 1px);
              opacity: 0.8;
            }
            20% { 
              transform: translate(2px, -1px);
              opacity: 1;
            }
            30% { 
              transform: translate(-1px, 2px);
              opacity: 0.9;
            }
            40% { 
              transform: translate(1px, -2px);
              opacity: 1;
            }
            50% {
              transform: translate(0);
              opacity: 1;
            }
          }
          
          .boot-text-glitch {
            animation: glitch 0.3s ease-in-out 2;
            animation-delay: 0.5s;
          }

          .boot-text-glassy {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            padding: 2rem 3rem;
            border-radius: 1.5rem;
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 1s ease;
          }

          .boot-text-glassy h1 {
            color: rgba(255, 255, 255, 0.85) !important;
            text-shadow: 
              0 0 20px rgba(255, 255, 255, 0.3),
              0 0 40px rgba(255, 255, 255, 0.2),
              0 2px 4px rgba(0, 0, 0, 0.3);
            -webkit-text-stroke: 0.5px rgba(255, 255, 255, 0.3);
          }
          @keyframes discoverFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .discover-fade-in {
            animation: discoverFadeIn 600ms ease-out forwards;
          }
          @keyframes discoverFadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
          }
          .discover-fade-out {
            animation: discoverFadeOut 400ms ease-out forwards;
          }
        `}</style>
      </div>
    </ThemeProvider>
  );
};

export default App;
