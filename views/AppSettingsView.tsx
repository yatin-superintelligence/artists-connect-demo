
import React, { useState } from 'react';
import AppIconView from './AppIconView';
import { useTheme } from '../theme/ThemeContext';

interface AppSettingsViewProps {
  onBack: () => void;
}

const LoginMethodRow: React.FC<{ label: string; status?: string }> = ({ label, status }) => (
  <button className="w-full flex items-center justify-between p-6 active:bg-[var(--bg-tertiary)] transition-colors group">
    <span className="text-lg font-bold text-[var(--text-primary)]">{label}</span>
    <div className="flex items-center gap-3">
      {status && <span className="text-[var(--text-secondary)] text-sm font-medium">{status}</span>}
      <svg className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  </button>
);

const ToggleRow: React.FC<{ label: string; sub?: string; active: boolean; onToggle: () => void }> = ({ label, sub, active, onToggle }) => {
  const { currentTheme } = useTheme();

  const getToggleColor = () => {
    switch (currentTheme.name) {
      case 'That Orange': return 'bg-orange-600';
      case 'Hot Pink': return 'bg-pink-600';
      case 'More Brown': return 'bg-amber-700';
      case 'Classic Artist Circle Light': return 'bg-black';
      default: return 'bg-[#4c1d95]';
    }
  };

  return (
    <div onClick={onToggle} className="p-6 flex items-start justify-between gap-4 active:bg-[var(--bg-tertiary)] transition-colors cursor-pointer">
      <div className="flex-1 space-y-2">
        <h3 className="text-lg font-bold leading-tight text-[var(--text-primary)]">{label}</h3>
        {sub && <p className="text-sm text-[var(--text-secondary)] leading-snug font-medium pr-4">{sub}</p>}
      </div>
      <div className={`w-14 h-8 rounded-full relative transition-colors flex-shrink-0 mt-0.5 ${active ? getToggleColor() : 'bg-[var(--bg-tertiary)] border border-[var(--border-color)]'}`}>
        <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform shadow-md ${active ? 'translate-x-6' : 'translate-x-0'}`} />
      </div>
    </div>
  );
};

export default function AppSettingsView({ onBack }: AppSettingsViewProps) {
  const { currentTheme, setThemeName } = useTheme();
  const [disableCalls, setDisableCalls] = useState(false);
  const [disableNotifications, setDisableNotifications] = useState(false);
  const [receiveUpdates, setReceiveUpdates] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [showAppIcon, setShowAppIcon] = useState(false);
  const [selectedIconId, setSelectedIconId] = useState('midnight');

  const ICON_NAMES: Record<string, string> = {
    midnight: 'Midnight Artist Circle',
    aurora: 'Aurora',
    heart: 'Heart',
    magenta: 'Magenta',
    azure: 'Azure',
    classic: 'Classic',
    neon: 'Neon'
  };

  if (showAppIcon) {
    return (
      <AppIconView
        onBack={() => setShowAppIcon(false)}
        selectedIcon={selectedIconId}
        onSelect={(id) => setSelectedIconId(id)}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-[var(--bg-primary)] z-[120] flex flex-col animate-in slide-in-from-right duration-300 overflow-hidden">
      {/* Header */}
      <header className="flex items-center gap-4 p-4 sticky top-0 bg-[var(--bg-primary)] z-10">
        <button onClick={onBack} className="p-1 -ml-1 hover:bg-[var(--bg-tertiary)] rounded-full transition-colors text-[var(--text-primary)]">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-[var(--text-primary)]">App settings</h1>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-8 pb-12">
        {/* Login Methods */}
        <section className="space-y-3">
          <h2 className="text-[17px] font-medium text-[var(--text-secondary)] px-1">Sign-in options</h2>
          <div className="bg-[var(--bg-secondary)] rounded-[24px] overflow-hidden divide-y divide-[var(--border-color)] border border-[var(--border-color)]">
            <LoginMethodRow label="Email" />
            <LoginMethodRow label="Mobile number" status="Off" />
            <LoginMethodRow label="Google" status="On" />
            <LoginMethodRow label="Facebook" status="Off" />
          </div>
        </section>

        {/* Privacy and Safety */}
        <section className="space-y-3">
          <h2 className="text-[17px] font-medium text-[var(--text-secondary)] px-1">Privacy & security</h2>
          <div className="bg-[var(--bg-secondary)] rounded-[24px] overflow-hidden divide-y divide-[var(--border-color)] border border-[var(--border-color)]">
            <ToggleRow
              label="Disable voice & video calls"
              sub="Prevents others from calling you directly."
              active={disableCalls}
              onToggle={() => setDisableCalls(!disableCalls)}
            />
            <ToggleRow
              label="Disable notifications"
              sub="Pause all push notifications and alerts from the app."
              active={disableNotifications}
              onToggle={() => setDisableNotifications(!disableNotifications)}
            />
          </div>
        </section>

        {/* Notifications */}
        <section className="space-y-3">
          <h2 className="text-[17px] font-medium text-[var(--text-secondary)] px-1">Alerts & updates</h2>
          <div className="bg-[var(--bg-secondary)] rounded-[24px] overflow-hidden divide-y divide-[var(--border-color)] border border-[var(--border-color)]">
            <ToggleRow
              label="Artist Circle updates"
              sub="Get notified about new features, events, and opportunities."
              active={receiveUpdates}
              onToggle={() => setReceiveUpdates(!receiveUpdates)}
            />
            <button className="w-full text-left p-6 text-[#c084fc] font-bold text-lg active:bg-[var(--bg-tertiary)] transition-colors">
              Clear unread chat alerts
            </button>
          </div>
        </section>


        {/* Account Settings */}
        <section className="space-y-1">
          <h2 className="text-[17px] font-medium text-[var(--text-secondary)] px-1 mb-2">Account management</h2>
          <button className="w-full text-left py-4 px-1 text-lg font-medium text-[var(--text-primary)] active:bg-[var(--bg-tertiary)] transition-colors">Sign out</button>
          <div className="h-px bg-[var(--border-color)] w-full" />
          <button className="w-full text-left py-4 px-1 text-[#c084fc] text-lg font-medium active:bg-[var(--bg-tertiary)] transition-colors">Temporarily pause account</button>
          <div className="h-px bg-[var(--border-color)] w-full" />
          <button className="w-full text-left py-4 px-1 text-[#c084fc] text-lg font-medium active:bg-[var(--bg-tertiary)] transition-colors">Delete account</button>
        </section>

        {/* Version */}
        <footer className="pt-8">
          <p className="text-[var(--text-secondary)] text-sm font-medium px-1">Version 11.11 Mock Build by Yatin Taneja</p>
        </footer>
      </div>
    </div>
  );
}
