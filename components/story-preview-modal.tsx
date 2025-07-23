"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface StoryPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  storyData: {
    title: string
    episodeNumber: string
    contentType: "text" | "image"
    textContent: string
    imageFiles: File[]
  }
}

export default function StoryPreviewModal({ isOpen, onClose, storyData }: StoryPreviewModalProps) {
  const { title, episodeNumber, contentType, textContent, imageFiles } = storyData

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto p-6 bg-card text-card-foreground rounded-xl shadow-lg">
        <DialogHeader className="relative pb-4 border-b border-border">
          <DialogTitle className="text-3xl font-serif font-bold text-primary pr-10">
            {title}
            {episodeNumber && <span className="text-xl text-muted-foreground ml-2"> - Ep. {episodeNumber}</span>}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">This is a preview of your story.</DialogDescription>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-2 right-2 rounded-full text-muted-foreground hover:bg-muted"
            aria-label="Close preview"
          >
            <XIcon className="h-5 w-5" />
          </Button>
        </DialogHeader>

        <div className="py-6">
          {contentType === "text" ? (
            <div className={cn("prose max-w-none text-foreground")}>
              {textContent.split("\n").map((paragraph, index) => (
                <p key={index} className="mb-4 leading-relaxed text-foreground">
                  {paragraph}
                </p>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {imageFiles.length > 0 ? (
                imageFiles.map((file, index) => (
                  <div
                    key={index}
                    className="relative w-full aspect-video rounded-lg overflow-hidden shadow-sm border border-border"
                  >
                    <Image
                      src={URL.createObjectURL(file) || "/placeholder.svg"}
                      alt={`Story image ${index + 1}`}
                      layout="fill"
                      objectFit="cover"
                      crossOrigin="anonymous"
                    />
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center col-span-full py-8">
                  No images selected for this story.
                </p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
