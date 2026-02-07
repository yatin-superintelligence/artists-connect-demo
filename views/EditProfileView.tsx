import React, { useState, useEffect } from 'react';
import { Profile } from '../types';
import { useTheme } from '../theme/ThemeContext';
import ArtistTypePickerView from './ArtistTypePickerView';
import InterestsPickerView from './InterestsPickerView';


import { getProfilePosts, Post } from '../data/profiles/posts';
import ProfileDetail from '../components/ProfileDetail';

interface EditProfileViewProps {
  profile: Profile;
  onBack: () => void;
  onSave: (updatedProfile: Profile) => void;
  onOpenPro: (variant?: 'lastSeen' | 'likes' | 'general' | 'incognito') => void;
  onOpenPhotos: () => void;
}

enum EditTab {
  Edit = 'edit',
  Preview = 'preview'
}

type SubView = 'none' | 'artistTypes' | 'interests';

const EditProfileView: React.FC<EditProfileViewProps> = ({ profile, onBack, onSave, onOpenPro, onOpenPhotos }) => {
  const [activeTab, setActiveTab] = useState<EditTab>(EditTab.Edit);
  const [editedProfile, setEditedProfile] = useState<Profile>({ ...profile });
  const [activeSubView, setActiveSubView] = useState<SubView>('none');
  const [interestInput, setInterestInput] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [lastSavedProfile, setLastSavedProfile] = useState<Profile>({ ...profile });
  const [saveAnimation, setSaveAnimation] = useState(false);
  const [showPostEditor, setShowPostEditor] = useState(false);
  const [newPostImages, setNewPostImages] = useState<string[]>(['', '', '', '', '', '']);
  const [newPostCaption, setNewPostCaption] = useState('');
  const [userPosts, setUserPosts] = useState<Post[]>(getProfilePosts(profile.id));
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isEditingCaption, setIsEditingCaption] = useState(false);
  const [editingCaptionText, setEditingCaptionText] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { currentTheme } = useTheme();
  const isLightTheme = currentTheme.name === 'Light';
  const isColoredTheme = ['Orange', 'Pink', 'Brown'].includes(currentTheme.name);
  const isDarkTheme = currentTheme.name === 'Dark';

  // Handle back button for subviews and modals
  useEffect(() => {
    // Push history state when opening a subview/modal so back button works
    if (activeSubView !== 'none' || showPostEditor || selectedPost) {
      window.history.pushState({ editProfileSubView: true }, '', window.location.href);
      // BIG FIX: Tell App.tsx we are handling this, so it doesn't close the entire EditView
      (window as any).__internalPopupOpen = true;
    } else {
      (window as any).__internalPopupOpen = false;
    }

    return () => {
      // Cleanup when unmounting or changing state
      (window as any).__internalPopupOpen = false;
    };
  }, [activeSubView, showPostEditor, selectedPost]);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // Check if handled by child
      if ((window as any).__backHandled) return;

      // Handle closing subviews/modals
      if (activeSubView !== 'none' || showPostEditor || selectedPost) {
        (window as any).__backHandled = true; // Stop others

        // Close everything
        setActiveSubView('none');
        setShowPostEditor(false);
        setSelectedPost(null);
        setIsPreviewMode(false);
        setIsEditingCaption(false);

        // Reset global flag now that we've closed it
        (window as any).__internalPopupOpen = false;

        // Reset handled flag after a tick
        setTimeout(() => { (window as any).__backHandled = false; }, 50);
        return;
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [activeSubView, showPostEditor, selectedPost]);

  // Track changes to enable Save button based on the last saved state
  useEffect(() => {
    const isDifferent = JSON.stringify(editedProfile) !== JSON.stringify(lastSavedProfile);
    setHasChanges(isDifferent);
  }, [editedProfile, lastSavedProfile]);

  const handleUpdate = (updates: Partial<Profile>) => {
    setEditedProfile(prev => ({ ...prev, ...updates }));
  };

  const handleInterestInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.endsWith(',')) {
      const tag = value.slice(0, -1).trim();
      if (tag && (editedProfile.interests || []).length < 10) {
        if (!(editedProfile.interests || []).includes(tag)) {
          handleUpdate({ interests: [...(editedProfile.interests || []), tag] });
        }
      }
      setInterestInput('');
    } else {
      setInterestInput(value);
    }
  };

  const removeInterest = (tag: string) => {
    handleUpdate({ interests: (editedProfile.interests || []).filter(t => t !== tag) });
  };

  const handleSave = () => {
    if (!hasChanges) return;
    onSave(editedProfile);
    setLastSavedProfile({ ...editedProfile });
    setSaveAnimation(true);
    setTimeout(() => setSaveAnimation(false), 2000);
  };

  if (activeSubView === 'artistTypes') {
    return (
      <ArtistTypePickerView
        selected={editedProfile.artistTypes || []}
        onBack={() => setActiveSubView('none')}
        onSave={(newTypes) => {
          handleUpdate({ artistTypes: newTypes });
          setActiveSubView('none');
        }}
      />
    );
  }

  if (activeSubView === 'interests') {
    return (
      <InterestsPickerView
        selected={editedProfile.interests || []}
        onBack={() => setActiveSubView('none')}
        onSave={(newInterests) => {
          handleUpdate({ interests: newInterests });
          setActiveSubView('none');
        }}
      />
    );
  }





  return (
    <div className="fixed inset-0 bg-[var(--bg-primary)] z-[60] flex flex-col animate-in slide-in-from-bottom duration-300">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-[var(--border-color)] bg-[var(--bg-primary)] sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-[var(--bg-tertiary)] rounded-full transition-colors text-[var(--text-primary)]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold">Edit profile</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={!hasChanges}
          className={`px-6 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-2 ${hasChanges
            ? 'bg-white text-black opacity-100 shadow-lg'
            : saveAnimation
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-white/10 text-white/30 cursor-not-allowed'
            }`}
        >
          {saveAnimation ? (
            <>
              Saved
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </>
          ) : 'Save'}
        </button>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-[var(--border-color)] bg-[var(--bg-primary)]">
        <button
          onClick={() => setActiveTab(EditTab.Edit)}
          className={`flex-1 py-4 font-bold text-sm relative transition-colors ${activeTab === EditTab.Edit ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'
            }`}
        >
          Edit
          {activeTab === EditTab.Edit && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--text-primary)]" />}
        </button>
        <button
          onClick={() => setActiveTab(EditTab.Preview)}
          className={`flex-1 py-4 font-bold text-sm relative transition-colors ${activeTab === EditTab.Preview ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'
            }`}
        >
          Preview
          {activeTab === EditTab.Preview && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--text-primary)]" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {activeTab === EditTab.Edit ? (
          <div className="p-4 space-y-4 pb-24 max-w-2xl mx-auto">
            {/* Photos Section */}
            <div className="mb-2">
              <div className="relative aspect-square rounded-[32px] overflow-hidden mb-4 shadow-xl max-w-lg mx-auto">
                <img src={editedProfile.images[0]} className="w-full h-full object-cover" alt="Main" />
              </div>
              <button
                onClick={onOpenPhotos}
                className="w-full flex items-center justify-between p-4 bg-transparent rounded-2xl group"
              >
                <span className="font-bold text-xl">Edit photos</span>
                <svg className="w-6 h-6 text-gray-500 group-hover:text-gray-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <div className="h-px bg-white/5 mx-[-16px]" />
            </div>

            {/* Basic Info Card */}
            <div className="bg-[var(--bg-tertiary)] rounded-[24px] overflow-hidden divide-y divide-[var(--border-color)] border border-[var(--border-color)]">
              <div className="p-5">
                <label className="text-[13px] font-bold text-[var(--text-secondary)] mb-2 block">Call me...</label>
                <input
                  type="text"
                  value={editedProfile.name}
                  onChange={(e) => handleUpdate({ name: e.target.value })}
                  className="w-full bg-transparent text-xl font-medium outline-none text-[var(--text-primary)]"
                />
              </div>
              <div className="p-5">
                <label className="text-[13px] font-bold text-[var(--text-secondary)] mb-2 block">Date of birth</label>
                <div className="text-xl text-[var(--text-primary)]">Sep 4, 2000 (25 years old)</div>
              </div>


            </div>

            {/* About Card */}
            <div className="bg-[var(--bg-tertiary)] p-5 rounded-[24px] border border-[var(--border-color)]">
              <div className="flex justify-between items-center mb-4">
                <label className="text-[13px] font-bold text-[var(--text-secondary)]">About</label>
                <span className="text-[13px] text-[var(--text-secondary)]">{editedProfile.bio.length}/1500</span>
              </div>
              <textarea
                value={editedProfile.bio}
                onChange={(e) => handleUpdate({ bio: e.target.value })}
                className="w-full bg-transparent text-[17px] leading-snug min-h-[140px] outline-none resize-none text-[var(--text-primary)]"
                placeholder="Write something about yourself..."
              />
              <p className="text-[13px] text-[var(--text-secondary)] mt-6 leading-tight">We don't allow phone numbers in profiles. Remove it to save your changes.</p>
            </div>

            {/* Hidden Bio Card */}
            <div className="bg-[var(--bg-tertiary)] p-5 rounded-[24px] border border-[var(--border-color)]">
              <div className="flex justify-between items-center mb-4">
                <label className="text-[13px] font-bold text-[var(--text-secondary)]">Hidden bio</label>
                <span className="text-[13px] text-[var(--text-secondary)]">{(editedProfile.hiddenBio || '').length}/300</span>
              </div>
              <textarea
                value={editedProfile.hiddenBio}
                onChange={(e) => handleUpdate({ hiddenBio: e.target.value })}
                className="w-full bg-transparent text-[17px] leading-snug min-h-[60px] outline-none resize-none text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
                placeholder="Type your truth"
              />
              <p className="text-[13px] text-[var(--text-secondary)] mt-6 leading-tight">This will only be seen by people you like or Spark.</p>
            </div>

            {/* Art Forms Section */}
            <button
              onClick={() => setActiveSubView('artistTypes')}
              className="w-full bg-[var(--bg-tertiary)] p-5 rounded-[24px] border border-[var(--border-color)] text-left active:bg-[var(--bg-primary)] transition-colors group"
            >
              <div className="flex justify-between items-center mb-5">
                <label className="text-[13px] font-bold text-[var(--text-secondary)]">Art Forms</label>
                <span className="text-[13px] text-[var(--text-secondary)]">{(editedProfile.artistTypes || []).length}/5</span>
              </div>
              <div className="flex items-start justify-between">
                <div className="flex flex-wrap gap-2.5 max-w-[90%]">
                  {(editedProfile.artistTypes || []).map(tag => (
                    <div key={tag} className={`px-5 py-2.5 rounded-full text-[14px] font-bold border ${isLightTheme ? 'bg-black/5 border-black/10 text-[var(--text-primary)]' : 'bg-white/5 border-white/20 text-white/90'}`}>
                      {tag}
                    </div>
                  ))}
                  {(!editedProfile.artistTypes || editedProfile.artistTypes.length === 0) && (
                    <span className="text-gray-700 italic">Select your art forms</span>
                  )}
                </div>
                <svg className="w-6 h-6 text-gray-500 mt-1 flex-shrink-0 group-hover:text-gray-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            {/* Interests Section */}
            <button
              onClick={() => setActiveSubView('interests')}
              className="w-full bg-[var(--bg-tertiary)] p-5 rounded-[24px] border border-[var(--border-color)] text-left active:bg-[var(--bg-primary)] transition-colors group"
            >
              <div className="flex justify-between items-center mb-5">
                <label className="text-[13px] font-bold text-[var(--text-secondary)]">Interests</label>
                <span className="text-[13px] text-[var(--text-secondary)]">{(editedProfile.interests || []).length}</span>
              </div>
              <div className="flex items-start justify-between">
                <div className="flex flex-wrap gap-2.5 max-w-[90%]">
                  {(editedProfile.interests || []).map(tag => (
                    <div key={tag} className={`px-5 py-2.5 rounded-full text-[14px] font-bold border ${isLightTheme ? 'bg-black/5 border-black/10 text-[var(--text-primary)]' : 'bg-white/5 border-white/20 text-white/90'}`}>
                      {tag}
                    </div>
                  ))}
                  {(!editedProfile.interests || editedProfile.interests.length === 0) && (
                    <span className="text-gray-700 italic">Add your interests</span>
                  )}
                </div>
                <svg className="w-6 h-6 text-gray-500 mt-1 flex-shrink-0 group-hover:text-gray-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            {/* Posts & Art Section */}
            <div className="bg-[var(--bg-tertiary)] p-5 rounded-[24px] border border-[var(--border-color)]">
              <div className="flex justify-between items-center mb-5">
                <label className="text-[13px] font-bold text-[var(--text-secondary)]">POSTS & ART</label>
                <span className="text-[13px] text-[var(--text-secondary)]">{userPosts.length}/10</span>
              </div>

              {/* Posts grid with add tile */}
              {userPosts.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {userPosts.map((post) => (
                    <div
                      key={post.id}
                      onClick={() => { setSelectedPost(post); setIsPreviewMode(false); }}
                      className={`relative aspect-square rounded-xl overflow-hidden group cursor-pointer ${isLightTheme ? 'bg-white/50' : 'bg-white/5'}`}
                    >
                      <img src={post.images[0]} alt="" className="w-full h-full object-cover" />
                      {post.images.length > 1 && (
                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5 text-[10px] text-white font-bold">
                          +{post.images.length - 1}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                        <span className="text-[10px] text-white/70 font-medium">Tap to view</span>
                      </div>
                    </div>
                  ))}

                  {/* Add more tile - square when posts exist */}
                  {userPosts.length < 10 && (
                    <button
                      onClick={() => setShowPostEditor(true)}
                      className={`aspect-square rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-2 group ${isLightTheme ? 'border-[var(--border-color)] bg-white/50 hover:border-gray-400 hover:bg-white' : 'border-white/10 bg-white/[0.02] hover:border-pink-500/30 hover:bg-pink-500/5'}`}
                    >
                      <svg className={`w-8 h-8 transition-colors ${isLightTheme ? 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]' : 'text-white/20 group-hover:text-pink-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className={`text-[9px] text-center px-1 font-medium leading-tight transition-colors ${isLightTheme ? 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]' : 'text-white/30 group-hover:text-white/50'}`}>
                        Add more
                      </span>
                    </button>
                  )}
                </div>
              ) : (
                /* Full-width add tile when no posts */
                <button
                  onClick={() => setShowPostEditor(true)}
                  className={`w-full py-8 rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3 group ${isLightTheme ? 'border-[var(--border-color)] bg-white/50 hover:border-gray-400 hover:bg-white' : 'border-white/10 bg-white/[0.02] hover:border-pink-500/30 hover:bg-pink-500/5'}`}
                >
                  <svg className={`w-10 h-10 transition-colors ${isLightTheme ? 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]' : 'text-white/30 group-hover:text-pink-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className={`text-sm text-center px-4 font-medium transition-colors ${isLightTheme ? 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]' : 'text-white/40 group-hover:text-white/60'}`}>
                    Click here to add a post, art or share your thoughts
                  </span>
                </button>
              )}
            </div>

            {/* Privacy Settings */}
            <div className="space-y-4 pt-6">
              <h3 className="text-xl font-bold px-1 text-[var(--text-primary)]">Privacy settings</h3>
              <div className="bg-[var(--bg-tertiary)] rounded-[24px] divide-y divide-[var(--border-color)] border border-[var(--border-color)] overflow-hidden">
                <div className="p-5 flex items-start gap-4 active:bg-[var(--bg-primary)] transition-colors cursor-pointer" onClick={() => handleUpdate({ isHidden: !editedProfile.isHidden })}>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg mb-1 text-[var(--text-primary)]">Hide profile</h4>
                    <p className="text-sm text-[var(--text-secondary)] leading-snug">You can't browse in Discover, and only existing connections will see you.</p>
                  </div>
                  <Toggle active={!!editedProfile.isHidden} />
                </div>
                <div className="p-5 flex items-start gap-4 active:bg-[var(--bg-primary)] transition-colors cursor-pointer" onClick={() => onOpenPro('incognito')}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-lg text-[var(--text-primary)]">Incognito</h4>
                      <div className="w-[18px] h-[18px] bg-[#4c1d95] rounded-full flex items-center justify-center text-[10px] text-white font-black shadow-sm border border-[var(--border-color)] pt-[0.5px]">P</div>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] leading-snug">Hide your profile from people you haven't liked yet.</p>
                  </div>
                  <Toggle active={!!editedProfile.isIncognito} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Preview Mode using synced ProfileDetail */
          <div className="pb-24 max-w-2xl mx-auto min-h-screen bg-[var(--bg-primary)]">
            <ProfileDetail
              profile={editedProfile}
              isOwnProfile={true}
            />
          </div>
        )}
      </div>

      {/* Post Editor Modal */}
      {showPostEditor && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className={`rounded-[28px] w-full max-w-lg max-h-[90vh] overflow-y-auto no-scrollbar border shadow-2xl shadow-purple-900/20 ${isDarkTheme ? 'bg-gradient-to-b from-[#1a0e2e] to-[#0f0720] border-white/10' : 'bg-[var(--bg-primary)] border-[var(--border-color)]'}`}>
            {/* Modal Header */}
            <div className={`flex items-center justify-between p-5 border-b sticky top-0 backdrop-blur-sm z-10 ${isDarkTheme ? 'bg-[#1a0e2e]/95 border-white/5' : 'bg-[var(--bg-primary)]/95 border-[var(--border-color)]'}`}>
              <button
                onClick={() => {
                  setShowPostEditor(false);
                  setNewPostImages(['', '', '', '', '', '']);
                  setNewPostCaption('');
                }}
                className={`font-medium transition-colors ${isDarkTheme ? 'text-white/40 hover:text-white/70' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
              >
                Cancel
              </button>
              <h3 className="text-lg font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Share Your Magic</h3>
              <button
                onClick={() => {
                  const validImages = newPostImages.filter(img => img.trim() !== '');
                  if (validImages.length > 0) {
                    const newPost: Post = {
                      id: `post-${profile.id}-${Date.now()}`,
                      profileId: profile.id,
                      images: validImages,
                      caption: newPostCaption
                    };
                    setUserPosts(prev => [...prev, newPost]);
                    setShowPostEditor(false);
                    setNewPostImages(['', '', '', '', '', '']);
                    setNewPostCaption('');
                  }
                }}
                disabled={newPostImages.every(img => img.trim() === '')}
                className={`font-bold transition-all ${newPostImages.some(img => img.trim() !== '') ? 'text-pink-400 hover:text-pink-300' : (isDarkTheme ? 'text-white/20' : 'text-[var(--text-secondary)] opacity-50')}`}
              >
                Post
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Image Grid with Plus Icons - 6 slots in 2 rows of 3 */}
              <div>
                <p className={`text-[15px] font-medium mb-4 text-center ${isDarkTheme ? 'text-white/40' : 'text-[var(--text-secondary)]'}`}>Tap to add your photos or art</p>
                <div className="grid grid-cols-3 gap-3">
                  {newPostImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        // Dummy button - no action for now
                      }}
                      className={`aspect-square rounded-xl overflow-hidden transition-all flex items-center justify-center group ${img
                        ? 'border-2 border-pink-500/50'
                        : `border-2 border-dashed hover:border-pink-500/30 hover:bg-pink-500/5 ${isDarkTheme ? 'border-white/10 bg-white/[0.02]' : 'border-[var(--border-color)] bg-[var(--bg-tertiary)]'}`
                        }`}
                    >
                      {img ? (
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <svg className={`w-6 h-6 transition-colors group-hover:text-pink-400 ${isDarkTheme ? 'text-white/20' : 'text-[var(--text-secondary)]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Caption with sexy styling */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className={`text-[15px] font-medium ${isDarkTheme ? 'text-white/40' : 'text-[var(--text-secondary)]'}`}>Tell them what's on your mind...</label>
                  <span className={`text-[11px] ${isDarkTheme ? 'text-white/20' : 'text-[var(--text-secondary)]'}`}>{newPostCaption.length}/2000</span>
                </div>
                <textarea
                  value={newPostCaption}
                  onChange={(e) => {
                    if (e.target.value.length <= 2000) {
                      setNewPostCaption(e.target.value);
                    }
                  }}
                  placeholder="Let your thoughts wander..."
                  style={{ minHeight: '120px', height: 'auto' }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = target.scrollHeight + 'px';
                  }}
                  className={`w-full rounded-2xl px-5 py-4 text-[15px] outline-none resize-none focus:border-pink-500/30 focus:bg-pink-500/[0.02] transition-all leading-relaxed ${isDarkTheme ? 'bg-white/[0.03] border border-white/10 placeholder:text-white/15 text-white' : 'bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]'}`}
                />
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Post Viewer Modal - Handled by ProfileDetail in Preview mode, or Custom Editor below */}


      {selectedPost && !isPreviewMode && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className={`rounded-[28px] w-full max-w-lg max-h-[90vh] overflow-y-auto no-scrollbar border border-white/10 shadow-2xl shadow-purple-900/20 ${isDarkTheme ? 'bg-gradient-to-b from-[#1a0e2e] to-[#0f0720]' : 'bg-[var(--bg-primary)] border-[var(--border-color)]'}`}>
            {/* Modal Header */}
            <div className={`flex items-center justify-between p-5 border-b sticky top-0 backdrop-blur-sm z-10 ${isDarkTheme ? 'bg-[#1a0e2e]/95 border-white/5' : 'bg-[var(--bg-primary)]/95 border-[var(--border-color)]'}`}>
              <button
                onClick={() => { setSelectedPost(null); setIsEditingCaption(false); }}
                className={`font-medium transition-colors ${isDarkTheme ? 'text-white/40 hover:text-white/70' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
              >
                Close
              </button>
              <h3 className={`text-lg font-bold ${isDarkTheme ? 'text-white' : 'text-[var(--text-primary)]'}`}>Your Post</h3>
              <div className="w-12" /> {/* Spacer for alignment */}
            </div>

            {/* Post Content */}
            <div className="p-4">
              {/* Images label */}
              <p className={`text-[15px] font-medium mb-4 text-center ${isDarkTheme ? 'text-white/40' : 'text-[var(--text-secondary)]'}`}>Tap to add your photos or art</p>

              {/* Images Grid - 6 slots in 2 rows of 3 */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[0, 1, 2, 3, 4, 5].map((idx) => (
                  <div
                    key={idx}
                    className={`aspect-square rounded-xl overflow-hidden cursor-pointer transition-all flex items-center justify-center group ${selectedPost.images[idx]
                      ? 'border-2 border-pink-500/50'
                      : `border-2 border-dashed hover:border-pink-500/30 hover:bg-pink-500/5 ${isDarkTheme ? 'border-white/10 bg-white/[0.02]' : 'border-[var(--border-color)] bg-[var(--bg-tertiary)]'}`
                      }`}
                  >
                    {selectedPost.images[idx] ? (
                      <img src={selectedPost.images[idx]} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <svg className={`w-6 h-6 transition-colors group-hover:text-pink-400 ${isDarkTheme ? 'text-white/20' : 'text-[var(--text-secondary)]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>

              {/* Caption with Edit */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <span className={`text-[15px] font-medium ${isDarkTheme ? 'text-white/40' : 'text-[var(--text-secondary)]'}`}>Tell them what's on your mind...</span>
                  {!isEditingCaption && (
                    <button
                      onClick={() => {
                        setEditingCaptionText(selectedPost.caption || '');
                        setIsEditingCaption(true);
                      }}
                      className="text-pink-400 text-[12px] font-medium hover:text-pink-300 transition-colors flex items-center gap-1"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Edit
                    </button>
                  )}
                </div>
                {isEditingCaption ? (
                  <div>
                    <textarea
                      value={editingCaptionText}
                      onChange={(e) => setEditingCaptionText(e.target.value)}
                      style={{ minHeight: '100px', height: 'auto' }}
                      onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                        target.style.height = target.scrollHeight + 'px';
                      }}
                      className={`w-full rounded-xl px-4 py-3 text-[15px] outline-none resize-none focus:border-pink-500/30 transition-colors ${isDarkTheme ? 'bg-white/[0.03] border border-white/10 text-white' : 'bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)]'}`}
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => setIsEditingCaption(false)}
                        className="flex-1 py-2 bg-white/5 rounded-lg text-white/50 font-medium text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          const updatedPost = { ...selectedPost, caption: editingCaptionText };
                          setUserPosts(prev => prev.map(p => p.id === selectedPost.id ? updatedPost : p));
                          setSelectedPost(updatedPost);
                          setIsEditingCaption(false);
                        }}
                        className="flex-1 py-2 bg-pink-500/20 rounded-lg text-pink-400 font-medium text-sm"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className={`text-[15px] leading-relaxed whitespace-pre-line ${isDarkTheme ? 'text-white/80' : 'text-[var(--text-primary)]'}`}>
                    {selectedPost.caption || <span className="text-white/30 italic">No caption</span>}
                  </p>
                )}
              </div>

              {/* Edit Actions */}
              <div className={`space-y-3 pt-4 border-t ${isDarkTheme ? 'border-white/5' : 'border-[var(--border-color)]'}`}>
                <button
                  onClick={() => {
                    // Dummy - would open edit mode
                  }}
                  className={`w-full py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${isDarkTheme ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] text-[var(--text-primary)]'}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Add More Photos
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 rounded-xl text-red-400 font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedPost && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className={`rounded-[24px] w-full max-w-sm border shadow-2xl shadow-purple-900/30 overflow-hidden ${isDarkTheme ? 'bg-gradient-to-b from-[#2a1545] to-[#1a0e2e] border-white/10' : 'bg-[var(--bg-primary)] border-[var(--border-color)]'}`}>
            {/* Icon */}
            <div className="pt-8 pb-4 flex justify-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
            </div>

            {/* Message */}
            <div className="px-6 pb-6 text-center">
              <h3 className={`text-xl font-bold mb-2 ${isDarkTheme ? 'text-white' : 'text-[var(--text-primary)]'}`}>Delete this post?</h3>
              <p className={`text-sm leading-relaxed ${isDarkTheme ? 'text-white/50' : 'text-[var(--text-secondary)]'}`}>This magical moment will disappear forever. Are you sure you want to let it go?</p>
            </div>

            {/* Buttons */}
            <div className={`flex border-t ${isDarkTheme ? 'border-white/10' : 'border-[var(--border-color)]'}`}>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className={`flex-1 py-4 font-medium transition-colors ${isDarkTheme ? 'text-white/60 hover:bg-white/5' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'}`}
              >
                Keep it
              </button>
              <div className={`w-px ${isDarkTheme ? 'bg-white/10' : 'bg-[var(--border-color)]'}`} />
              <button
                onClick={() => {
                  setUserPosts(prev => prev.filter(p => p.id !== selectedPost.id));
                  setSelectedPost(null);
                  setIsEditingCaption(false);
                  setShowDeleteConfirm(false);
                }}
                className="flex-1 py-4 text-red-400 font-bold hover:bg-red-500/10 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Toggle: React.FC<{ active: boolean }> = ({ active }) => {
  const { currentTheme } = useTheme();

  const activeColor = {
    'That Orange': 'bg-orange-600',
    'Hot Pink': 'bg-pink-600',
    'More Brown': 'bg-amber-700',
    'Classic Artist Circle Light': 'bg-black'
  }[currentTheme.name] || 'bg-indigo-600';

  return (
    <div className={`w-14 h-8 rounded-full relative transition-colors cursor-pointer ${active ? activeColor : ((currentTheme.name === 'Classic Artist Circle Light' && !active) ? 'bg-gray-200' : 'bg-gray-800')}`}>
      <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform shadow-md ${active ? 'translate-x-6' : 'translate-x-0'}`} />
    </div>
  );
};

export default EditProfileView;