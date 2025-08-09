"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { XIcon, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { useState, useEffect } from "react"

export interface StoryContentItem {
  id: string;
  type: 'text' | 'image';
  content: string;
  order: number;
}

interface StoryPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  content: string
  coverImage: File | null
  storyContent: StoryContentItem[]
}

export default function StoryPreviewModal({ isOpen, onClose, title, content, coverImage, storyContent }: StoryPreviewModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const nextSlide = () => {
    if (currentIndex < storyContent.length - 1) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1)
        setIsTransitioning(false)
      }, 200)
    }
  }

  const prevSlide = () => {
    if (currentIndex > 0) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentIndex(prev => prev - 1)
        setIsTransitioning(false)
      }, 200)
    }
  }

  useEffect(() => {
    setCurrentIndex(0) // Reset to first slide when modal opens
  }, [isOpen])

  if (!storyContent.length) return null

  const currentItem = storyContent[currentIndex]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] p-0 bg-black border-0 overflow-hidden">
        <div className="relative w-full">
          {/* Navigation Arrows */}
          {currentIndex > 0 && (
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-all"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}
          
          {currentIndex < storyContent.length - 1 && (
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-all"
              aria-label="Next slide"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}

          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-black/50 text-white rounded-full hover:bg-black/70"
            aria-label="Close preview"
          >
            <XIcon className="h-5 w-5" />
          </Button>

          {/* Progress Bar */}
          <div className="absolute top-0 left-0 right-0 flex gap-1 p-2 z-10">
            {storyContent.map((_, index) => (
              <div 
                key={index}
                className="h-1 bg-white/30 flex-1 rounded-full overflow-hidden"
              >
                <div 
                  className={cn(
                    "h-full bg-white transition-all duration-300",
                    index < currentIndex ? 'w-full' : index === currentIndex ? 'w-0 animate-progress' : 'w-0'
                  )}
                  style={{
                    animationDuration: '5s',
                    animationPlayState: isTransitioning ? 'paused' : 'running'
                  }}
                />
              </div>
            ))}
          </div>

          {/* Content */}
          <AspectRatio ratio={9/16} className="bg-black">
            <div className="relative w-full h-full flex items-center justify-center">
              {currentItem.type === 'image' ? (
                <img
                  src={currentItem.content}
                  alt="Story content"
                  className={cn(
                    "w-full h-full object-cover transition-opacity duration-200",
                    isTransitioning ? 'opacity-0' : 'opacity-100'
                  )}
                />
              ) : (
                <div className={cn(
                  "p-8 text-center text-white text-lg leading-relaxed transition-opacity duration-200",
                  isTransitioning ? 'opacity-0' : 'opacity-100'
                )}>
                  {currentItem.content}
                </div>
              )}
            </div>
          </AspectRatio>
        </div>

        {/* Slide Indicator */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
          {storyContent.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                index === currentIndex ? 'bg-white w-6' : 'bg-white/50'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
