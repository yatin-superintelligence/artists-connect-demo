
import React, { useRef } from 'react';

interface UpliftViewProps {
  onClose: () => void;
}

const UpliftView: React.FC<UpliftViewProps> = ({ onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentDragY = useRef(0);
  const isDragging = useRef(false);
  const dragLock = useRef<'none' | 'vertical' | 'scrolling'>('none');

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const target = e.target as HTMLElement;
    const isHandle = !!target.closest('.drag-handle-zone');

    startY.current = clientY;
    isDragging.current = true;
    currentDragY.current = 0;
    dragLock.current = isHandle ? 'vertical' : 'none';

    if (modalRef.current) {
      modalRef.current.style.transition = 'none';
    }
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging.current || dragLock.current === 'scrolling') return;

    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const deltaY = clientY - startY.current;

    if (dragLock.current === 'none') {
      if (deltaY > 5) {
        dragLock.current = 'vertical';
      } else {
        dragLock.current = 'scrolling';
        isDragging.current = false;
        return;
      }
    }

    if (dragLock.current === 'vertical') {
      if (e.cancelable) e.preventDefault();
      const newY = Math.max(0, deltaY);
      currentDragY.current = newY;
      if (modalRef.current) {
        modalRef.current.style.transform = `translate3d(0, ${newY}px, 0)`;
      }
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) {
      dragLock.current = 'none';
      return;
    }
    isDragging.current = false;

    if (dragLock.current === 'vertical') {
      if (currentDragY.current > 120) {
        // Animate out and close
        if (modalRef.current) {
          modalRef.current.style.transition = 'transform 250ms ease-out';
          modalRef.current.style.transform = 'translate3d(0, 100%, 0)';
        }
        setTimeout(onClose, 250);
      } else {
        // Snap back
        if (modalRef.current) {
          modalRef.current.style.transition = 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1)';
          modalRef.current.style.transform = 'translate3d(0, 0, 0)';
        }
      }
    }
    dragLock.current = 'none';
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col justify-end bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={modalRef}
        className="bg-gradient-to-b from-[#1e40af]/30 via-[#0a0118] to-[#0a0118] w-full h-auto max-h-[90vh] rounded-t-[40px] flex flex-col overflow-hidden shadow-2xl transform-gpu border-t border-white/5"
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Handlebar Area */}
        <div className="drag-handle-zone w-full flex justify-center pt-4 pb-2 cursor-grab active:cursor-grabbing flex-shrink-0">
          <div className="w-12 h-1.5 bg-white/40 rounded-full" />
        </div>

        <div className="px-7 pt-4 flex-1 overflow-y-auto no-scrollbar pb-10">
          {/* Branding & Heading */}
          <div className="flex flex-col mb-2">
            <span className="text-[12px] font-black text-white/90 tracking-[0.15em] mb-2 uppercase">ARTIST CIRCLE</span>
            <div className="flex items-start justify-between">
              <h1 className="text-[36px] font-bold text-white tracking-tight leading-[1.05] max-w-[240px]">
                Be found with Uplift
              </h1>
              <div className="text-white pt-2">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="w-full h-[1px] bg-white/20 mb-5" />

          {/* Description */}
          <p className="text-white/80 text-[16px] leading-[1.35] mb-5 font-medium">
            Your profile will show up earlier to people around you for the next 24 hours, increasing your chances of making connections by 7 to 15 times.
          </p>

          {/* Pricing Box */}
          <div className="border border-white/40 rounded-[14px] p-5 flex justify-between items-center mb-5 bg-white/[0.02]">
            <span className="text-[20px] font-bold text-white">Uplift</span>
            <div className="text-right">
              <div className="text-[20px] font-bold text-white">₹299.00</div>
              <div className="text-[13px] text-white/50 font-medium">24 hours</div>
            </div>
          </div>

          {/* Confirmation Text */}
          <p className="text-white/50 text-[13px] leading-tight text-center mb-4 max-w-[260px] mx-auto">
            Your profile will be Uplifted immediately after your purchase is confirmed.
          </p>

          {/* Actions */}
          <div className="flex flex-col items-center gap-4">
            <button className="w-full max-w-[200px] bg-[#4f46e5] text-white py-4 rounded-full font-bold text-[17px] shadow-2xl active:scale-[0.98] transition-all">
              Purchase
            </button>

            <button
              onClick={onClose}
              className="text-white/80 font-bold text-[16px] hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default UpliftView;
