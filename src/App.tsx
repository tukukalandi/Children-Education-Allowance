import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, GraduationCap, FileText, CheckCircle2, AlertCircle, Maximize2, Minimize2 } from 'lucide-react';
import { SLIDES } from './constants';

const INDIA_POST_RED = '#D41217';
const INDIA_POST_YELLOW = '#FFD700';

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const nextSlide = () => {
    if (currentIndex < SLIDES.length - 1) {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const togglePresentationMode = () => {
    setIsPresentationMode(!isPresentationMode);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      // Automatically enter presentation mode when entering fullscreen
      if (document.fullscreenElement) {
        setIsPresentationMode(true);
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'f') toggleFullscreen();
      if (e.key === 'p') togglePresentationMode();
      if (e.key === 'Escape' && isPresentationMode && !isFullscreen) {
        setIsPresentationMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isPresentationMode, isFullscreen]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-gray-100 flex flex-col font-sans overflow-hidden">
      {/* Header */}
      {!isPresentationMode && (
        <header 
          className="h-16 sm:h-20 flex items-center justify-between px-4 sm:px-6 shadow-md z-10 shrink-0"
          style={{ backgroundColor: INDIA_POST_RED }}
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-white p-1 rounded shadow-sm">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/800px-Emblem_of_India.svg.png" 
                alt="National Emblem" 
                className="h-8 sm:h-12 w-auto"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-white">
              <h1 className="text-sm sm:text-lg font-bold leading-tight">DEPARTMENT OF POSTS</h1>
              <p className="text-[10px] sm:text-xs opacity-90">Government of India</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="text-right hidden sm:block">
              <h2 className="text-white font-bold text-sm">भारतीय डाक</h2>
              <p className="text-white text-xs opacity-90">India Post</p>
            </div>
            <div className="bg-white p-1 rounded shadow-sm">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/b/be/India-post-logo.jpg" 
                alt="India Post Logo" 
                className="h-8 sm:h-12 w-auto"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </header>
      )}

      {/* Main Slide Area */}
      <main className="flex-1 relative flex items-center justify-center p-2 sm:p-8 overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="absolute inset-0 flex items-center justify-center p-2 sm:p-8"
          >
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden max-w-5xl w-full h-full sm:h-auto sm:aspect-video flex flex-col md:flex-row border-t-4 sm:border-t-8" style={{ borderColor: INDIA_POST_YELLOW }}>
              {/* Left Content Side */}
              <div className="flex-1 p-4 sm:p-8 flex flex-col justify-center bg-gradient-to-br from-white to-gray-50 overflow-y-auto">
                <div className="mb-2 sm:mb-4 inline-flex items-center gap-2 px-2 sm:px-3 py-1 rounded-full bg-red-50 text-red-700 text-[10px] sm:text-xs font-bold uppercase tracking-wider w-fit">
                  <GraduationCap size={14} />
                  CEA Guide 2024-25
                </div>
                <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-3 sm:mb-6 leading-tight">
                  {SLIDES[currentIndex].title}
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed mb-4 sm:mb-8">
                  {SLIDES[currentIndex].description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-8">
                  {SLIDES[currentIndex].points?.map((point, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="flex items-center gap-2 text-[11px] sm:text-sm text-gray-700 bg-gray-50 p-1.5 sm:p-2 rounded-lg border border-gray-100"
                    >
                      <CheckCircle2 size={14} className="text-green-500 shrink-0" />
                      <span className="font-medium">{point}</span>
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-auto flex items-center gap-2 sm:gap-4 pt-4 border-t border-gray-100 sm:border-0">
                  <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-sm font-medium text-gray-500">
                    <FileText size={14} />
                    <span className="whitespace-nowrap">Slide {currentIndex + 1} / {SLIDES.length}</span>
                  </div>
                  <div className="h-1 flex-1 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full" 
                      style={{ backgroundColor: INDIA_POST_RED }}
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentIndex + 1) / SLIDES.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Right Image Side */}
              <div className="h-1/3 md:h-full md:flex-1 relative">
                <img 
                  src={SLIDES[currentIndex].image} 
                  alt={SLIDES[currentIndex].title}
                  className="absolute inset-0 w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-transparent to-white/10" />
                
                {/* Decorative Elements */}
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex gap-1 sm:gap-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-white/50" />
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-white/30" />
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-white/10" />
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 sm:px-6 pointer-events-none z-30">
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className={`group flex items-center gap-1 sm:gap-2 p-2 sm:p-4 rounded-full shadow-2xl transition-all pointer-events-auto ${
              currentIndex === 0 
                ? 'bg-gray-100 text-gray-300 cursor-not-allowed opacity-50' 
                : 'bg-white text-gray-800 hover:scale-110 active:scale-95 hover:bg-gray-50'
            }`}
            style={currentIndex !== 0 ? { color: INDIA_POST_RED } : {}}
            title="Previous Slide"
          >
            <ChevronLeft size={32} className="w-8 h-8 sm:w-10 sm:h-10" />
            <span className="hidden sm:block font-black pr-2 text-xs sm:text-sm">PREV</span>
          </button>
          <button
            onClick={nextSlide}
            disabled={currentIndex === SLIDES.length - 1}
            className={`group flex items-center gap-1 sm:gap-2 p-2 sm:p-4 rounded-full shadow-2xl transition-all pointer-events-auto ${
              currentIndex === SLIDES.length - 1 
                ? 'bg-gray-100 text-gray-300 cursor-not-allowed opacity-50' 
                : 'bg-white text-gray-800 hover:scale-110 active:scale-95 hover:bg-gray-50'
            }`}
            style={currentIndex !== SLIDES.length - 1 ? { color: INDIA_POST_RED } : {}}
            title="Next Slide"
          >
            <span className="hidden sm:block font-black pl-2 text-xs sm:text-sm">NEXT</span>
            <ChevronRight size={32} className="w-8 h-8 sm:w-10 sm:h-10" />
          </button>
        </div>
      </main>

      {/* Footer / Progress Bar */}
      {!isPresentationMode && (
        <footer className="h-16 sm:h-20 bg-white border-t flex items-center justify-between px-4 sm:px-8 gap-4 shadow-inner shrink-0">
          <button 
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="flex items-center gap-1 px-2 sm:px-4 py-2 rounded-lg text-[10px] sm:text-sm font-black transition-all hover:bg-gray-50 disabled:opacity-20 active:scale-95"
            style={{ color: INDIA_POST_RED }}
          >
            <ChevronLeft size={16} className="sm:w-5 sm:h-5" /> PREV
          </button>

          <div className="flex gap-1 sm:gap-2">
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                }}
                className={`w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full transition-all ${
                  idx === currentIndex ? 'w-4 sm:w-8' : 'hover:bg-gray-300'
                }`}
                style={{ backgroundColor: idx === currentIndex ? INDIA_POST_RED : '#E5E7EB' }}
              />
            ))}
          </div>

          <button 
            onClick={nextSlide}
            disabled={currentIndex === SLIDES.length - 1}
            className="flex items-center gap-1 px-2 sm:px-4 py-2 rounded-lg text-[10px] sm:text-sm font-black transition-all hover:bg-gray-50 disabled:opacity-20 active:scale-95"
            style={{ color: INDIA_POST_RED }}
          >
            NEXT <ChevronRight size={16} className="sm:w-5 sm:h-5" />
          </button>
        </footer>
      )}

      {/* Quick Info Bar */}
      <div className="bg-gray-900 text-white py-1.5 sm:py-2 px-4 flex justify-between items-center text-[8px] sm:text-[10px] uppercase tracking-widest font-bold shrink-0">
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="flex items-center gap-1"><CheckCircle2 size={10} className="text-green-400" /> Official Guide</span>
          <span className="hidden sm:flex items-center gap-1"><AlertCircle size={10} className="text-yellow-400" /> Updated 2024</span>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <button 
            onClick={togglePresentationMode}
            className="hover:text-yellow-400 transition-colors flex items-center gap-1"
          >
            <FileText size={12} />
            {isPresentationMode ? 'Exit PPT (P)' : 'PPT Mode (P)'}
          </button>
          <button 
            onClick={toggleFullscreen}
            className="hover:text-yellow-400 transition-colors flex items-center gap-1"
          >
            {isFullscreen ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
            <span className="hidden sm:inline">{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen (F)'}</span>
          </button>
          <span className="hidden xs:inline">© India Post</span>
        </div>
      </div>
    </div>
  );
}
