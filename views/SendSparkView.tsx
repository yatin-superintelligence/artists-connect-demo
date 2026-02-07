import React, { useState, useRef } from 'react';

interface SendSparkViewProps {
  onClose: () => void;
  onOpenPro: () => void;
}

const SendSparkView: React.FC<SendSparkViewProps> = ({ onClose, onOpenPro }) => {
  const [selectedPlan, setSelectedPlan] = useState<number>(1);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const startY = useRef(0);
  const dragLock = useRef<'none' | 'vertical' | 'scrolling'>('none');
  const currentDragY = useRef(0); // Added currentDragY ref

  const plans = [
    { count: 1, label: 'SPARK', price: '₹59.00', discount: null },
    { count: 5, label: 'SPARKS', price: '₹275.00', discount: '6% off' },
    { count: 10, label: 'SPARKS', price: '₹445.00', discount: '24% off' }
  ];

  // Ref for the modal to modify transform directly
  const modalRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const target = e.target as HTMLElement;
    const isHandle = !!target.closest('.drag-handle-zone');

    if (isHandle) {
      startY.current = clientY;
      setIsDragging(true);
      dragLock.current = 'vertical';
      currentDragY.current = 0; // Reset currentDragY on start
      if (modalRef.current) modalRef.current.style.transition = 'none';
    }
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging || dragLock.current !== 'vertical') return;

    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const deltaY = clientY - startY.current;

    if (e.cancelable) e.preventDefault();

    const val = Math.max(0, deltaY);
    currentDragY.current = val; // Update currentDragY

    // Direct DOM manipulation
    if (modalRef.current) {
      modalRef.current.style.transform = `translate3d(0, ${val}px, 0)`;
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    dragLock.current = 'none';

    // Restore transition
    if (modalRef.current) {
      modalRef.current.style.transition = 'transform 400ms cubic-bezier(0.16, 1, 0.3, 1)';
    }

    // Check currentDragY to decide whether to close or snap back
    if (currentDragY.current > 120) {
      setIsClosing(true);
      if (modalRef.current) modalRef.current.style.transform = `translate3d(0, 100%, 0)`;
      setTimeout(onClose, 250);
    } else {
      if (modalRef.current) modalRef.current.style.transform = `translate3d(0, 0, 0)`;
      currentDragY.current = 0; // Reset currentDragY
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[200] flex flex-col justify-end bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={modalRef}
        className={`bg-gradient-to-b from-[#7c3aed] via-[#0a0118] to-[#0a0118] w-full h-[92vh] rounded-t-[40px] flex flex-col overflow-hidden shadow-2xl transform-gpu transition-transform duration-[400ms] cubic-bezier(0.16, 1, 0.3, 1)`}
        style={{ transform: isClosing ? 'translate3d(0, 100%, 0)' : 'translate3d(0, 0, 0)' }}
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

        <div className="px-6 pt-4 flex-1 overflow-y-auto no-scrollbar pb-12">
          <div className="flex flex-col mb-6">
            <span className="text-[11px] font-black text-white/90 tracking-widest mb-2 uppercase">ARTIST CIRCLE</span>
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-bold text-white tracking-tight">Send them a Spark</h1>
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="w-full h-[1px] bg-white/30 mt-6" />
          </div>

          <p className="text-white/80 text-[17px] leading-relaxed mb-10 font-medium">
            They'll immediately be notified you like them, and you'll float to the top of their Sparks page. You can even add a cute note with an intro. It's no wonder Sparks increase your chances of connecting by 5x.
          </p>

          {/* Pricing Grid */}
          <div className="grid grid-cols-3 gap-3 mb-12">
            {plans.map((plan, i) => {
              const isActive = selectedPlan === i;
              return (
                <div
                  key={i}
                  onClick={() => setSelectedPlan(i)}
                  className={`rounded-2xl p-4 h-40 flex flex-col justify-between transition-all cursor-pointer border-2 ${isActive
                    ? 'bg-white text-black border-white'
                    : 'bg-[#140c26]/60 border-white/10 text-white'
                    }`}
                >
                  <div>
                    <div className={`text-[10px] font-black tracking-widest uppercase mb-1 ${isActive ? 'opacity-60' : 'opacity-40'}`}>
                      {plan.count} {plan.label}
                    </div>
                    <div className="text-[22px] font-bold tracking-tighter">
                      {plan.price}
                    </div>
                  </div>

                  {plan.discount && (
                    <div className={`py-1.5 px-2 rounded-lg text-[10px] font-black text-center ${isActive ? 'bg-black text-white' : 'bg-white/10 text-white border border-white/10'}`}>
                      {plan.discount}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex flex-col items-center gap-2 mb-12">
            <button
              onClick={onOpenPro}
              className="text-white/90 text-sm font-bold underline underline-offset-4 decoration-white/30"
            >
              Become an Artist Pro and get 1 free Spark a day.
            </button>
            <span className="text-white/40 text-xs font-bold">Purchased Sparks never expire.</span>
          </div>

          <div className="flex flex-col items-center gap-8 px-4">
            <button className="w-full bg-[#4c1d95] text-white py-5 rounded-full font-black text-lg shadow-2xl active:scale-[0.98] transition-all">
              Purchase Sparks
            </button>

            <button
              onClick={onClose}
              className="text-white/60 font-bold text-lg hover:text-white transition-colors pb-6"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendSparkView;