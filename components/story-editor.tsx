"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UploadIcon, SaveIcon, SendIcon, XIcon, EyeIcon } from "lucide-react" // Added EyeIcon for preview
import { useToast } from "@/hooks/use-toast"
import { FloatingLabelInput } from "@/components/ui/floating-label-input"
import { FloatingLabelTextarea } from "@/components/ui/floating-label-textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import StoryPreviewModal from "./story-preview-modal" // Import the new preview modal

interface StoryEditorProps {
  onClose: () => void;
  story?: {
    title: string;
    content: string;
    status?: string;
    // Add other story properties as needed
  } | null;
  onSave?: (storyData: any) => void;
}

export default function StoryEditor({ onClose, story: initialStory, onSave }: StoryEditorProps) {
  const [title, setTitle] = useState(initialStory?.title || "")
  const [episodeNumber, setEpisodeNumber] = useState("")
  const [content, setContent] = useState(initialStory?.content || "")
  const [genre, setGenre] = useState("")
  const [tags, setTags] = useState("")
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [contentType, setContentType] = useState<"text" | "image">("text")
  const [storyImages, setStoryImages] = useState<File[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [autoSaveStatus, setAutoSaveStatus] = useState("Saved")
  const [showPreview, setShowPreview] = useState(false) // State for preview modal visibility
  const { toast } = useToast()

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImage(e.target.files[0])
    }
  }

  const handleStoryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setStoryImages(Array.from(e.target.files))
    }
  }

  const clearStoryImages = () => {
    setStoryImages([])
    const fileInput = document.getElementById("story-images") as HTMLInputElement
    if (fileInput) {
      fileInput.value = ""
    }
  }

  const handleSave = (publish = false) => {
    setIsSaving(publish)
    setIsPublishing(publish)
    
    const storyData = {
      title,
      content,
      status: publish ? 'published' : 'draft',
      // Add other fields as needed
    };
    
    // If onSave callback is provided, use it
    if (onSave) {
      onSave(storyData);
      onClose();
      return;
    }
    
    // Otherwise, use the default save behavior
    setTimeout(() => {
      setAutoSaveStatus(publish ? "Published" : "Saved")
      setIsSaving(false)
      setIsPublishing(false)
      
      toast({
        title: publish ? "Story published!" : "Draft saved",
        description: publish ? "Your story has been published successfully." : "Your changes have been saved.",
      })
      
      if (publish) {
        onClose()
      }
    }, 1500)
  }

  const handlePublish = () => handleSave(true);

  const handleSaveDraft = () => {
    handleSave(false);
  }

  const handlePreview = () => {
    if (!title || (!content && storyImages.length === 0)) {
      toast({
        title: "Cannot Preview",
        description: "Please add a title and some content (text or images) to preview your story.",
        variant: "destructive",
      })
      return
    }
    setShowPreview(true)
  }

  const wordCount = content.split(/\s+/).filter(Boolean).length
  const estimatedReadTime = Math.ceil(wordCount / 150)

  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (title || content || storyImages.length > 0) {
        setAutoSaveStatus("Saving...")
        setTimeout(() => {
          setAutoSaveStatus("Saved")
        }, 1000)
      }
    }, 5000)

    return () => {
      clearTimeout(handler)
    }
  }, [title, content, storyImages])

  const isPublishDisabled =
    isSaving ||
    isPublishing ||
    !title ||
    !genre ||
    (contentType === "text" && !content) ||
    (contentType === "image" && storyImages.length === 0)

  return (
    <div className="container mx-auto py-8 px-4 md:px-8 max-w-4xl">
      <Card className="rounded-xl shadow-lg bg-card text-card-foreground p-6 md:p-8">
        <CardHeader className="mb-6">
          <CardTitle className="text-3xl font-serif font-bold text-primary">Create New Story</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <FloatingLabelInput id="title" label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <FloatingLabelInput
              id="episode-number"
              label="Episode No. (Optional)"
              type="number"
              value={episodeNumber}
              onChange={(e) => setEpisodeNumber(e.target.value)}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="genre" className="text-lg text-foreground">
                Genre
              </Label>
              <Select value={genre} onValueChange={setGenre}>
                <SelectTrigger className="rounded-lg p-3 text-foreground bg-input border-border focus:ring-primary">
                  <SelectValue placeholder="Select a genre" />
                </SelectTrigger>
                <SelectContent className="rounded-lg bg-card text-card-foreground border-border">
                  <SelectItem value="fantasy">Fantasy</SelectItem>
                  <SelectItem value="sci-fi">Science Fiction</SelectItem>
                  <SelectItem value="romance">Romance</SelectItem>
                  <SelectItem value="thriller">Thriller</SelectItem>
                  <SelectItem value="mystery">Mystery</SelectItem>
                  <SelectItem value="horror">Horror</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <FloatingLabelInput
                id="tags"
                label="Tags (comma-separated)"
                placeholder="e.g., magic, adventure, dragons"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="cover-image" className="text-lg text-foreground">
              Cover Image
            </Label>
            <div className="flex items-center gap-4">
              <input
                id="cover-image"
                type="file"
                accept="image/*"
                onChange={handleCoverImageChange}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById("cover-image")?.click()}
                className="rounded-lg flex items-center gap-2 border-primary text-primary hover:bg-primary/10 bg-transparent"
              >
                <UploadIcon className="h-5 w-5" />
                Upload Cover
              </Button>
              {coverImage && <span className="text-sm text-muted-foreground">{coverImage.name}</span>}
            </div>
            {coverImage && (
              <div className="mt-4 w-32 h-32 relative rounded-lg overflow-hidden border border-border">
                <img
                  src={URL.createObjectURL(coverImage) || "/placeholder.svg"}
                  alt="Cover Preview"
                  className="object-cover w-full h-full"
                />
              </div>
            )}
          </div>

          <Tabs
            value={contentType}
            onValueChange={(value) => setContentType(value as "text" | "image")}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 rounded-lg bg-muted/50 p-1 mb-4">
              <TabsTrigger
                value="text"
                className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Text Story
              </TabsTrigger>
              <TabsTrigger
                value="image"
                className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Image Story
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="mt-0">
              <FloatingLabelTextarea
                id="content"
                label="Story Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={15}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Word count: {wordCount} | Estimated read time: {estimatedReadTime} min
                <span className="ml-4 text-xs text-muted-foreground">Status: {autoSaveStatus}</span>
              </p>
            </TabsContent>

            <TabsContent value="image" className="mt-0">
              <div className="grid gap-2">
                <Label htmlFor="story-images" className="text-lg text-foreground">
                  Story Images
                </Label>
                <div className="flex items-center gap-4">
                  <input
                    id="story-images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleStoryImagesChange}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById("story-images")?.click()}
                    className="rounded-lg flex items-center gap-2 border-primary text-primary hover:bg-primary/10 bg-transparent"
                  >
                    <UploadIcon className="h-5 w-5" />
                    Upload Images
                  </Button>
                  {storyImages.length > 0 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={clearStoryImages}
                      className="rounded-full text-destructive hover:bg-destructive/10"
                      aria-label="Clear Images"
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {storyImages.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {storyImages.map((file, index) => (
                      <div
                        key={index}
                        className="relative w-full aspect-video rounded-lg overflow-hidden border border-border shadow-sm"
                      >
                        <img
                          src={URL.createObjectURL(file) || "/placeholder.svg"}
                          alt={`Story image ${index + 1}`}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-sm text-muted-foreground mt-1">
                  {storyImages.length > 0
                    ? `${storyImages.length} image(s) selected.`
                    : "Upload images to create an image-based story."}
                  <span className="ml-4 text-xs text-muted-foreground">Status: {autoSaveStatus}</span>
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              onClick={handleSaveDraft}
              disabled={isSaving || isPublishing}
              className="flex-1 rounded-lg bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            >
              <SaveIcon className="h-5 w-5 mr-2" />
              {isSaving ? "Saving..." : "Save Draft"}
            </Button>
            <Button
              onClick={handlePublish}
              disabled={isSaving || isPublishing}
              className="flex-1 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <SendIcon className="h-5 w-5 mr-2" />
              {isPublishing ? "Publishing..." : "Publish Story"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {showPreview && (
        <StoryPreviewModal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          storyData={{
            title,
            episodeNumber,
            contentType,
            textContent: content,
            imageFiles: storyImages,
          }}
        />
      )}
    </div>
  )
}
