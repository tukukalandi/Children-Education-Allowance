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

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
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
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

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
      <header 
        className="h-20 flex items-center justify-between px-6 shadow-md z-10"
        style={{ backgroundColor: INDIA_POST_RED }}
      >
        <div className="flex items-center gap-3">
          <div className="bg-white p-1 rounded shadow-sm">
            {/* Indian National Emblem Placeholder */}
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/800px-Emblem_of_India.svg.png" 
              alt="National Emblem" 
              className="h-12 w-auto"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="text-white">
            <h1 className="text-lg font-bold leading-tight">DEPARTMENT OF POSTS</h1>
            <p className="text-xs opacity-90">Government of India</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <h2 className="text-white font-bold text-sm">भारतीय डाक</h2>
            <p className="text-white text-xs opacity-90">India Post</p>
          </div>
          <div className="bg-white p-1 rounded shadow-sm">
            {/* India Post Logo */}
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/b/be/India-post-logo.jpg" 
              alt="India Post Logo" 
              className="h-12 w-auto"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </header>

      {/* Main Slide Area */}
      <main className="flex-1 relative flex items-center justify-center p-4 sm:p-8">
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
            className="absolute inset-0 flex items-center justify-center p-4 sm:p-8"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-5xl w-full aspect-video flex flex-col sm:flex-row border-t-8" style={{ borderColor: INDIA_POST_YELLOW }}>
              {/* Left Content Side */}
              <div className="flex-1 p-8 flex flex-col justify-center bg-gradient-to-br from-white to-gray-50">
                <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold uppercase tracking-wider">
                  <GraduationCap size={14} />
                  CEA Guide 2024-25
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-6 leading-tight">
                  {SLIDES[currentIndex].title}
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                  {SLIDES[currentIndex].description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {SLIDES[currentIndex].points?.map((point, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-2 rounded-lg border border-gray-100"
                    >
                      <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                      <span className="font-medium">{point}</span>
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-auto flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                    <FileText size={16} />
                    <span>Slide {currentIndex + 1} of {SLIDES.length}</span>
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
              <div className="flex-1 relative hidden md:block">
                <img 
                  src={SLIDES[currentIndex].image} 
                  alt={SLIDES[currentIndex].title}
                  className="absolute inset-0 w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white/10" />
                
                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-white/50" />
                  <div className="w-3 h-3 rounded-full bg-white/30" />
                  <div className="w-3 h-3 rounded-full bg-white/10" />
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
      <footer className="h-20 bg-white border-t flex items-center justify-between px-4 sm:px-8 gap-4 shadow-inner">
        <button 
          onClick={prevSlide}
          disabled={currentIndex === 0}
          className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-black transition-all hover:bg-gray-50 disabled:opacity-20 active:scale-95"
          style={{ color: INDIA_POST_RED }}
        >
          <ChevronLeft size={20} /> PREV
        </button>

        <div className="flex gap-2">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
              }}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                idx === currentIndex ? 'w-8' : 'hover:bg-gray-300'
              }`}
              style={{ backgroundColor: idx === currentIndex ? INDIA_POST_RED : '#E5E7EB' }}
            />
          ))}
        </div>

        <button 
          onClick={nextSlide}
          disabled={currentIndex === SLIDES.length - 1}
          className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-black transition-all hover:bg-gray-50 disabled:opacity-20 active:scale-95"
          style={{ color: INDIA_POST_RED }}
        >
          NEXT <ChevronRight size={20} />
        </button>
      </footer>

      {/* Quick Info Bar */}
      <div className="bg-gray-900 text-white py-2 px-4 flex justify-between items-center text-[10px] uppercase tracking-widest font-bold">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1"><CheckCircle2 size={10} className="text-green-400" /> Official Guide</span>
          <span className="flex items-center gap-1"><AlertCircle size={10} className="text-yellow-400" /> Updated 2024</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleFullscreen}
            className="hover:text-yellow-400 transition-colors flex items-center gap-1"
          >
            {isFullscreen ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen (F)'}
          </button>
          <span>© Department of Posts, India</span>
        </div>
      </div>
    </div>
  );
}
