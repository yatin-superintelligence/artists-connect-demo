import React, { useState, useRef, useEffect } from 'react';
import { Connection, ChatMessage, Profile } from '../types';
// Fixed casing of import to match components/Media/LoopPlayer.tsx
import LoopPlayer from '../components/Media/LoopPlayer';
import ProfileDetail from '../components/ProfileDetail';

import VoiceCallView from './call/VoiceCallView';
import VideoCallView from './call/VideoCallView';
import { useTheme } from '../theme/ThemeContext';

// Global call state type
interface GlobalCallState {
  type: 'voice' | 'video';
  profile: Profile;
  connectionId: string;
  startTime: number;
  isMuted: boolean;
  isSpeaker: boolean;
  isVideoOff: boolean;
  isOnHold: boolean;
  isCallVisible: boolean;
}

interface IndividualChatViewProps {
  connection: Connection;
  userDesires?: string[];
  onBack: () => void;
  onSendMessage: (text: string) => void;
  onMarkSeen: () => void;
  chatHistory: ChatMessage[];
  onUpdateHistory: (messages: ChatMessage[]) => void;
  onCreateGroupChat: () => void;
  onMinimizeCall?: (callType: 'voice' | 'video', callState: { duration: number; isMuted: boolean; isSpeaker: boolean; isVideoOff?: boolean; isOnHold?: boolean }) => void;
  activeGlobalCall?: GlobalCallState | null;
  onUpdateCallState?: (updates: Partial<GlobalCallState>) => void;
  onStartCall?: (callType: 'voice' | 'video') => void;
  onEndCall?: () => void;
  onOpenLastSeen?: () => void;

  userImage: string;
  distanceUnit?: 'km' | 'miles';
}

const EMOJI_DATA = {
  'Recent': ['❤️', '😂', '😍', '🔥', '😮', '😢', '🍆', '🍑'],
  'Smileys': ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐', '😕', '😟', '🙁', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖'],
  'People': ['👶', '👧', '🧒', '👦', '👩', '🧑', '👨', '👵', '🧓', '👴', '👲', '👳‍♀️', '👳‍♂️', '🧕', '👮‍♀️', '👮‍♂️', '👷‍♀️', '👷‍♂️', '💂‍♀️', '💂‍♂️', '🕵️‍♀️', '🕵️‍♂️', '👩‍⚕️', '👨‍⚕️', '👩‍🌾', '👨‍🌾', '👩‍🍳', '👨‍🍳', '👩‍🎓', '👨‍🎓', '👩‍🎤', '👨‍🎤', '👩‍🏫', '👨‍🏫', '👩‍🏭', '👨‍🏭', '👩‍💻', '👨‍💻', '👩‍💼', '👨‍💼', '👩‍🔧', '👨‍🔧', '👩‍🔬', '👨‍🔬', '👩‍🎨', '👨‍🎨', '👩‍🚒', '👨‍🚒', '👩‍✈️', '👨‍✈️', '👩‍🚀', '👨‍🚀', '👩‍⚖️', '👨‍⚖️', '👰', '🤵', '👸', '🤴', '🦸‍♀️', '🦸‍♂️', '🦹‍♀️', '🦹‍♂️', '🤶', '🎅', '🧙‍♀️', '🧙‍♂️', '🧝‍♀️', '🧝‍♂️', '🧛‍♀️', '🧛‍♂️', '🧟‍♀️', '🧟‍♂️', '🧞‍♀️', '🧞‍♂️', '🧜‍♀️', '🧜‍♂️', '🧚‍♀️', '🧚‍♂️', '👼', '🤰', '🤱', '🙇‍♀️', '🙇‍♂️', '💁‍♀️', '💁‍♂️', '🙅‍♀️', '🙅‍♂️', '🙆‍♀️', '🙆‍♂️', '🙋‍♀️', '🙋‍♂️', '🤦‍♀️', '🤦‍♂️', '🤷‍♀️', '🤷‍♂️', '🙎‍♀️', '🙎‍♂️', '🙍‍♀️', '🙍‍♂️', '💇‍♀️', '💇‍♂️', '💆‍♀️', '💆‍♂️', '🧖‍♀️', '🧖‍♂️', '💅', '🤳', '💃', '🕺', '👯‍♀️', '👯‍♂️', '🕴', '🚶‍♀️', '🚶‍♂️', '🏃‍♀️', '🏃‍♂️', '👤', '👥', '👫', '👬', '👭', '💑', '👩‍❤️‍👩', '👨‍❤️‍👨', '💏', '👩‍❤️‍💋‍👩', '👨‍❤️‍💋‍👨', '👪', '👨‍👩‍👧', '👨‍👩‍👧‍👦', '👨‍👩‍👦‍👦', '👨‍👩‍👧‍👧', '👩‍👩‍👦', '👩‍👩‍👧', '👩‍👩‍👧‍👦', '👩‍👩‍👦‍👦', '👩‍👩‍👧‍👧', '👨‍👨‍👦', '👨‍👨‍👧', '👨‍👨‍👧‍👦', '👨‍👨‍👦‍👦', '👨‍👨‍👧‍👧', '👩‍👦', '👩‍👧', '👩‍👧‍👦', '👩‍👦‍👦', '👩‍👧‍👧', '👨‍👦', '👨‍👧', '👨‍👧‍👦', '👨‍👦‍👦', '👨‍👧‍👧', '👚', '👕', '👖', '👔', '👗', '👙', '👘', '👠', '👡', '👢', '👞', '👟', '🥾', '🥿', '🧦', '🧤', '🧣', '🎩', '🧢', '👒', '🎓', '⛑', '👑', '👝', '👛', '👜', '💼', '🎒', '👓', '🕶', '🥽', '🥼', '🌂', '🧵', '🧶'],
  'Nature': ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷', '🕸', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🦮', '🐕‍🦺', '🐈', '🐓', '🦃', '🦚', '🦜', '🦢', '🦩', '🕊', '🐇', '🦝', '🦨', '🦡', '🦦', '🦥', '🐁', '🐀', '🐿', '🦔', '🐾', '🐉', '🐲', '🌵', '🎄', '🌲', '🌳', '🌴', '🌱', '🌿', '☘️', '🍀', '🎍', '🎋', '🍃', '🍂', '🍁', '🍄', '🐚', '🌾', '💐', '🌷', '🌹', '🥀', '🌺', '🌸', '🌼', '🌻', '🌞', '🌝', '🌛', '🌜', '🌚', '🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔', '🌙', '🌎', '🌍', '🌏', '🪐', '💫', '⭐️', '🌟', '✨', '⚡️', '☄️', '💥', '🔥', '🌪', '🌈', '☀️', '🌤', '⛅️', '🌥', '☁️', '🌦', '🌧', '⛈', '🌩', '🌨', '❄️', '☃️', '⛄️', '🌬', '💨', '💧', '💦', '☔️', '☂️', '🌊', '🌫'],
  'Food': ['🍇', '🍈', '🍉', '🍊', '🍋', '🍌', '🍍', '🥭', '🍎', '🍏', '🍐', '🍑', '🍒', '🍓', '🥝', '🍅', '🥥', '🥑', '🍆', '🥔', '🥕', '🌽', '🌶', '🥒', '🥬', '🥦', '🧄', '🧅', '🍄', '🥜', '🌰', '🍞', '🥐', '🥖', '🥨', '🥯', '🥞', '🧇', '🧀', '🍖', '🍗', '🥩', '🥓', '🍔', '🍟', '🍕', '🌭', '🥪', '🌮', '🌯', '🥙', '🧆', '🥚', '🍳', '🥘', '🍲', '🥣', '🥗', '🍿', '🧈', '🧂', '🥫', '🍱', '🍘', '🍙', '🍚', '🍛', '🍜', '🍝', '🍠', '🍢', '🍣', '🍤', '🍥', '🥮', '🍡', '🥟', '🥠', '🥡', '🍦', '🍧', '🍨', '🍩', '🍪', '🎂', '🍰', '🧁', '🥧', '🍫', '🍬', '🍭', '🍮', '🍯', '🍼', '🥛', '☕', '🍵', '🍶', '🍾', '🍷', '🍸', '🍹', '🍺', '🍻', '🥂', '🥃', '🥤', '🧃', '🧉', '🧊', '🥢', '🍽', '🍴', '🥄'],
  'Objects': ['💘', '💝', '💖', '💗', '💓', '💞', '💕', '💟', '❣️', '💔', '❤️', '🧡', '💛', '💚', '💙', '💜', '🤎', '🖤', '🤍', '💯', '💢', '💥', '💫', '💦', '💨', '🕳', '💣', '💬', '👁️‍🗨️', '🗨', '🗯', '💭', '💤', '👋', '🤚', 'Bk', '🖐', '✋', '🖖', '👌', '🤏', '✌', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🦷', '🦴', '👀', '👁', '👅', '👄'],
};

const EMOJI_CATEGORIES = Object.keys(EMOJI_DATA);

const EMOJI_SET = ['❤️', '😂', '😍', '🔥', '😮', '😢', '🍆', '🍑', '👍', '👏', '💋', '🥵', '😈', '💦', '😏', '🙈', '💯', '✨', '🤤', '😘'];

const IndividualChatView: React.FC<IndividualChatViewProps> = ({
  connection,
  userDesires = [],
  onBack,
  onSendMessage,
  onMarkSeen,
  chatHistory,
  onUpdateHistory,
  onCreateGroupChat,
  onMinimizeCall,
  activeGlobalCall,
  onUpdateCallState,
  onStartCall,
  onEndCall,
  onOpenLastSeen,

  distanceUnit = 'km',
  userImage
}) => {
  const { currentTheme } = useTheme();
  const isLightTheme = currentTheme.name === 'Classic Artist Circle Light';
  const isColoredTheme = ['That Orange', 'Hot Pink', 'More Brown'].includes(currentTheme.name);
  const [message, setMessage] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [messageToDelete, setMessageToDelete] = useState<ChatMessage | null>(null);
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [reactionMenuId, setReactionMenuId] = useState<string | null>(null);
  const [usedReactions, setUsedReactions] = useState<string[]>([]);
  const [viewingMedia, setViewingMedia] = useState<string | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Profile | null>(null);
  const [isMuted, setIsMuted] = useState(false);


  const [isEditingGroup, setIsEditingGroup] = useState(false);
  const [groupBio, setGroupBio] = useState(connection.profile.bio);
  const [groupInterests, setGroupInterests] = useState(connection.profile.interests || []);
  const [interestInput, setInterestInput] = useState('');

  const [editingPart, setEditingPart] = useState<'none' | 'bio' | 'desires' | 'interests'>('none');
  const [showOptions, setShowOptions] = useState(false);
  const [showCallOptions, setShowCallOptions] = useState(false);
  const [showMediaMenu, setShowMediaMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [emojiCategory, setEmojiCategory] = useState('Recent');
  const [recentEmojis, setRecentEmojis] = useState<string[]>(EMOJI_DATA['Recent']);
  const [isExiting, setIsExiting] = useState(false);

  const handleBack = () => {
    setIsExiting(true);
    setTimeout(() => {
      onBack();
    }, 200);
  };


  // Sync state with connection prop changes to handle updates
  useEffect(() => {
    setGroupBio(connection.profile.bio);
    setGroupInterests(connection.profile.interests || []);
  }, [connection.profile]);

  // Check if this connection has an active call
  const isCallActive = activeGlobalCall && activeGlobalCall.connectionId === connection.id && activeGlobalCall.isCallVisible;
  const activeCallType = isCallActive ? activeGlobalCall.type : null;

  // Calculate call duration from global state
  const callDuration = activeGlobalCall ? Math.floor((Date.now() - activeGlobalCall.startTime) / 1000) : 0;

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const profileScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onMarkSeen();
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  useEffect(() => {
    if (selectedMember && profileScrollRef.current) {
      profileScrollRef.current.scrollTop = 0;
    }
  }, [selectedMember]);

  // Handle back button for internal overlays (profile, options, media viewer, member profile, input popups)
  // Set global flag so App.tsx knows not to close chat
  useEffect(() => {
    const hasOverlay = showProfile || showOptions || viewingMedia || selectedMember || showMediaMenu || showEmojiPicker;
    (window as any).__chatOverlayOpen = hasOverlay;

    return () => {
      // Clean up when component unmounts
      (window as any).__chatOverlayOpen = false;
    };
  }, [showProfile, showOptions, viewingMedia, selectedMember, showMediaMenu, showEmojiPicker]);

  useEffect(() => {
    const handlePopState = () => {
      // Check if another handler already handled this event
      if ((window as any).__backHandled) return;

      // Handle back button for input popups (media menu, emoji picker)
      if (showMediaMenu) {
        (window as any).__backHandled = true;
        setShowMediaMenu(false);
        setTimeout(() => (window as any).__backHandled = false, 50);
        return;
      }
      if (showEmojiPicker) {
        (window as any).__backHandled = true;
        setShowEmojiPicker(false);
        setTimeout(() => (window as any).__backHandled = false, 50);
        return;
      }

      // Handle back button for internal overlays - same as clicking UI back arrow
      if (viewingMedia) {
        (window as any).__backHandled = true;
        setViewingMedia(null);
        setTimeout(() => (window as any).__backHandled = false, 50);
        return;
      }
      if (selectedMember) {
        (window as any).__backHandled = true;
        setSelectedMember(null);
        setTimeout(() => (window as any).__backHandled = false, 50);
        return;
      }
      if (showProfile) {
        (window as any).__backHandled = true;
        setShowProfile(false);
        setIsEditingGroup(false);
        setEditingPart('none');
        setTimeout(() => (window as any).__backHandled = false, 50);
        return;
      }
      if (showOptions) {
        (window as any).__backHandled = true;
        setShowOptions(false);
        setTimeout(() => (window as any).__backHandled = false, 50);
        return;
      }
      // If no overlays, let parent close chat (App.tsx will call onBack)
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [showProfile, showOptions, selectedMember, viewingMedia, showMediaMenu, showEmojiPicker]);


  const reversedHistory = [...chatHistory].reverse();

  const closeMenus = () => {
    setSelectedMessageId(null);
    setReactionMenuId(null);
    setShowCallOptions(false);
    setShowEmojiPicker(false);
    setShowMediaMenu(false);
  };

  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')} `;
  };

  const handleEndCall = (duration: number, callType: 'voice' | 'video') => {
    // Add call log message to chat
    const callLogMessage: ChatMessage = {
      id: `call - ${Date.now()} `,
      text: callType === 'video'
        ? `A video call lasted ${formatCallDuration(duration)} `
        : `A voice call lasted ${formatCallDuration(duration)} `,
      sender: 'system',
      timestamp: Date.now(),
      isCallLog: true
    };
    onUpdateHistory([...chatHistory, callLogMessage]);
    if (onEndCall) onEndCall();
  };

  const handleSend = () => {
    if (!message.trim()) return;

    // Close any open menus
    closeMenus();

    if (editingMessageId) {
      const updatedHistory = chatHistory.map(msg => {
        if (msg.id === editingMessageId) {
          return { ...msg, text: message, isEdited: true };
        }
        return msg;
      });
      onUpdateHistory(updatedHistory);
      setEditingMessageId(null);
    } else {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        text: message,
        sender: 'me',
        timestamp: Date.now(),
        replyTo: replyingTo || undefined
      };
      onUpdateHistory([...chatHistory, newMessage]);
      onSendMessage(message);
      setReplyingTo(null);
    }
    setMessage('');
  };

  const markAsDeleted = (id: string) => {
    const updatedHistory = chatHistory.map(msg =>
      msg.id === id ? { ...msg, isDeleted: true, text: 'This message was deleted', reactions: [] } : msg
    );
    onUpdateHistory(updatedHistory);
    setSelectedMessageId(null);
    setMessageToDelete(null);
  };

  const handleAddReaction = (msgId: string, emoji: string) => {
    const updatedHistory = chatHistory.map(msg => {
      if (msg.id === msgId) {
        const reactions = msg.reactions || [];
        return {
          ...msg,
          reactions: reactions.includes(emoji) ? reactions.filter(r => r !== emoji) : [...reactions, emoji]
        };
      }
      return msg;
    });
    onUpdateHistory(updatedHistory);
    // Track this emoji as recently used (move to front)
    setUsedReactions(prev => {
      const filtered = prev.filter(e => e !== emoji);
      return [emoji, ...filtered];
    });
    setReactionMenuId(null);
  };

  const getMemberDisplayNames = () => {
    const names = connection.members?.map(m => m.name) || [];
    if (connection.isGroup) {
      const lowercaseNames = names.map(n => n.toLowerCase());
      if (!lowercaseNames.includes('roxanne')) {
        names.push('Roxanne');
      }
    }
    return names.join(', ').toUpperCase();
  };

  const memberNames = getMemberDisplayNames();

  const renderGroupHeaderDP = () => {
    const imgs = connection.profile.images;
    if (imgs.length <= 1) return <img src={imgs[0] || ''} className="w-10 h-10 rounded-xl object-cover" alt="" />;
    const count = imgs.length;
    const cols = count <= 4 ? 2 : count <= 9 ? 3 : 4;
    return (
      <div
        className="w-10 h-10 rounded-xl overflow-hidden grid gap-[0.5px] bg-white/10"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {imgs.map((img, i) => (
          <div key={i} className={`relative bg - black / 10 ${count === 3 && i === 2 ? 'col-span-2' : ''} `}>
            <img src={img} className="absolute inset-0 w-full h-full object-cover" />
          </div>
        ))}
      </div>
    );
  };

  const renderEmptyState = () => (
    <div className="flex-1 flex flex-col items-center pt-20 pb-4">
      <div
        onClick={() => setShowProfile(true)}
        className="w-[180px] h-[180px] rounded-[32px] overflow-hidden border-2 border-[var(--border-color)] mb-8 shadow-2xl cursor-pointer active:scale-95 transition-transform"
      >
        {connection.isGroup ? (
          <div
            className="w-full h-full grid gap-0.5 bg-[var(--bg-tertiary)] overflow-hidden"
            style={{
              gridTemplateColumns: `repeat(${connection.profile.images.length <= 4 ? 2 : connection.profile.images.length <= 9 ? 3 : 4}, minmax(0, 1fr))`
            }}
          >
            {connection.profile.images.map((img, i) => (
              <div key={i} className={`relative bg - black / 10 ${connection.profile.images.length === 3 && i === 2 ? 'col-span-2' : ''} `}>
                <img src={img} className="absolute inset-0 w-full h-full object-cover" />
              </div>
            ))}
          </div>
        ) : (
          <img src={connection.profile.images[0]} className="w-full h-full object-cover" alt="" />
        )}
      </div>
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-[32px] font-bold tracking-tight text-[var(--text-primary)]">{connection.profile.name}</h2>
        {connection.profile.isPro && (
          <div className="w-6 h-6 bg-[#4c1d95] rounded-full flex items-center justify-center text-[11px] text-white font-black shadow-sm border border-[var(--border-color)]">P</div>
        )}
      </div>
      <div className="flex items-center gap-2 text-[var(--text-secondary)] text-[15px] font-bold mb-auto">
        {connection.profile.age > 0 && (
          <>
            <span>{connection.profile.age}</span>
            <span className="opacity-30">•</span>
          </>
        )}
        <span>{connection.profile.artistTypes?.[0] || 'Artist'}</span>

      </div>
      <div className="mt-auto pb-10 flex justify-center px-4">
        <p className="text-white/40 text-[15px] font-medium text-center max-w-[280px] leading-tight">
          Here's where it all begins. Who will break the ice?
        </p>
      </div>
    </div>
  );

  const processInterestInput = (val: string) => {
    if (val.endsWith(',')) {
      const tag = val.slice(0, -1).trim();
      if (tag && !groupInterests.includes(tag)) {
        setGroupInterests([...groupInterests, tag]);
      }
      setInterestInput('');
      return true;
    }
    return false;
  };

  const handleInterestInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = interestInput.trim();
      if (val && !groupInterests.includes(val)) {
        setGroupInterests([...groupInterests, val]);
      }
      setInterestInput('');
    }
  };



  if (!connection) return null;

  // Render full screen media viewer
  if (viewingMedia) {
    return (
      <div
        className="fixed inset-0 bg-black z-[200] flex items-center justify-center animate-in fade-in duration-200"
        onClick={() => setViewingMedia(null)}
      >
        <div className="absolute top-4 right-4 z-20">
          <button onClick={() => setViewingMedia(null)} className="p-2 bg-black/50 rounded-full text-white/80 hover:text-white backdrop-blur-sm">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <img
          src={viewingMedia}
          alt="Media"
          className="max-w-full max-h-full object-contain"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    );
  }

  return (
    <>
      <style>{`
  @keyframes chatEnter {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
  }
  @keyframes chatExit {
          from { opacity: 1; transform: scale(1); }
          to { opacity: 0; transform: scale(0.96); }
  }
  `}</style>
      <div
        className="fixed inset-0 bg-[var(--bg-primary)] z-[70] flex flex-col overflow-hidden"
        style={{
          animation: isExiting
            ? 'chatExit 0.2s cubic-bezier(0.32, 0, 0.67, 0) forwards'
            : 'chatEnter 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}
        onClick={closeMenus}
      >
        <header className="flex items-center gap-4 p-4 border-b border-[var(--border-color)] bg-[var(--bg-primary)]/80 backdrop-blur-md sticky top-0 z-[100]">
          <button onClick={(e) => { e.stopPropagation(); handleBack(); }} className="p-1 -ml-1 hover:bg-[var(--bg-tertiary)] rounded-xl transition-colors text-[var(--text-primary)]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div
            onClick={(e) => { e.stopPropagation(); closeMenus(); setShowProfile(true); }}
            className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer active:opacity-70 transition-opacity"
          >
            {connection.isGroup ? renderGroupHeaderDP() : <img src={connection.profile.images[0]} className="w-10 h-10 rounded-xl object-cover" alt="" />}
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 min-w-0">
                <h2 className="font-bold text-lg truncate text-[var(--text-primary)]">{connection.profile.name}</h2>
                {connection.profile.isPro && (
                  <div className="w-[16px] h-[16px] bg-[#4c1d95] rounded-full flex items-center justify-center text-[9px] text-white font-black shadow-sm border border-[var(--border-color)] flex-shrink-0">P</div>
                )}
              </div>
              {connection.isGroup ? (
                <p className="text-[10px] text-[var(--text-secondary)] font-bold truncate tracking-tight uppercase tracking-widest">{memberNames}</p>
              ) : (
                <p className="text-[10px] text-[var(--text-secondary)] font-bold truncate tracking-widest uppercase">View profile</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {/* Call Button with Floating Options */}
            <div className="flex items-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const willShow = !showCallOptions;
                  closeMenus();
                  if (willShow) setShowCallOptions(true);
                }}
                className={`p - 2 transition - colors ${showCallOptions ? (isColoredTheme ? 'text-[var(--accent-primary)]' : 'text-[#c084fc]') : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'} `}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
                </svg>
              </button>
              {/* Floating Call Options - Fixed Position */}
              {showCallOptions && (
                <div
                  className="fixed top-[74px] right-4 z-[9999] animate-in fade-in zoom-in-95 duration-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className={`${isLightTheme ? 'bg-white/95' : isColoredTheme ? 'bg-[var(--bg-secondary)]' : 'bg-[#1a0b2e]'} backdrop-blur-xl border border-[var(--border-color)] rounded-2xl p-3 shadow-2xl flex flex-row gap-3`}>
                    <button
                      onClick={() => {
                        if (onStartCall && !activeGlobalCall) {
                          onStartCall('voice');
                        }
                        setShowCallOptions(false);
                      }}
                      disabled={!!activeGlobalCall}
                      className={`flex flex-col items-center justify-center w-32 h-32 rounded-2xl ${isLightTheme ? 'bg-gray-100 border-gray-200 hover:bg-gray-200' : isColoredTheme ? 'bg-black/30 border-white/10 hover:bg-black/40' : 'bg-black/60 border-white/10 hover:bg-black/70'} active:scale-95 transition-all group border ${activeGlobalCall ? 'opacity-50 cursor-not-allowed' : 'hover:border-green-500/30 hover:shadow-[0_0_20px_-5px_rgba(34,197,94,0.3)]'}`}
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500/20 to-green-500/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6 text-white drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
                        </svg>
                      </div>
                      <div className="text-center">
                        <p className="text-[var(--text-primary)] font-bold text-sm mb-0.5">Voice Call</p>
                        <p className="text-[var(--text-secondary)] text-[10px] uppercase tracking-wider font-medium">{activeGlobalCall ? 'Active' : 'Private Audio'}</p>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        if (onStartCall && !activeGlobalCall) {
                          onStartCall('video');
                        }
                        setShowCallOptions(false);
                      }}
                      disabled={!!activeGlobalCall}
                      className={`flex flex-col items-center justify-center w-32 h-32 rounded-2xl ${isLightTheme ? 'bg-gray-100 border-gray-200 hover:bg-gray-200' : isColoredTheme ? 'bg-black/30 border-white/10 hover:bg-black/40' : 'bg-black/60 border-white/10 hover:bg-black/70'} active:scale-95 transition-all group border ${activeGlobalCall ? 'opacity-50 cursor-not-allowed' : 'hover:border-[#4c1d95]/30 hover:shadow-[0_0_20px_-5px_rgba(76,29,149,0.3)]'}`}
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4c1d95]/20 to-[#4c1d95]/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6 text-white drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                        </svg>
                      </div>
                      <div className="text-center">
                        <p className="text-[var(--text-primary)] font-bold text-sm mb-0.5">Video Call</p>
                        <p className="text-[var(--text-secondary)] text-[10px] uppercase tracking-wider font-medium">{activeGlobalCall ? 'Active' : 'Face to Face'}</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
            <button onClick={() => {
              closeMenus();
              if (connection.isGroup) {
                setShowProfile(true);
              } else {
                setShowOptions(true);
              }
            }} className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </button>
          </div>
        </header>

        <div
          ref={scrollContainerRef}
          onScroll={() => { if (reactionMenuId || selectedMessageId) closeMenus(); }}
          className="flex-1 overflow-y-auto p-3 gap-[11px] no-scrollbar flex flex-col-reverse w-full"
        >
          {chatHistory.length === 0 ? renderEmptyState() : (
            <>
              {/* Active call indicator - shown when call is minimized for this connection */}
              {activeGlobalCall && activeGlobalCall.connectionId === connection.id && !activeGlobalCall.isCallVisible && (
                <div className="flex justify-center mt-2 mb-6 pt-2">
                  <div className="bg-green-500/20 border border-green-500/40 rounded-full px-4 py-2.5 flex items-center gap-2 animate-pulse">
                    {activeGlobalCall.type === 'video' ? (
                      <span className="text-lg">📹</span>
                    ) : (
                      <span className="text-lg">📞</span>
                    )}
                    <span className="text-green-400 text-sm font-bold">
                      {activeGlobalCall.type === 'video' ? 'Video Call' : 'Voice Call'} in progress
                    </span>
                  </div>
                </div>
              )}
              {reversedHistory.map((msg) => {
                // Compute ordered emoji set: used reactions first, then remaining
                const orderedEmojiSet = [
                  ...usedReactions.filter(e => EMOJI_SET.includes(e)),
                  ...EMOJI_SET.filter(e => !usedReactions.includes(e))
                ];
                return (
                  <MessageItem
                    key={msg.id}
                    msg={msg}
                    connection={connection}
                    onSelect={() => setSelectedMessageId(msg.id === selectedMessageId ? null : msg.id)}
                    onLongPress={() => setReactionMenuId(prev => prev === msg.id ? null : msg.id)}
                    onReply={() => setReplyingTo(msg)}
                    isMenuOpen={selectedMessageId === msg.id}
                    isReactionMenuOpen={reactionMenuId === msg.id}
                    anyMenuOpen={!!(reactionMenuId || selectedMessageId)}
                    currentReactionMenuId={reactionMenuId}
                    currentSelectedId={selectedMessageId}
                    closeMenus={closeMenus}
                    onStartEdit={() => {
                      setEditingMessageId(msg.id);
                      setMessage(msg.text);
                      setSelectedMessageId(null);
                    }}
                    onDelete={() => setMessageToDelete(msg)}
                    onAddReaction={(emoji) => handleAddReaction(msg.id, emoji)}
                    onOpenMedia={(url) => setViewingMedia(url)}
                    isLightTheme={isLightTheme}
                    orderedEmojiSet={orderedEmojiSet}
                  />);
              })}
            </>
          )}
        </div>

        <div className="bg-[var(--bg-primary)] border-t border-[var(--border-color)] relative z-50">
          {replyingTo && (
            <div className="px-3 py-2 bg-[var(--bg-secondary)]/95 backdrop-blur-2xl border-b border-[var(--border-color)] flex items-center justify-between">
              <div className="border-l-4 border-[#4c1d95] pl-3 min-w-0">
                <p className="text-[9px] font-black uppercase tracking-widest text-[#c084fc] mb-0.5">
                  Replying to {replyingTo.sender === 'me' ? 'myself' : replyingTo.author || connection.profile.name}
                </p>
                <p className="text-[13px] text-[var(--text-secondary)] truncate">"{replyingTo.text}"</p>
              </div>
              <button onClick={() => setReplyingTo(null)} className="p-2 text-[var(--text-secondary)]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div
              className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)] shadow-2xl animate-in slide-in-from-bottom duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex gap-2 overflow-x-scroll no-scrollbar p-2 bg-black/20 border-b border-[var(--border-color)]">
                {EMOJI_CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setEmojiCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wide whitespace-nowrap transition-all ${emojiCategory === cat
                      ? `${currentTheme.name === 'That Orange' ? 'bg-orange-600' : currentTheme.name === 'Hot Pink' ? 'bg-pink-600' : currentTheme.name === 'More Brown' ? 'bg-amber-700' : 'bg-indigo-600'} text-white shadow-lg`
                      : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-primary)]'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              {/* Swipeable emoji content carousel */}
              <div
                className="relative overflow-hidden h-64"
                onTouchStart={(e) => {
                  const el = e.currentTarget as any;
                  if (el.__swipeLock) return;
                  const touch = e.touches[0];
                  el.__startX = touch.clientX;
                  el.__startY = touch.clientY;
                }}
                onTouchEnd={(e) => {
                  const el = e.currentTarget as any;
                  if (el.__swipeLock) return;
                  const startX = el.__startX;
                  const startY = el.__startY;
                  if (startX === undefined) return;
                  const touch = e.changedTouches[0];
                  const deltaX = touch.clientX - startX;
                  const deltaY = touch.clientY - startY;

                  // Only trigger if horizontal swipe is dominant
                  if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 30) {
                    const currentIndex = EMOJI_CATEGORIES.indexOf(emojiCategory);
                    let changed = false;
                    if (deltaX < 0 && currentIndex < EMOJI_CATEGORIES.length - 1) {
                      setEmojiCategory(EMOJI_CATEGORIES[currentIndex + 1]);
                      changed = true;
                    } else if (deltaX > 0 && currentIndex > 0) {
                      setEmojiCategory(EMOJI_CATEGORIES[currentIndex - 1]);
                      changed = true;
                    }
                    if (changed) {
                      el.__swipeLock = true;
                      setTimeout(() => { el.__swipeLock = false; }, 200);
                    }
                  }
                }}
                onWheel={(e) => {
                  const el = e.currentTarget as any;
                  if (el.__swipeLock) return;
                  // Touchpad horizontal scroll
                  if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 20) {
                    e.preventDefault();
                    const currentIndex = EMOJI_CATEGORIES.indexOf(emojiCategory);
                    let changed = false;
                    if (e.deltaX > 0 && currentIndex < EMOJI_CATEGORIES.length - 1) {
                      setEmojiCategory(EMOJI_CATEGORIES[currentIndex + 1]);
                      changed = true;
                    } else if (e.deltaX < 0 && currentIndex > 0) {
                      setEmojiCategory(EMOJI_CATEGORIES[currentIndex - 1]);
                      changed = true;
                    }
                    if (changed) {
                      el.__swipeLock = true;
                      setTimeout(() => { el.__swipeLock = false; }, 400);
                    }
                  }
                }}
              >
                <div
                  className="flex transition-transform duration-200 ease-out h-full"
                  style={{ transform: `translateX(-${EMOJI_CATEGORIES.indexOf(emojiCategory) * 100}%)` }}
                >
                  {EMOJI_CATEGORIES.map(cat => (
                    <div key={cat} className="min-w-full h-full overflow-y-auto p-2 no-scrollbar">
                      <div className="grid grid-cols-8 gap-1 content-start">
                        {(cat === 'Recent' ? recentEmojis : (EMOJI_DATA as any)[cat]).map((emoji: string, i: number) => (
                          <button
                            key={i}
                            onClick={() => {
                              setMessage(prev => prev + emoji);
                              if (!recentEmojis.includes(emoji)) {
                                setRecentEmojis(prev => [...prev, emoji]);
                              }
                            }}
                            className="aspect-square flex items-center justify-center text-2xl hover:bg-[var(--bg-tertiary)] rounded-lg active:scale-90 transition-transform"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="px-2 py-2 flex items-center gap-2 w-full relative" onClick={(e) => e.stopPropagation()}>
            {/* Media Menu */}
            {showMediaMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMediaMenu(false)} />
                <div className="absolute bottom-16 left-4 z-50 bg-[var(--bg-secondary)]/95 backdrop-blur-xl border border-[var(--border-color)] rounded-2xl p-2 shadow-2xl flex flex-col gap-1 min-w-[200px] animate-in slide-in-from-bottom-2 zoom-in-95 duration-200">
                  <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[var(--bg-tertiary)] active:bg-[var(--bg-primary)] transition-colors text-left group">
                    <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center group-hover:bg-pink-500/30 transition-colors">
                      <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className={`${isLightTheme ? 'text-black' : 'text-white'} font - bold text - sm`}>Take Photo</p>
                      <p className={`${isLightTheme ? 'text-black/60' : 'text-white/40'} text - xs`}>Share a moment</p>
                    </div>
                  </button>
                  <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 active:bg-white/15 transition-colors text-left group">
                    <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center group-hover:bg-red-500/30 transition-colors">
                      <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className={`${isLightTheme ? 'text-black' : 'text-white'} font - bold text - sm`}>Record Video</p>
                      <p className={`${isLightTheme ? 'text-black/60' : 'text-white/40'} text - xs`}>Capture moment</p>
                    </div>
                  </button>
                  <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 active:bg-white/15 transition-colors text-left group">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                      <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className={`${isLightTheme ? 'text-black' : 'text-white'} font - bold text - sm`}>Gallery</p>
                      <p className={`${isLightTheme ? 'text-black/60' : 'text-white/40'} text - xs`}>Send photos/videos</p>
                    </div>
                  </button>
                  <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 active:bg-white/15 transition-colors text-left group">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className={`${isLightTheme ? 'text-black' : 'text-white'} font - bold text - sm`}>Location</p>
                      <p className={`${isLightTheme ? 'text-black/60' : 'text-white/40'} text - xs`}>Share current spot</p>
                    </div>
                  </button>
                  <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 active:bg-white/15 transition-colors text-left group">
                    <div className="w-10 h-10 rounded-full bg-[#4c1d95]/20 flex items-center justify-center group-hover:bg-[#4c1d95]/30 transition-colors">
                      <svg className="w-5 h-5 text-[#c084fc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    </div>
                    <div>
                      <p className={`${isLightTheme ? 'text-black' : 'text-white'} font - bold text - sm`}>Send Voice Note</p>
                      <p className={`${isLightTheme ? 'text-black/60' : 'text-white/40'} text - xs`}>Send voice message</p>
                    </div>
                  </button>
                </div>
              </>
            )}

            <div className="flex-1 flex items-center gap-2 bg-[var(--bg-tertiary)] rounded-[24px] p-1.5 pl-2 transition-colors focus-within:bg-[var(--bg-secondary)]">
              <button
                onClick={() => {
                  setReactionMenuId(null);
                  setSelectedMessageId(null);
                  setShowMediaMenu(!showMediaMenu);
                  setShowEmojiPicker(false);
                }}
                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${showMediaMenu ? 'bg-indigo-500 text-white rotate-45' : 'bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-primary)]'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <button
                onClick={() => {
                  setReactionMenuId(null);
                  setSelectedMessageId(null);
                  setShowEmojiPicker(!showEmojiPicker);
                  setShowMediaMenu(false);
                }}
                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all text-xl pb-0.5 ${showEmojiPicker ? 'bg-[var(--bg-secondary)] grayscale-0' : 'hover:bg-[var(--bg-secondary)] grayscale opacity-70 hover:opacity-100 hover:grayscale-0'}`}
              >
                🤍
              </button>
              <input
                type="text"
                value={message}
                onClick={() => {
                  closeMenus();
                }}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (reactionMenuId || selectedMessageId) closeMenus();
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Send a message..."
                className="flex-1 bg-transparent border-none outline-none py-2 text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] self-center"
              />
              {message.trim() ? (
                <button
                  onClick={handleSend}
                  className="w-9 h-9 bg-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg transition-transform active:scale-90"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </button>
              ) : (
                <div className="w-2" />
              )}
            </div>
          </div>
        </div>

        {showProfile && (
          <div className="fixed inset-0 z-[100] bg-[var(--bg-primary)] animate-in slide-in-from-bottom duration-300 overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <header className="flex items-center justify-between p-4 bg-[var(--bg-primary)]/80 backdrop-blur-md sticky top-0 z-20">
              <button
                onClick={() => {
                  if (selectedMember) {
                    setSelectedMember(null);
                  } else {
                    setShowProfile(false);
                    setIsEditingGroup(false);
                    setEditingPart('none');
                  }
                }}
                className="p-1 -ml-1 hover:bg-[var(--bg-tertiary)] rounded-xl transition-colors text-[var(--text-primary)]"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="text-lg font-bold text-[var(--text-primary)]">{selectedMember ? 'Profile' : (connection.isGroup ? 'Group profile' : 'Profile')}</h2>
              <div className="w-12">
                {connection.isGroup && !selectedMember && (
                  <button
                    onClick={() => { setIsEditingGroup(!isEditingGroup); if (isEditingGroup) setEditingPart('none'); }}
                    className="text-indigo-400 font-bold text-sm"
                  >
                    {isEditingGroup ? 'Done' : 'Edit'}
                  </button>
                )}
              </div>
            </header>
            <div ref={profileScrollRef} className="flex-1 overflow-y-auto no-scrollbar pb-32 overscroll-contain">
              <ProfileDetail
                profile={selectedMember || {
                  ...connection.profile,
                  bio: groupBio,
                  interests: groupInterests
                }}
                userDesires={userDesires}
                onEditBio={isEditingGroup ? () => setEditingPart('bio') : undefined}
                onEditArtForms={undefined}
                onEditInterests={isEditingGroup ? () => setEditingPart('interests') : undefined}
                isOwnProfile={false}
                hideBlockActions={false}
                onAddImage={isEditingGroup ? () => { } : undefined}
                onOpenLastSeen={onOpenLastSeen}
                distanceUnit={distanceUnit}
              />

              {connection.isGroup && !selectedMember && (
                <div className="pl-4 pr-3.5 mt-8 space-y-10">
                  {isEditingGroup && editingPart !== 'none' && (
                    <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md flex items-center justify-center p-6" onClick={() => setEditingPart('none')}>
                      <div className="bg-[#140c26] w-full max-sm rounded-[32px] p-6 space-y-6 border border-white/10 shadow-2xl" onClick={e => e.stopPropagation()}>
                        {editingPart === 'bio' && (
                          <div className="animate-in fade-in zoom-in-95 duration-200">
                            <label className="text-[13px] font-black uppercase text-white/30 mb-3 block tracking-widest">Edit Bio</label>
                            <textarea
                              autoFocus
                              value={groupBio}
                              onChange={(e) => setGroupBio(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-indigo-500/50 min-h-[140px]"
                              placeholder="Describe this group..."
                            />
                          </div>
                        )}
                        {editingPart === 'interests' && (
                          <div className="animate-in fade-in zoom-in-95 duration-200">
                            <label className="text-[13px] font-black uppercase text-white/30 mb-3 block tracking-widest">Edit Interests</label>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {groupInterests.map(interest => (
                                <span key={interest} className="px-3 py-1.5 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-xs font-bold flex items-center gap-1.5">
                                  {interest}
                                  <button onClick={() => setGroupInterests(groupInterests.filter(i => i !== interest))} className="text-white/40">×</button>
                                </span>
                              ))}
                            </div>
                            <input
                              autoFocus
                              type="text"
                              value={interestInput}
                              onChange={(e) => {
                                const val = e.target.value;
                                setInterestInput(val);
                                processInterestInput(val);
                              }}
                              onKeyDown={handleInterestInputKey}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-indigo-500/50"
                              placeholder="Add interest, then comma..."
                            />
                          </div>
                        )}
                        <button
                          onClick={() => setEditingPart('none')}
                          className="w-full py-4 bg-indigo-600 text-white font-bold rounded-full shadow-[0_0_20px_rgba(255,255,255,0.4)] active:scale-95 transition-transform"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  )}

                  {!isEditingGroup && (
                    <>
                      <div className="space-y-4">
                        <h3 className="text-[var(--text-secondary)] text-[13px] font-black uppercase tracking-widest mb-4 pl-2">Chat settings</h3>
                        <div className={`${isLightTheme ? 'bg-[var(--bg-secondary)] divide-[var(--border-color)] border-[var(--border-color)]' : (isColoredTheme ? 'bg-black/20 divide-white/10 border-white/10' : 'bg-[#140c26] divide-white/5 border-white/5')} rounded-[32px] overflow-hidden divide-y border`}>
                          <button className={`w-full flex items-center justify-between p-6 ${isLightTheme ? 'hover:bg-[var(--bg-tertiary)] active:bg-[var(--bg-tertiary)]' : (isColoredTheme ? 'hover:bg-white/10 active:bg-white/10' : 'hover:bg-white/5 active:bg-white/5')} transition-colors`}>
                            <span className={`${isLightTheme ? 'text-[var(--text-primary)]' : 'text-white'} text-[15px] font-bold`}>Add members</span>
                            <svg className={`w-5 h-5 ${isLightTheme ? 'text-[var(--text-secondary)]' : 'text-white/40'} `} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                          <div className={`p-6 flex items-center justify-between cursor-pointer ${isLightTheme ? 'hover:bg-[var(--bg-tertiary)] active:bg-[var(--bg-tertiary)]' : (isColoredTheme ? 'hover:bg-white/10 active:bg-white/10' : 'hover:bg-white/5 active:bg-white/5')} transition-colors`} onClick={() => setIsMuted(!isMuted)}>
                            <span className={`${isLightTheme ? 'text-[var(--text-primary)]' : 'text-white'} text-[15px] font-bold`}>Mute</span>
                            <div className={`w-14 h-8 rounded-full relative transition-colors ${isMuted ? (currentTheme.name === 'That Orange' ? 'bg-orange-600' : currentTheme.name === 'Hot Pink' ? 'bg-pink-600' : currentTheme.name === 'More Brown' ? 'bg-amber-700' : isLightTheme ? 'bg-black' : 'bg-indigo-600') : (isLightTheme ? 'bg-[var(--bg-tertiary)]' : 'bg-white/10')} `}>
                              <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${isMuted ? 'translate-x-6' : 'translate-x-0'} `} />
                            </div>
                          </div>

                          <button className={`w-full text-left p-6 text-[#f43f5e] font-bold text-[15px] ${isLightTheme ? 'hover:bg-[var(--bg-tertiary)] active:bg-[var(--bg-tertiary)]' : (isColoredTheme ? 'hover:bg-white/10 active:bg-white/10' : 'hover:bg-white/5 active:bg-white/5')} transition-colors`}>
                            Leave
                          </button>
                        </div>
                      </div>

                      <div className="space-y-4 pb-12">
                        <h3 className="text-[var(--text-secondary)] text-[13px] font-black uppercase tracking-widest mb-1 pl-2">Members</h3>
                        <div className="space-y-1">
                          {connection.members?.map(member => (
                            <div key={member.id} onClick={() => setSelectedMember(member)} className={`flex items-center gap-4 py-4 px-1 border-b ${isLightTheme ? 'border-[var(--border-color)] hover:bg-[var(--bg-tertiary)] active:bg-[var(--bg-tertiary)]' : 'border-white/5 hover:bg-white/5 active:bg-white/5'} last:border-0 transition-colors cursor-pointer group`}>
                              <img
                                src={member.images?.[0] || `https://picsum.photos/seed/${member.id}/200`}
                                className={`w-14 h-14 rounded-xl object-cover flex-shrink-0 border ${isLightTheme ? 'border-[var(--border-color)]' : 'border-white/10'}`}
                                alt={member.name}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 mb-0.5">
                                  <h4 className={`${isLightTheme ? 'text-[var(--text-primary)]' : 'text-white'} font-bold text-[15px] truncate`}>{member.name}</h4>
                                  {member.isPro && (
                                    <div className={`w-[18px] h-[18px] bg-[#4c1d95] rounded-full flex items-center justify-center text-[10px] text-white font-black shadow-sm border ${isLightTheme ? 'border-[var(--border-color)]' : 'border-white/10'} pt-[0.5px]`}>P</div>
                                  )}
                                </div>
                                <p className={`${isLightTheme ? 'text-[var(--text-secondary)]' : 'text-white/40'} text-[14px] font-bold`}>{member.age} • {member.artistTypes?.[0] || 'Artist'}</p>
                              </div>
                              <svg className="w-6 h-6 text-white/10 group-active:text-white/30 flex-shrink-0 self-center" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          ))}
                        </div >
                      </div >
                    </>
                  )}
                </div >
              )}
            </div >
          </div >
        )}

        {
          messageToDelete && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-6" onClick={(e) => e.stopPropagation()}>
              <div className="bg-[#1a0b2e] w-full max-sm rounded-[32px] p-6 flex flex-col items-center border border-white/5 shadow-2xl animate-in zoom-in duration-200">
                <h3 className="text-lg font-bold text-white text-center mb-4">Delete this message?</h3>
                <div className="w-full bg-white/5 rounded-2xl p-4 mb-6 border border-white/5">
                  <p className="text-white/60 text-sm italic line-clamp-3">"{messageToDelete.text}"</p>
                </div>
                <div className="w-full space-y-2">
                  <button
                    onClick={() => markAsDeleted(messageToDelete.id)}
                    className="w-full py-3.5 bg-red-500 text-white font-black rounded-full text-sm active:scale-95 transition-transform"
                  >
                    Delete
                  </button>
                  <button onClick={() => setMessageToDelete(null)} className="w-full py-3.5 bg-white/5 text-white/60 font-bold rounded-full text-sm active:scale-95 transition-transform">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )
        }


        {
          showOptions && (
            <div className="fixed inset-0 z-[100] bg-[var(--bg-primary)] animate-in slide-in-from-bottom duration-300 overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
              <header className="flex items-center gap-4 p-4 bg-[var(--bg-primary)]/80 backdrop-blur-md sticky top-0 z-20 border-b border-[var(--border-color)]">
                <button onClick={() => setShowOptions(false)} className="p-1 -ml-1 hover:bg-[var(--text-primary)]/5 rounded-full transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h2 className="text-lg font-bold truncate text-[var(--text-primary)]">{connection.profile.name}</h2>
              </header>
              <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
                {/* Options Section */}
                {/* Options Section */}
                <div className="space-y-4">
                  <h3 className="text-[var(--text-secondary)] text-xs font-black uppercase tracking-widest pl-2">Options</h3>
                  <div className="bg-[var(--bg-secondary)] rounded-[32px] overflow-hidden divide-y divide-[var(--border-color)] border border-[var(--border-color)]">
                    <button
                      onClick={() => { setShowOptions(false); onCreateGroupChat(); }}
                      className="w-full flex items-center justify-between p-5 text-left active:bg-[var(--text-primary)]/5 transition-colors"
                    >
                      <span className="text-base font-bold text-[var(--text-primary)]">Create Group Chat</span>
                    </button>
                    <div onClick={() => setIsMuted(!isMuted)} className="flex items-center justify-between p-5 cursor-pointer active:bg-[var(--text-primary)]/5 transition-colors">
                      <span className="text-base font-bold text-[var(--text-primary)]">Mute</span>
                      <div className={`w-12 h-7 rounded-full relative transition-colors ${isMuted ? (currentTheme.name === 'That Orange' ? 'bg-orange-600' : currentTheme.name === 'Hot Pink' ? 'bg-pink-600' : currentTheme.name === 'More Brown' ? 'bg-amber-700' : isLightTheme ? 'bg-black' : 'bg-indigo-600') : 'bg-[var(--text-primary)]/10'}`}>
                        <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${isMuted ? 'translate-x-5' : 'translate-x-0'}`} />
                      </div>
                    </div>

                  </div>
                </div>

                {/* Safety Section */}
                <div className="space-y-4">
                  <h3 className="text-[var(--text-secondary)] text-xs font-black uppercase tracking-widest pl-2">Safety</h3>
                  <div className="bg-[var(--bg-secondary)] rounded-[32px] overflow-hidden divide-y divide-[var(--border-color)] border border-[var(--border-color)]">
                    <button className="w-full text-left p-5 active:bg-[var(--text-primary)]/5 transition-colors group">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-base font-bold text-[var(--text-primary)]">Disconnect</span>
                        <span className="text-sm text-[var(--text-secondary)] font-medium">Remove this person from your connections</span>
                      </div>
                    </button>
                    <button className="w-full text-left p-5 active:bg-[var(--text-primary)]/5 transition-colors group">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-base font-bold text-[var(--text-primary)]">Block</span>
                        <span className="text-sm text-[var(--text-secondary)] font-medium">Block this person to prevent future contact</span>
                      </div>
                    </button>
                    <button className="w-full text-left p-5 active:bg-[var(--text-primary)]/5 transition-colors group">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-base font-bold text-[#f43f5e]">Report</span>
                        <span className="text-sm text-[#f43f5e]/60 font-medium">Report this person for inappropriate behaviour</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        }


        {/* Voice Call View */}
        {
          activeCallType === 'voice' && activeGlobalCall && (
            <VoiceCallView
              profile={connection.profile}
              onEndCall={handleEndCall}
              onMinimize={(duration, isMuted, isSpeaker, isOnHold) => {
                if (onMinimizeCall) {
                  onMinimizeCall('voice', { duration, isMuted, isSpeaker, isOnHold });
                }
              }}
              isGroup={connection.isGroup}
              members={connection.members}
              initialMuted={activeGlobalCall.isMuted}
              initialSpeaker={activeGlobalCall.isSpeaker}
              initialOnHold={activeGlobalCall.isOnHold}
              initialDuration={callDuration}
              onStateChange={(state) => onUpdateCallState && onUpdateCallState(state)}
            />
          )
        }

        {/* Video Call View */}
        {
          activeCallType === 'video' && activeGlobalCall && (
            <VideoCallView
              profile={connection.profile}
              userImage={userImage}
              onEndCall={handleEndCall}
              onMinimize={(duration, isMuted, isSpeaker, isVideoOff) => {
                if (onMinimizeCall) {
                  onMinimizeCall('video', { duration, isMuted, isSpeaker, isVideoOff });
                }
              }}
              isGroup={connection.isGroup}
              members={connection.members}
              initialMuted={activeGlobalCall.isMuted}
              initialVideoOff={activeGlobalCall.isVideoOff}
              initialDuration={callDuration}
              onStateChange={(state) => onUpdateCallState && onUpdateCallState(state)}
            />
          )
        }

        {/* Image Viewer Modal */}
        {
          viewingMedia && (
            <div className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-xl flex items-center justify-center animate-in fade-in duration-200" onClick={() => setViewingMedia(null)}>
              <button
                onClick={() => setViewingMedia(null)}
                className="absolute top-6 right-6 p-2 bg-white/10 rounded-full hover:bg-white/20 text-white transition-colors z-[160]"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div
                className="relative w-full h-full flex items-center justify-center p-4 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={viewingMedia}
                  alt="Full screen media"
                  className="max-w-full max-h-full object-contain shadow-2xl transition-transform duration-300 cursor-zoom-in"
                  onClick={(e) => {
                    const img = e.currentTarget;
                    if (img.style.transform === 'scale(2)') {
                      img.style.transform = 'scale(1)';
                      img.style.cursor = 'zoom-in';
                    } else {
                      img.style.transform = 'scale(2)';
                      img.style.cursor = 'zoom-out';
                    }
                  }}
                />
              </div>
            </div>
          )
        }

        <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
      </div >
    </>
  );
};

const MessageItem: React.FC<{
  msg: ChatMessage;
  connection: Connection;
  onSelect: () => void;
  onLongPress: () => void;
  onReply: () => void;
  isMenuOpen: boolean;
  isReactionMenuOpen: boolean;
  anyMenuOpen: boolean;
  currentReactionMenuId: string | null;
  currentSelectedId: string | null;
  closeMenus: () => void;
  onStartEdit: () => void;
  onDelete: () => void;
  onAddReaction: (emoji: string) => void;
  onOpenMedia: (url: string) => void;
  isLightTheme: boolean;
  orderedEmojiSet: string[];
}> = ({
  msg, connection, onSelect, onLongPress, onReply, isMenuOpen,
  isReactionMenuOpen, anyMenuOpen, currentReactionMenuId, currentSelectedId,
  closeMenus, onStartEdit, onDelete, onAddReaction, onOpenMedia, isLightTheme, orderedEmojiSet
}) => {
    const { currentTheme } = useTheme();
    const messageRef = useRef<HTMLDivElement>(null);
    const replyIconRef = useRef<HTMLDivElement>(null);
    const reactionPanelRef = useRef<HTMLDivElement>(null);
    const startX = useRef(0);
    const isDragging = useRef(false);
    const currentDragOffset = useRef(0);
    const lastTap = useRef(0);

    // Attach non-passive wheel event listener for horizontal scroll on reaction panel
    useEffect(() => {
      const panel = reactionPanelRef.current;
      if (!panel) return;

      const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        panel.scrollLeft += e.deltaY;
      };

      panel.addEventListener('wheel', handleWheel, { passive: false });
      return () => {
        panel.removeEventListener('wheel', handleWheel);
      };
    }, [isReactionMenuOpen]);

    const onTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
      // Don't start drag if reaction menu is open
      if (isReactionMenuOpen) return;
      startX.current = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
      isDragging.current = true;
      currentDragOffset.current = 0;
    };

    const onTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
      if (!isDragging.current) return;
      const currentX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
      const deltaX = currentX - startX.current;
      if (deltaX > 10) {
        const offset = Math.min(deltaX, 60);
        currentDragOffset.current = offset;
        // Direct DOM manipulation for 60fps
        if (messageRef.current) {
          messageRef.current.style.transform = `translateX(${offset}px)`;
        }
        if (replyIconRef.current) {
          replyIconRef.current.style.opacity = offset > 10 ? '1' : '0';
        }
      }
    };

    const onTouchEnd = () => {
      if (currentDragOffset.current > 50) onReply();
      // Reset with transition
      if (messageRef.current) {
        messageRef.current.style.transition = 'transform 150ms ease-out';
        messageRef.current.style.transform = 'translateX(0)';
        setTimeout(() => {
          if (messageRef.current) messageRef.current.style.transition = '';
        }, 150);
      }
      if (replyIconRef.current) {
        replyIconRef.current.style.opacity = '0';
      }
      currentDragOffset.current = 0;
      isDragging.current = false;
    };

    const isMe = msg.sender === 'me';
    const hasReactions = msg.reactions && msg.reactions.length > 0;
    const isLiked = msg.reactions?.includes('❤️');
    const isImageMessage = msg.text.trim().toLowerCase() === 'image';

    // Render call log messages centered
    if (msg.sender === 'system' && msg.isCallLog) {
      return (
        <div className="flex justify-center w-full py-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
            <svg className="w-4 h-4 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
              {msg.text.includes('video') ? (
                <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
              ) : (
                <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
              )}
            </svg>
            <span className="text-xs font-medium text-white/50">{msg.text}</span>
          </div>
        </div>
      );
    }

    return (
      <div
        className={`flex flex-col w-full relative ${isMe ? 'items-end' : 'items-start'} ${isReactionMenuOpen || isMenuOpen ? 'z-[60]' : 'z-auto'}`}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onTouchStart}
        onMouseMove={onTouchMove}
        onMouseUp={onTouchEnd}
        onMouseLeave={onTouchEnd}
      >
        {!isMe && (
          <div ref={replyIconRef} className="absolute left-0 inset-y-0 flex items-center pl-2 opacity-0 transition-opacity">
            <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          </div>
        )}
        <div
          ref={messageRef}
          className="max-w-[80%] relative"
        >
          {!isMe && connection.isGroup && msg.author && (
            <span className={`text-[9px] font-black mb-0.5 ml-3 block uppercase tracking-widest ${isLightTheme ? 'text-gray-500' : 'text-white/30'}`}>{msg.author}</span>
          )}
          <div className="relative">
            {isReactionMenuOpen && (
              <div className={`absolute -top-12 z-[100] animate-in zoom-in-95 duration-200 ${isMe ? 'right-0' : 'left-0'}`}>
                <div
                  ref={reactionPanelRef}
                  className="bg-[#1a0b2e] border border-white/10 p-1 rounded-full shadow-2xl flex gap-1 overflow-x-auto no-scrollbar w-[240px] max-w-[80vw] touch-pan-x"
                  onClick={(e) => e.stopPropagation()}
                >
                  {orderedEmojiSet.map(emoji => (
                    <button
                      key={emoji}
                      onClick={(e) => { e.stopPropagation(); onAddReaction(emoji); }}
                      className="w-8 h-8 flex-shrink-0 flex items-center justify-center text-[19px] hover:bg-white/10 rounded-full transition-all active:scale-75"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {hasReactions && (
              <div className="absolute -top-2.5 -right-1 z-20 flex items-center gap-0.5">
                <div className="flex bg-[#0a0118]/90 backdrop-blur-md border border-white/10 px-1.5 py-0.5 rounded-full shadow-sm">
                  {msg.reactions!.map((r, i) => (
                    <span key={i} className="text-[13px] leading-none">{r}</span>
                  ))}
                </div>
              </div>
            )}
            {(msg.replyTo || msg.quote) && !msg.isDeleted && (() => {
              const replyThemeMap: Record<string, { bg: string, border: string, text: string }> = {
                'Dark': { bg: 'bg-indigo-500/10', border: 'border-indigo-400/50', text: 'text-indigo-300' },
                'Light': { bg: 'bg-sky-500/10', border: 'border-sky-400/50', text: 'text-sky-600' },
                'Orange': { bg: 'bg-orange-500/10', border: 'border-orange-400/50', text: 'text-orange-300' },
                'Pink': { bg: 'bg-pink-500/10', border: 'border-pink-400/50', text: 'text-pink-300' },
                'Brown': { bg: 'bg-stone-500/10', border: 'border-stone-400/50', text: 'text-stone-300' }
              };
              const themeStyles = replyThemeMap[currentTheme.name] || replyThemeMap['Dark'];

              return (
                <div className={`mb-[-10px] pb-4 px-2.5 pt-1.5 backdrop-blur-sm border-x border-t ${themeStyles.bg} ${isLightTheme ? 'border-gray-200' : 'border-white/5'} ${isMe ? 'rounded-t-xl rounded-tr-sm' : 'rounded-t-xl rounded-tl-sm'}`}>
                  <div className={`border-l-2 pl-2 ${themeStyles.border}`}>
                    <p className={`text-[9px] font-black uppercase tracking-widest mb-0.5 ${themeStyles.text}`}>
                      {msg.replyTo ? (msg.replyTo.sender === 'me' ? 'Me' : (msg.replyTo.author || connection.profile.name)) : connection.profile.name}
                    </p>
                    <p className={`text-[12px] line-clamp-1 italic ${isLightTheme ? 'text-gray-500' : 'text-white/40'}`}>"{msg.replyTo ? msg.replyTo.text : msg.quote}"</p>
                  </div>
                </div>
              );
            })()}
            <div
              onClick={(e) => {
                e.stopPropagation();
                // If another menu is open, just close it and return
                if (anyMenuOpen && currentReactionMenuId !== msg.id && currentSelectedId !== msg.id) {
                  closeMenus();
                  return;
                }

                const now = Date.now();
                if (now - lastTap.current < 300) {
                  onAddReaction('❤️');
                  lastTap.current = 0;
                  return;
                }
                lastTap.current = now;
                if (isImageMessage) {
                  onOpenMedia('https://images.pexels.com/photos/3755556/pexels-photo-3755556.jpeg');
                } else {
                  onLongPress();
                }
              }}
              onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); onSelect(); }}
              className={`px-3 py-2 shadow-sm relative z-10 transition-colors duration-300 select-none ${hasReactions ? 'mt-3' : ''} ${isMe
                ? msg.isDeleted
                  ? 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] italic rounded-2xl rounded-tr-sm border border-[var(--border-color)]'
                  : `${isLiked ? (isLightTheme ? 'bg-purple-600' : 'bg-[#4c1d95]') : 'bg-[var(--chat-bubble-sent)]'} text-white rounded-2xl rounded-tr-sm shadow-lg`
                : `${isLiked ? 'bg-[#4c1d95] shadow-lg' : 'bg-[var(--chat-bubble-received)] border border-[var(--border-color)]'} text-[var(--text-primary)] rounded-2xl rounded-tl-sm`
                } ${isImageMessage ? `p-1.5 overflow-hidden min-w-[132px] aspect-square flex items-center justify-center ${isLightTheme && !isMe
                  ? 'bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-md border border-white/40 shadow-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.1)] hover:to-black/10'
                  : 'bg-gradient-to-br from-white/10 to-black/40 border border-white/20 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.8)]'
                  }` : ''}`}
            >
              {isImageMessage ? (
                <div className="w-full h-full relative group">
                  <div className="absolute inset-0 bg-white/10 blur-xl opacity-50 scale-150"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <svg className={`w-8 h-8 ${isLightTheme ? 'text-black/50' : 'text-white/40'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-primary)]">Tap to view</span>
                  </div>
                </div>
              ) : (
                <p className={`font-[450] whitespace-pre-wrap leading-tight ${msg.isDeleted ? 'text-xs' : 'text-[15px]'}`}>
                  {msg.isDeleted ? msg.text : msg.text.split(/([\p{Extended_Pictographic}\u{1F3FB}-\u{1F3FF}\u{200D}]+)/u).map((part, i) => (
                    /[\p{Extended_Pictographic}]/u.test(part) ? (
                      <span key={i} className="text-[17px]">{part}</span>
                    ) : (
                      part
                    )
                  ))}
                </p>
              )}
            </div>
          </div>
        </div>
        {msg.isEdited && !msg.isDeleted && (
          <span className="text-[7px] font-black uppercase text-white/10 mt-0.5 mr-1 tracking-widest italic">edited</span>
        )}
        {isMenuOpen && !msg.isDeleted && isMe && (
          <div className="mt-1 flex items-center gap-1 animate-in slide-in-from-top-1 duration-150" onClick={(e) => e.stopPropagation()}>
            <button onClick={(e) => { e.stopPropagation(); onStartEdit(); }} className="bg-white/5 px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-white/10">Edit</button>
            <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="bg-red-500/10 px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-red-500/10 text-red-400">Delete</button>
          </div>
        )}
      </div>
    );
  };

export default IndividualChatView;