
export enum Tab {
  Discover = 'discover',
  Likes = 'likes',
  Chat = 'chat',
  Profile = 'profile'
}

export enum ViewMode {
  List = 'list',
  Horizontal = 'horizontal'
}

export interface Profile {
  id: string;
  name: string;
  age: number;
  profileType: 'Artist' | 'Group';

  distance: string;
  bio: string;
  images: string[];
  lastSeen?: string;
  isPro?: boolean;
  isVerified?: boolean;
  // desires removed - legacy
  interests?: string[];
  hiddenBio?: string;
  isHidden?: boolean;
  isIncognito?: boolean;
  artistTypes?: string[];
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'me' | 'them' | 'system';
  author?: string;
  quote?: string;
  replyTo?: ChatMessage;
  timestamp?: number;
  isDeleted?: boolean;
  isEdited?: boolean;
  reactions?: string[];
  isCallLog?: boolean;
}

export interface Connection {
  id: string;
  profile: Profile;
  lastMessage?: string;
  lastMessageTime?: string;
  lastMessageTimestamp?: number;
  unreadCount: number;
  isGroup?: boolean;
  members?: Profile[];
  isSeen?: boolean; // Track if the new connection bubble was clicked
  category?: 'primary' | 'general'; // Chat category - new connections default to general
}
