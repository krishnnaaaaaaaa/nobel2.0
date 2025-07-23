"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { BookOpenIcon, MinusIcon, PlusIcon, SettingsIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet" // For settings drawer

interface StoryReaderProps {
  story: {
    title: string
    author: string
    content: string
  }
}

export default function StoryReader({ story }: StoryReaderProps) {
  const [fontSize, setFontSize] = useState(16) // Default font size
  const [progress, setProgress] = useState(30) // Simulate reading progress
  const [isZenMode, setIsZenMode] = useState(false) // Zen mode toggle

  const handleFontSizeChange = (value: number[]) => {
    setFontSize(value[0])
  }

  const increaseFontSize = () => setFontSize((prev) => Math.min(prev + 2, 24))
  const decreaseFontSize = () => setFontSize((prev) => Math.max(prev - 2, 12))

  return (
    <div className="container mx-auto py-8 px-4 md:px-8 max-w-3xl">
      <Card className="rounded-xl shadow-lg bg-card text-card-foreground p-6 md:p-8">
        <CardContent className="space-y-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-4xl font-serif font-bold text-primary">{story.title}</h2>
            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <SettingsIcon className="h-5 w-5" />
                    <span className="sr-only">Reader Settings</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-card text-card-foreground">
                  <SheetHeader>
                    <SheetTitle className="font-serif text-2xl">Reader Settings</SheetTitle>
                  </SheetHeader>
                  <div className="py-6 space-y-6">
                    {/* Font Size Controls */}
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">Font Size:</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={decreaseFontSize}
                        className="rounded-full bg-transparent"
                      >
                        <MinusIcon className="h-4 w-4" />
                      </Button>
                      <Slider
                        value={[fontSize]}
                        onValueChange={handleFontSizeChange}
                        min={12}
                        max={24}
                        step={1}
                        className="w-full sm:w-32" // Adjusted for responsiveness
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={increaseFontSize}
                        className="rounded-full bg-transparent"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    {/* Zen Mode Toggle */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Distraction-Free Mode</span>
                      <Button
                        variant={isZenMode ? "default" : "outline"}
                        onClick={() => setIsZenMode(!isZenMode)}
                        className="rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        {isZenMode ? "On" : "Off"}
                      </Button>
                    </div>
                    {/* More settings could go here */}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <p className="text-lg text-muted-foreground font-sans mb-8">By {story.author}</p>

          {/* Story Content */}
          <div
            className={cn("prose max-w-none text-foreground")} // Ensure text color is foreground
            style={{ fontSize: `${fontSize}px` }}
          >
            {story.content.split("\n").map((paragraph, index) => (
              <p key={index} className="mb-4 leading-relaxed text-foreground">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Reading Progress */}
          <div className="mt-8">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Slider
              value={[progress]}
              onValueChange={(value) => setProgress(value[0])}
              max={100}
              step={1}
              className="w-full"
              disabled // Simulate progress tracking, not user-adjustable
            />
            <Button className="mt-4 w-full rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground">
              <BookOpenIcon className="h-5 w-5 mr-2" />
              Resume Reading ({progress}% complete)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
