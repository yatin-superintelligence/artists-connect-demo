import React from 'react';

interface AcknowledgementViewProps {
    onAcknowledge: () => void;
}

const AcknowledgementView: React.FC<AcknowledgementViewProps> = ({ onAcknowledge }) => {
    return (
        <div className="fixed inset-0 z-[9999] bg-[#0a0118] text-white flex flex-col items-center justify-center p-6 overflow-y-auto">
            <div className="max-w-2xl w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl animate-in fade-in zoom-in-95 duration-500">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                        Artists Connect
                    </h1>
                    <div className="inline-block px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-200 text-xs font-bold tracking-wider uppercase">
                        Prototype Demo
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-6 text-gray-300 leading-relaxed text-sm md:text-base mb-10">
                    <p className="font-medium text-white text-lg">
                        Welcome! Before you enter, please note the following details about this application:
                    </p>

                    <ul className="space-y-4 list-disc pl-5 marker:text-purple-500">
                        <li>
                            <strong className="text-white">Concept & Development:</strong> This application is a high-fidelity prototype designed and developed by <strong className="text-white">Yatin Taneja</strong>. It mimics a real social networking platform for artists.
                        </li>

                        <li>
                            <strong className="text-white">Technology Stack:</strong> Built using modern web technologies including <span className="text-indigo-300">React</span>, <span className="text-indigo-300">TypeScript</span>, and <span className="text-indigo-300">Tailwind CSS</span>. It is optimized for performance and responsiveness across all devices (Mobile, Tablet, Desktop).
                        </li>

                        <li>
                            <strong className="text-white">Simulated Environment:</strong> All profiles, chats, and interactions within this app are <strong>mock data</strong>. No real user accounts are created, and no personal information is stored or transmitted.
                        </li>

                        <li>
                            <strong className="text-white">Privacy & Assets:</strong> All images and videos used in this demo are royalty-free stock assets sourced from <a href="https://www.pexels.com" target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:underline">Pexels.com</a>. They are used solely for demonstration purposes and do not represent real users.
                        </li>

                        <li>
                            <strong className="text-white">Interaction:</strong> The interface is fully interactive. You can swipe, click, type, and navigate just like a native app. It supports Touch, Mouse, and Trackpad inputs.
                        </li>
                    </ul>
                </div>

                {/* Action */}
                <div className="flex flex-col items-center gap-4">
                    <button
                        onClick={onAcknowledge}
                        className="group relative w-full md:w-auto px-12 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full font-bold text-lg shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95 hover:shadow-indigo-500/50"
                    >
                        <span className="relative z-10">Acknowledge & Enter App</span>
                        <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>

                    <p className="text-xs text-white/40 text-center max-w-sm">
                        By clicking above, you acknowledge that this is a portfolio demonstration project.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default AcknowledgementView;
