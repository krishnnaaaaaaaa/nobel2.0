"use client"

import React, { useState, useRef, ChangeEvent } from "react"
import { XIcon, EyeIcon, ImageIcon, TextIcon } from "lucide-react"
import Image from "next/image"

// Simple card component
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}>
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>;
};

const CardTitle = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>{children}</h3>;
};

const CardContent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return <div className={`p-6 pt-0 ${className}`}>{children}</div>;
};

const CardFooter = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return <div className={`flex items-center p-6 pt-0 ${className}`}>{children}</div>;
};

// Simple button component
const Button = ({ 
  children, 
  onClick, 
  variant = "default", 
  size = "default",
  className = "",
  disabled = false,
  type = "button",
  ...props 
}: { 
  children: React.ReactNode; 
  onClick?: () => void; 
  variant?: "default" | "ghost" | "outline" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  [key: string]: any;
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const variantStyles = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90"
  };
  const sizeStyles = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 rounded-md",
    lg: "h-11 px-8 rounded-md",
    icon: "h-10 w-10"
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variantStyles[variant as keyof typeof variantStyles] || ''} ${sizeStyles[size as keyof typeof sizeStyles] || ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

// Simple input component
const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

// Simple textarea component
const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

// Simple label component
const Label = ({ 
  htmlFor, 
  children, 
  className = "" 
}: { 
  htmlFor: string; 
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <label 
      htmlFor={htmlFor} 
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
    >
      {children}
    </label>
  );
};

// Simple select component
const Select = ({ 
  value, 
  onValueChange, 
  children,
  className = ""
}: { 
  value: string; 
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <select 
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </select>
  );
};

const SelectTrigger = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}>
    {children}
  </div>
);

const SelectValue = ({ placeholder }: { placeholder: string }) => (
  <span className="text-muted-foreground">{placeholder}</span>
);

const SelectContent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md ${className}`}>
    {children}
  </div>
);

const SelectItem = ({ 
  value, 
  children,
  className = ""
}: { 
  value: string; 
  children: React.ReactNode;
  className?: string;
}) => (
  <option 
    value={value}
    className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${className}`}
  >
    {children}
  </option>
);

// Tabs component
const Tabs = ({ 
  value, 
  onValueChange, 
  children,
  className = ""
}: { 
  value: string; 
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={className}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === TabsList) {
          return React.cloneElement(child, { value, onValueChange } as any);
        }
        return child;
      })}
    </div>
  );
};

const TabsList = ({ 
  children, 
  className = "" 
}: { 
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground ${className}`}>
      {children}
    </div>
  );
};

const TabsTrigger = ({ 
  value, 
  children,
  className = ""
}: { 
  value: string; 
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <button
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm ${className}`}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ 
  value, 
  children,
  className = ""
}: { 
  value: string; 
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

// Simple toast hook
const useToast = () => {
  return {
    toast: ({ title, description, variant = "default" }: { 
      title: string; 
      description: string; 
      variant?: "default" | "destructive"
    }) => {
      console.log(`[${variant}] ${title}: ${description}`);
      // In a real app, you would show a toast notification here
    }
  };
};

// Import the StoryPreviewModal component
import StoryPreviewModal from "./story-preview-modal-fixed";

// Simple cn utility function
const cn = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

export interface StoryEditorProps {
  onClose: () => void;
  story?: {
    title: string;
    content: string;
    status?: string;
  } | null;
  onSave?: (storyData: any) => void;
}

export default function StoryEditor({ onClose, story: initialStory, onSave }: StoryEditorProps) {
  const [title, setTitle] = useState(initialStory?.title || "");
  const [episodeNumber, setEpisodeNumber] = useState("");
  const [content, setContent] = useState(initialStory?.content || "");
  const [genre, setGenre] = useState("");
  const [tags, setTags] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [contentType, setContentType] = useState<"text" | "image">("text");
  const [storyContent, setStoryContent] = useState<{
    id: string;
    type: 'text' | 'image';
    content: string;
    order: number;
  }[]>([]);
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
      const newContent = {
        id: Date.now().toString(),
        type: 'image' as const,
        content: reader.result as string,
        order: storyContent.length
      };
      setStoryContent(prev => [...prev, newContent]);
    };
    reader.readAsDataURL(file);
  };

  const handleAddText = () => {
    if (!currentText.trim()) return;
    
    const newContent = {
      id: Date.now().toString(),
      type: 'text' as const,
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

  const isPublishDisabled = 
    isSaving ||
    isPublishing ||
    !title ||
    !genre ||
    (contentType === "text" && !content) ||
    (contentType === "image" && storyContent.length === 0);

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
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                placeholder="Enter story title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="episode-number">Episode No. (Optional)</Label>
              <Input
                id="episode-number"
                type="number"
                value={episodeNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEpisodeNumber(e.target.value)}
                placeholder="e.g., 1"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="genre">Genre</Label>
              <Select value={genre} onValueChange={setGenre}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fantasy">Fantasy</SelectItem>
                  <SelectItem value="sci-fi">Science Fiction</SelectItem>
                  <SelectItem value="romance">Romance</SelectItem>
                  <SelectItem value="thriller">Thriller</SelectItem>
                  <SelectItem value="mystery">Mystery</SelectItem>
                  <SelectItem value="horror">Horror</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTags(e.target.value)}
                placeholder="e.g., adventure, mystery, romance"
              />
            </div>
          </div>

          <div className="space-y-4">
            <Tabs value={contentType} onValueChange={(value) => setContentType(value as 'text' | 'image')}>
              <TabsList>
                <TabsTrigger value="text">Text Story</TabsTrigger>
                <TabsTrigger value="image">Image Story</TabsTrigger>
              </TabsList>
              
              <TabsContent value="text" className="mt-4">
                <div className="space-y-4">
                  <Label htmlFor="content">Your Story</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
                    placeholder="Write your story here..."
                    className="min-h-[200px]"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="image" className="mt-4">
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleAddImage}
                      accept="image/*"
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Add Image
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const text = prompt("Enter your text:");
                        if (text) {
                          setCurrentText(text);
                          handleAddText();
                        }
                      }}
                    >
                      <TextIcon className="h-4 w-4 mr-2" />
                      Add Text
                    </Button>
                  </div>

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
              </TabsContent>
            </Tabs>
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
              disabled={isPublishDisabled}
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
  );
}
