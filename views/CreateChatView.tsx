import React, { useState } from 'react';
import { Profile, Connection } from '../types';

interface CreateChatViewProps {
  connections: Connection[];
  userImage?: string;
  onClose: () => void;
  onCreateGroup: (name: string, members: Profile[]) => void;
  initialSelectedIds?: string[];
}

const CreateChatView: React.FC<CreateChatViewProps> = ({ connections, userImage, onClose, onCreateGroup, initialSelectedIds }) => {
  const [step, setStep] = useState<'select' | 'name'>('select');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(initialSelectedIds));
  const [groupName, setGroupName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter out existing group chats for selection
  const individualConnections = connections.filter(c => !c.isGroup);
  const filteredConnections = individualConnections.filter(c =>
    c.profile.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => {
    const aSelected = selectedIds.has(a.id);
    const bSelected = selectedIds.has(b.id);
    if (aSelected && !bSelected) return -1;
    if (!aSelected && bSelected) return 1;
    return 0;
  });

  const toggleMember = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else if (next.size < 24) next.add(id);
    setSelectedIds(next);
  };

  const handleContinue = () => {
    if (selectedIds.size > 0) {
      setStep('name');
    }
  };

  const handleCreate = () => {
    if (groupName.trim() && selectedIds.size > 0) {
      const selectedMembers = individualConnections
        .filter(c => selectedIds.has(c.id))
        .map(c => c.profile);
      onCreateGroup(groupName, selectedMembers);
    }
  };

  const selectedMembers = individualConnections
    .filter(c => selectedIds.has(c.id))
    .map(c => c.profile);

  // Collage images including the user
  const collageImages = userImage ? [userImage, ...selectedMembers.map(m => m.images[0])] : selectedMembers.map(m => m.images[0]);

  return (
    <div className="fixed inset-0 bg-[var(--bg-primary)] z-[80] flex flex-col animate-in slide-in-from-bottom duration-300">
      {/* Header */}
      <header className="p-4 flex justify-end">
        <button onClick={onClose} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </header>

      <div className="px-6 flex-1 flex flex-col overflow-hidden">
        <h1 className="text-3xl font-bold mb-6">
          {step === 'select' ? 'Create chat' : 'Group name'}
        </h1>

        {step === 'select' ? (
          <>
            <div className="relative mb-8">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search connections"
                className="w-full bg-[var(--bg-tertiary)] rounded-2xl py-4 pl-12 pr-4 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] outline-none border border-transparent focus:border-[var(--border-color)]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-400">Members</h2>
              <span className="text-gray-500 text-sm font-bold">{selectedIds.size}/24</span>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
              {filteredConnections.map((conn) => (
                <div
                  key={conn.id}
                  onClick={() => toggleMember(conn.id)}
                  className="flex items-center gap-4 py-2 cursor-pointer group"
                >
                  <img src={conn.profile.images[0]} className="w-16 h-16 rounded-full object-cover" alt="" />
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <h3 className="font-bold text-lg">{conn.profile.name}</h3>
                      {conn.profile.isPro && <div className="w-4 h-4 bg-[#4c1d95] rounded-full flex items-center justify-center text-[10px] text-white font-bold">P</div>}
                    </div>
                    <div className="text-sm text-gray-500 font-medium">
                      {conn.profile.age} • {conn.profile.artistTypes?.[0] || 'Artist'}
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${selectedIds.has(conn.id) ? 'bg-[var(--text-primary)] border-[var(--text-primary)]' : 'border-[var(--border-color)]'
                    }`}>
                    {selectedIds.has(conn.id) && (
                      <svg className="w-4 h-4 text-[var(--bg-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {selectedIds.size > 0 && (
              <div className="absolute bottom-12 left-0 right-0 flex justify-center px-6">
                <button
                  onClick={handleContinue}
                  className="bg-white text-black font-extrabold px-12 py-5 rounded-full text-lg shadow-2xl animate-in fade-in zoom-in duration-200"
                >
                  Continue
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col pt-4">
            <div className="flex items-center gap-6 mb-8">
              <div className="relative w-24 h-24 flex-shrink-0">
                {/* Default Group Icon using member DPs AND Roxanne's */}
                <div className="w-full h-full bg-[var(--bg-tertiary)] rounded-[28px] overflow-hidden border-2 border-[var(--border-color)] grid grid-cols-2">
                  {collageImages.slice(0, 4).map((img, i) => (
                    <img key={i} src={img} className="w-full h-full object-cover opacity-60" />
                  ))}
                </div>
                <button className="absolute -bottom-1 -right-1 w-9 h-9 bg-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg active:scale-90 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>
              <div className="flex-1">
                <input
                  autoFocus
                  type="text"
                  placeholder="Give your group a name"
                  className="w-full bg-transparent text-2xl font-bold py-4 outline-none border-b-2 border-white/10 focus:border-indigo-500 transition-colors"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
              </div>
            </div>

            <p className="text-gray-500 text-sm">
              This name will be visible to all members of the chat.
            </p>

            <div className="mt-auto pb-12">
              <button
                onClick={handleCreate}
                disabled={!groupName.trim()}
                className={`w-full py-5 rounded-full font-extrabold text-lg transition-all ${groupName.trim() ? 'bg-indigo-600 text-white shadow-xl' : 'bg-white/5 text-white/20 cursor-not-allowed'
                  }`}
              >
                Create Group
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateChatView;