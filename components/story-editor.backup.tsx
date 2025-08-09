"use client"

import { useState, useRef, ChangeEvent, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { UploadIcon, SaveIcon, XIcon, EyeIcon, ImageIcon, TextIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { FloatingLabelInput } from "@/components/ui/floating-label-input"
import { FloatingLabelTextarea } from "@/components/ui/floating-label-textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StoryPreviewModal } from "./story-preview-modal"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { cn } from "@/lib/utils"

export interface StoryContentItem {
  id: string;
  type: 'text' | 'image';
  content: string;
  order: number;
}

interface StoryEditorProps {
  onClose: () => void;
  story?: {
    title: string;
    content: string;
    status?: string;
  } | null;
  onSave?: (storyData: any) => void;
}

export function StoryEditor({ onClose, story: initialStory, onSave }: StoryEditorProps) {
  const [title, setTitle] = useState(initialStory?.title || "");
  const [episodeNumber, setEpisodeNumber] = useState("");
  const [content, setContent] = useState(initialStory?.content || "");
  const [genre, setGenre] = useState("");
  const [tags, setTags] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [contentType, setContentType] = useState<"text" | "image">("text");
  const [storyContent, setStoryContent] = useState<StoryContentItem[]>([]);
  const [currentText, setCurrentText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState("Saved");
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setCoverImage(e.target.files[0]);
    }
  };

  const handleAddImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const newContent: StoryContentItem = {
        id: Date.now().toString(),
        type: 'image',
        content: reader.result as string,
        order: storyContent.length
      };
      setStoryContent(prev => [...prev, newContent]);
    };
    reader.readAsDataURL(file);
  };

  const handleAddText = () => {
    if (!currentText.trim()) return;
    
    const newContent: StoryContentItem = {
      id: Date.now().toString(),
      type: 'text',
      content: currentText.trim(),
      order: storyContent.length
    };
    setStoryContent(prev => [...prev, newContent]);
    setCurrentText("");
  };

  const removeContentItem = (id: string) => {
    setStoryContent(prev => 
      prev
        .filter(item => item.id !== id)
        .map((item, index) => ({ ...item, order: index }))
    );
  };

  const handleSave = (publish = false) => {
    setIsSaving(true);
    setIsPublishing(publish);
    
    // Simulate API call
    setTimeout(() => {
      if (onSave) {
        onSave({
          title,
          content,
          genre,
          tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
          status: publish ? 'published' : 'draft',
          coverImage: coverImage ? URL.createObjectURL(coverImage) : null,
          storyContent,
          publishedAt: publish ? new Date().toISOString() : null
        });
      }
      
      setIsSaving(false);
      
      toast({
        title: publish ? "Story Published!" : "Draft Saved!",
        description: publish 
          ? "Your story has been published successfully." 
          : "Your changes have been saved as a draft.",
      });
      
      if (publish) {
        onClose();
      }
    }, 1000);
  };

  const handleSaveDraft = () => handleSave(false);
  const handlePublish = () => handleSave(true);

  const handlePreview = () => {
    if (!title || (contentType === 'text' ? !content : storyContent.length === 0)) {
      toast({
        title: "Cannot Preview",
        description: "Please add a title and some content to preview your story.",
        variant: "destructive",
      });
      return;
    }
    setShowPreview(true);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (title || content || storyContent.length > 0) {
        setAutoSaveStatus("Saving...");
        setTimeout(() => {
          setAutoSaveStatus("Saved");
        }, 500);
      }
    }, 1000);
    
    return () => clearTimeout(handler);
  }, [title, content, storyContent]);

  const isPublishDisabled = 
    isSaving ||
    isPublishing ||
    !title ||
    !genre ||
    (contentType === "text" && !content) ||
    (contentType === "image" && storyContent.length === 0);

  const renderContentPreview = () => {
    return (
      <div className="w-full max-w-md mx-auto bg-black rounded-lg overflow-hidden">
        <AspectRatio ratio={9/16} className="relative bg-gray-900">
          {storyContent.length > 0 ? (
            <div className="h-full w-full overflow-hidden">
              {storyContent.map((item) => (
                <div 
                  key={item.id}
                  className={cn(
                    "absolute inset-0 flex items-center justify-center p-4 transition-opacity duration-300",
                    "bg-cover bg-center bg-no-repeat"
                  )}
                  style={{
                    backgroundImage: item.type === 'image' ? `url(${item.content})` : 'none',
                    backgroundColor: item.type === 'text' ? 'rgba(17, 24, 39, 0.9)' : 'transparent'
                  }}
                >
                  {item.type === 'text' && (
                    <p className="text-white text-center text-lg p-4">{item.content}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full w-full flex items-center justify-center text-gray-400">
              <p>Add content to see preview</p>
            </div>
          )}
        </AspectRatio>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-8 max-w-6xl">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-3xl font-serif font-bold text-primary">
              {initialStory ? 'Edit Story' : 'Create New Story'}
            </CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowPreview(true)}
                disabled={storyContent.length === 0}
              >
                <EyeIcon className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <XIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
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
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleAddImage}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Add Image
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      const text = prompt("Enter your text:");
                      if (text) {
                        const newContent: StoryContentItem = {
                          id: Date.now().toString(),
                          type: 'text',
                          content: text,
                          order: storyContent.length
                        };
                        setStoryContent([...storyContent, newContent]);
                      }
                    }}
                  >
                    <TextIcon className="h-4 w-4 mr-2" />
                    Add Text
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Story Content</Label>
                <div className="space-y-2">
                  {storyContent.map((item) => (
                    <div key={item.id} className="border rounded p-2 flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        {item.type === 'image' ? (
                          <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                            <img 
                              src={item.content} 
                              alt="Story content" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                            <TextIcon className="h-4 w-4 text-gray-500" />
                          </div>
                        )}
                        <span className="text-sm truncate max-w-[200px]">
                          {item.type === 'image' ? 'Image' : item.content.substring(0, 30) + (item.content.length > 30 ? '...' : '')}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => removeContentItem(item.id)}
                      >
                        <XIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {storyContent.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p>No content added yet</p>
                      <p className="text-sm">Click 'Add Image' or 'Add Text' to get started</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="hidden md:block">
        <Label className="block mb-2">Preview</Label>
        {renderContentPreview()}
      </div>
    </CardContent>
    <CardFooter className="px-6 py-4 bg-gray-50 dark:bg-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {autoSaveStatus}
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <div className="md:hidden w-full">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => setShowPreview(true)}
            disabled={storyContent.length === 0}
          >
            <EyeIcon className="h-4 w-4 mr-2" />
            Preview Story
          </Button>
        </div>
        <Button 
          variant="outline" 
          className="w-full sm:w-auto"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button 
          variant="default" 
          className="w-full sm:w-auto"
          onClick={handleSaveDraft}
          disabled={isSaving || isPublishing}
        >
          {isSaving ? 'Saving...' : 'Save as Draft'}
        </Button>
        <Button 
          variant="default" 
          className="w-full sm:w-auto"
          onClick={handlePublish}
          disabled={isSaving || isPublishing}
        >
          {isPublishing ? 'Publishing...' : 'Publish'}
        </Button>
      </div>
    </CardFooter>
  </Card>

      {showPreview && (
        <StoryPreviewModal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          title={title}
          content={content}
          coverImage={coverImage}
          storyContent={storyContent}
        />
      )}
    </div>
)
  )
}
