import React, { useState } from 'react';
import { useTheme } from '../theme/ThemeContext';

interface InterestsPickerViewProps {
    selected: string[];
    onBack: () => void;
    onSave: (interests: string[]) => void;
}


import { INTEREST_OPTIONS } from '../data/filterOptions';


const InterestsPickerView: React.FC<InterestsPickerViewProps> = ({ selected, onBack, onSave }) => {
    const { currentTheme } = useTheme();
    const isDarkTheme = currentTheme.name === 'Dark';
    const isLightTheme = currentTheme.name === 'Light';

    const [currentSelected, setCurrentSelected] = useState<string[]>(selected || []);
    const [customInput, setCustomInput] = useState('');

    const toggle = (item: string) => {
        setCurrentSelected(prev =>
            prev.includes(item) ? prev.filter(i => i !== item) : (prev.length < 15 ? [...prev, item] : prev)
        );
    };

    const handleCustomInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.endsWith(',')) {
            const tag = value.slice(0, -1).trim();
            if (tag && currentSelected.length < 15 && !currentSelected.includes(tag)) {
                setCurrentSelected(prev => [...prev, tag]);
            }
            setCustomInput('');
        } else {
            setCustomInput(value);
        }
    };

    const removeInterest = (item: string) => {
        setCurrentSelected(prev => prev.filter(i => i !== item));
    };

    return (
        <div className="fixed inset-0 z-[90] flex flex-col animate-in slide-in-from-right duration-300 bg-[var(--bg-primary)]">
            <header className="flex items-center justify-between p-4 border-b sticky top-0 z-10 bg-[var(--bg-primary)] border-[var(--border-color)]">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className={`p-2 -ml-2 rounded-full transition-colors ${isDarkTheme ? 'hover:bg-white/5' : 'hover:bg-[var(--bg-tertiary)]'}`}>
                        <svg className={`w-6 h-6 ${isDarkTheme ? 'text-white' : 'text-[var(--text-primary)]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className={`text-xl font-bold ${isDarkTheme ? 'text-white' : 'text-[var(--text-primary)]'}`}>Interests</h1>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto px-6 pt-6 pb-40 no-scrollbar">
                <h2 className={`text-3xl font-black mb-4 leading-tight ${isDarkTheme ? 'text-white' : 'text-[var(--text-primary)]'}`}>What inspires you?</h2>
                <p className={`text-[15px] mb-8 leading-snug ${isDarkTheme ? 'text-white/60' : 'text-[var(--text-secondary)]'}`}>
                    Select from the list or add your own specific interests below.
                </p>

                {/* Selected Interests Area with Custom Input */}
                <div className={`p-5 rounded-[24px] mb-10 border ${isDarkTheme ? 'bg-white/5 border-white/10' : 'bg-[var(--bg-tertiary)] border-[var(--border-color)]'}`}>
                    <div className="flex flex-wrap gap-2.5 mb-4">
                        {currentSelected.map(tag => (
                            <div key={tag} className={`flex items-center gap-2 px-4 py-2 rounded-full text-[14px] font-bold group ${isLightTheme ? 'bg-white border border-gray-200 text-black' : 'bg-white/10 border border-white/20 text-white'}`}>
                                <span>{tag}</span>
                                <button onClick={() => removeInterest(tag)} className={isLightTheme ? 'text-gray-400 hover:text-red-500' : 'text-white/30 hover:text-white'}>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                    <input
                        type="text"
                        value={customInput}
                        onChange={handleCustomInput}
                        placeholder="Type a custom interest, then comma..."
                        className="w-full bg-transparent border-b border-[var(--border-color)] py-3 outline-none text-[var(--text-primary)] text-[16px] placeholder:text-[var(--text-secondary)] focus:border-indigo-500/50 transition-colors"
                    />
                </div>

                {INTEREST_OPTIONS.map((section) => (
                    <div key={section.title} className="mb-10">
                        <h3 className={`text-[13px] font-black uppercase tracking-widest mb-4 ${isDarkTheme ? 'text-white/40' : 'text-[var(--text-secondary)]'}`}>{section.title}</h3>
                        <div className="flex flex-wrap gap-2.5">
                            {section.items.map((item) => {
                                const isActive = currentSelected.includes(item);
                                return (
                                    <button
                                        key={item}
                                        onClick={() => toggle(item)}
                                        className={`px-5 py-2.5 rounded-full text-[14px] font-bold border transition-all active:scale-95 ${isActive
                                            ? (isLightTheme
                                                ? 'bg-black text-white border-black'
                                                : 'bg-white text-black border-white')
                                            : (isLightTheme
                                                ? 'bg-black/5 text-black border-black/10'
                                                : 'bg-white/5 text-white/80 border-white/10')
                                            }`}
                                    >
                                        {item}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <div className={`fixed bottom-12 left-0 right-0 px-8 flex justify-center pointer-events-none`}>
                <button
                    onClick={() => onSave(currentSelected)}
                    className={`pointer-events-auto font-black px-12 py-5 rounded-full text-lg shadow-2xl active:scale-95 transition-transform ${isLightTheme ? 'bg-black text-white' : 'bg-white text-black'}`}
                >
                    Save ({currentSelected.length})
                </button>
            </div>
        </div>
    );
};

export default InterestsPickerView;
