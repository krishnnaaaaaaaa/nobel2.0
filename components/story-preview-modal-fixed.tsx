"use client"

import React, { useState, useEffect, useRef } from "react"
import { XIcon, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

// Simple visually hidden component for accessibility
const VisuallyHidden = ({ children }: { children: React.ReactNode }) => {
  return (
    <span 
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: '0',
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: '0',
      }}
    >
      {children}
    </span>
  )
}

// Simple dialog component to avoid shadcn/ui dependency
const Dialog = ({ 
  open, 
  onOpenChange, 
  children,
  className = ""
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  children: React.ReactNode;
  className?: string;
}) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div 
        className={`bg-white rounded-lg shadow-xl max-w-[95vw] max-h-[95vh] overflow-auto ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
  onWheel?: (e: React.WheelEvent) => void;
  onTouchStart?: (e: React.TouchEvent) => void;
  onTouchMove?: (e: React.TouchEvent) => void;
  onTouchEnd?: () => void;
}

const DialogContent = ({ 
  children,
  className = "",
  onWheel,
  onTouchStart,
  onTouchMove,
  onTouchEnd
}: DialogContentProps) => {
  return (
    <div 
      className={className}
      onWheel={onWheel}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Add the required DialogTitle but keep it visually hidden */}
      <VisuallyHidden>
        <h2>Story Preview</h2>
      </VisuallyHidden>
      {children}
    </div>
  );
};

// Simple button component to avoid shadcn/ui dependency
const Button = ({ 
  children, 
  onClick, 
  variant = "default", 
  size = "default",
  className = "",
  ...props 
}: { 
  children: React.ReactNode; 
  onClick: () => void; 
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  [key: string]: any;
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const variantStyles = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground"
  };
  const sizeStyles = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 rounded-md",
    lg: "h-11 px-8 rounded-md",
    icon: "h-10 w-10"
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant as keyof typeof variantStyles] || ''} ${sizeStyles[size as keyof typeof sizeStyles] || ''} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

// Simple aspect ratio component
const AspectRatio = ({ 
  ratio, 
  children, 
  className = "" 
}: { 
  ratio: number; 
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div 
      className={`relative w-full ${className}`}
      style={{ paddingBottom: `${100 / ratio}%` }}
    >
      <div className="absolute inset-0">
        {children}
      </div>
    </div>
  );
};

// Simple cn utility function
const cn = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

export interface StoryContentItem {
  id: string;
  type: 'text' | 'image';
  content: string;
  order: number;
}

interface StoryPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  coverImage: File | null;
  storyContent: StoryContentItem[];
}

export default function StoryPreviewModal({ 
  isOpen, 
  onClose, 
  title, 
  content, 
  coverImage, 
  storyContent 
}: StoryPreviewModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);
  const [touchEndY, setTouchEndY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle scroll events for the container with snap behavior
  const handleScroll = () => {
    if (!containerRef.current) return;
    
    const scrollPosition = containerRef.current.scrollTop;
    const windowHeight = window.innerHeight;
    const currentActiveIndex = Math.round(scrollPosition / windowHeight);
    
    // Auto-loop behavior - if we're at the end, loop to start and vice versa
    if (scrollPosition >= (storyContent.length - 0.5) * windowHeight) {
      // At bottom - loop to top
      containerRef.current.scrollTo({
        top: 0,
        behavior: 'auto'
      });
      setCurrentIndex(0);
    } else if (scrollPosition <= 0 && currentIndex === 0) {
      // At top - loop to bottom
      const newIndex = storyContent.length - 1;
      containerRef.current.scrollTo({
        top: newIndex * windowHeight,
        behavior: 'auto'
      });
      setCurrentIndex(newIndex);
    } else if (currentActiveIndex !== currentIndex) {
      // Normal scroll position update
      setCurrentIndex(currentActiveIndex);
    }
  };

  // Handle touch events for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // Prevent default to avoid scrolling the page behind
    e.preventDefault();
    setTouchEndY(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!touchStartY || touchEndY === null || !containerRef.current) return;
    
    const diff = touchStartY - touchEndY;
    const threshold = 30; // Reduced threshold for more sensitive swipes
    const windowHeight = window.innerHeight;
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Swipe up - go to next (with loop)
        const nextIndex = (currentIndex + 1) % storyContent.length;
        containerRef.current.scrollTo({
          top: nextIndex * windowHeight,
          behavior: 'smooth'
        });
        setCurrentIndex(nextIndex);
      } else {
        // Swipe down - go to previous (with loop)
        const prevIndex = (currentIndex - 1 + storyContent.length) % storyContent.length;
        containerRef.current.scrollTo({
          top: prevIndex * windowHeight,
          behavior: 'smooth'
        });
        setCurrentIndex(prevIndex);
      }
    } else {
      // If swipe distance is too small, snap back to current position
      containerRef.current.scrollTo({
        top: currentIndex * windowHeight,
        behavior: 'smooth'
      });
    }
    
    // Reset touch positions
    setTouchStartY(0);
    setTouchEndY(0);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current) return;
      
      const windowHeight = window.innerHeight;
      
      if (e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        const nextIndex = Math.min(currentIndex + 1, storyContent.length - 1);
        containerRef.current.scrollTo({
          top: nextIndex * windowHeight,
          behavior: 'smooth'
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = Math.max(currentIndex - 1, 0);
        containerRef.current.scrollTo({
          top: prevIndex * windowHeight,
          behavior: 'smooth'
        });
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, storyContent.length]);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
    }
  }, [isOpen]);

  if (storyContent.length === 0) return null;

  const currentItem = storyContent[currentIndex];
  if (!currentItem) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className="p-0 bg-transparent border-0 max-w-full w-full h-screen max-h-screen overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          ref={containerRef}
          onScroll={handleScroll}
          className="relative w-full h-screen overflow-y-auto bg-black"
          style={{
            scrollSnapType: 'y mandatory',
            WebkitOverflowScrolling: 'touch',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
            scrollBehavior: 'smooth',
          }}
        >
          {/* Content */}
          {storyContent.map((item, index) => (
            <div 
              key={item.id} 
              className="w-full h-screen flex items-center justify-center snap-start relative"
              style={{
                scrollSnapAlign: 'start',
                height: '100vh',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Main Content Container */}
              <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                {item.type === 'image' ? (
                  <div className="w-full h-full relative">
                    <img
                      src={item.content}
                      alt="Story content"
                      className="w-full h-full object-cover"
                      style={{
                        objectFit: 'cover',
                        width: '100%',
                        height: '100%',
                        aspectRatio: '9/16'
                      }}
                    />
                    {/* Gradient overlay for better text visibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                ) : (
                  <div 
                    className="w-full h-full flex items-center justify-center p-6"
                    style={{
                      background: 'linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 100%)',
                      color: 'white',
                      textAlign: 'center',
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      position: 'relative',
                      aspectRatio: '9/16',
                      maxWidth: '100%',
                      margin: '0 auto'
                    }}
                  >
                    <div 
                      className="text-2xl md:text-3xl font-medium leading-tight mb-4 max-w-full break-words"
                      style={{
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                        lineHeight: '1.3',
                        overflowWrap: 'break-word',
                        wordBreak: 'break-word',
                        padding: '0 1rem'
                      }}
                    >
                      {item.content}
                    </div>
                  </div>
                )}
              </div>

              {/* Progress bar at the top */}
              <div className="absolute top-0 left-0 right-0 z-10">
                <div className="flex gap-1 px-2 py-2">
                  {storyContent.map((_, i) => (
                    <div 
                      key={i}
                      className="h-1 bg-white/30 flex-1 rounded-full overflow-hidden"
                    >
                      <div 
                        className={cn(
                          "h-full bg-white transition-all duration-300",
                          i < currentIndex ? 'w-full' : i === currentIndex ? 'w-0 animate-pulse' : 'w-0'
                        )}
                        style={{
                          animationDuration: '5s',
                          animationPlayState: isTransitioning ? 'paused' : 'running',
                          transition: 'width 0.3s ease-out'
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                aria-label="Close preview"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>
          ))}

          {/* Removed slide indicators for cleaner Reels-like experience */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
