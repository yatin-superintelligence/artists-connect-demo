
import React from 'react';

interface MiniBrowserProps {
  url: string;
  title: string;
  onClose: () => void;
}

const MiniBrowser: React.FC<MiniBrowserProps> = ({ url, title, onClose }) => {
  return (
    <div 
      className="fixed inset-0 z-[300] bg-black/40 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl h-[90vh] bg-white rounded-[40px] shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between px-8 py-6 bg-[#120d1d] border-b border-white/5 text-white">
          <div className="flex items-center gap-5 min-w-0 flex-1">
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center -ml-2 hover:bg-white/10 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex flex-col min-w-0">
              <h2 className="text-[15px] font-black truncate uppercase">{title}</h2>
              <p className="text-[11px] font-bold truncate opacity-30">{url.replace('https://', '')}</p>
            </div>
          </div>
        </header>
        <div className="flex-1 bg-gray-50 flex flex-col items-center justify-center p-12 text-center">
          <h3 className="text-[32px] font-black text-[#120d1d] mb-6">A Sexy Browser Popup Demo</h3>
          <p className="text-gray-500 text-lg font-medium leading-relaxed">This is a sleek integrated browser experience mockup.</p>
          <button onClick={onClose} className="mt-16 bg-[#120d1d] text-white px-12 py-5 rounded-full font-black text-sm tracking-widest uppercase shadow-xl">Back to the app</button>
        </div>
      </div>
    </div>
  );
};

export default MiniBrowser;
