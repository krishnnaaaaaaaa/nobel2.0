"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import StoryCard from "@/components/story-card"
import { EditIcon, MailIcon, UsersIcon, BookOpenIcon, PenToolIcon } from "lucide-react"
import { useState } from "react"
import { FloatingLabelInput } from "@/components/ui/floating-label-input"
import { FloatingLabelTextarea } from "@/components/ui/floating-label-textarea"

interface UserProfileProps {
  isPublicView?: boolean // To simulate public vs. private view
}

export default function UserProfile({ isPublicView = false }: UserProfileProps) {
  // Dummy user data
  const [user, setUser] = useState({
    name: "Anya Sharma",
    username: "anya_writes",
    bio: "Passionate storyteller weaving tales of magic and mystery. Lover of coffee, cats, and compelling narratives.",
    avatarUrl: "/placeholder.svg?height=150&width=150",
    followers: 0,
    following: 0,
    storiesAuthored: 25,
    storiesRead: 10,
    totalWordsWritten: "10",
  })
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [editedName, setEditedName] = useState(user.name)
  const [editedBio, setEditedBio] = useState(user.bio)

  // Dummy authored stories
  const authoredStories = [
    {
      title: "The Crystal Labyrinth",
      author: user.username,
      readTime: "20 min",
      imageUrl: "/placeholder.svg?height=300&width=400",
    },
    {
      title: "Whispers of the Forgotten Star",
      author: user.username,
      readTime: "15 min",
      imageUrl: "/placeholder.svg?height=300&width=400",
    },
    {
      title: "Chronicles of the Shadow Realm",
      author: user.username,
      readTime: "30 min",
      imageUrl: "/placeholder.svg?height=300&width=400",
    },
    {
      title: "The Clockwork Heart",
      author: user.username,
      readTime: "18 min",
      imageUrl: "/placeholder.svg?height=300&width=400",
    },
  ]

  const handleSaveProfile = () => {
    setUser((prev) => ({ ...prev, name: editedName, bio: editedBio }))
    setIsEditingProfile(false)
    // In a real app, send data to backend
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-8 max-w-5xl">
      <Card className="rounded-xl shadow-lg bg-card text-card-foreground p-6 md:p-8">
        <CardHeader className="flex flex-col md:flex-row items-center gap-6 mb-6">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary shadow-md">
            <Image src={user.avatarUrl || "/placeholder.svg"} alt={user.name} layout="fill" objectFit="cover" />
          </div>
          <div className="text-center md:text-left flex-1">
            {isEditingProfile ? (
              <FloatingLabelInput
                id="edit-name"
                label="Name"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="mb-2 text-4xl font-serif font-bold"
              />
            ) : (
              <CardTitle className="text-4xl font-serif font-bold text-primary mb-2">{user.name}</CardTitle>
            )}
            <p className="text-lg text-muted-foreground font-sans mb-3">@{user.username}</p>
            {isEditingProfile ? (
              <FloatingLabelTextarea
                id="edit-bio"
                label="Bio"
                value={editedBio}
                onChange={(e) => setEditedBio(e.target.value)}
                rows={3}
                className="max-w-prose mx-auto md:mx-0"
              />
            ) : (
              <p className="text-md text-foreground max-w-prose mx-auto md:mx-0">{user.bio}</p>
            )}
          </div>
          {!isPublicView && (
            <div className="flex flex-col gap-3">
              {isEditingProfile ? (
                <Button
                  onClick={handleSaveProfile}
                  className="rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Save Profile
                </Button>
              ) : (
                <Button
                  onClick={() => setIsEditingProfile(true)}
                  className="rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <EditIcon className="h-5 w-5 mr-2" />
                  Edit Profile
                </Button>
              )}
              <Button
                variant="outline"
                className="rounded-lg border-primary text-primary hover:bg-primary/10 bg-transparent"
              >
                <MailIcon className="h-5 w-5 mr-2" />
                Contact
              </Button>
            </div>
          )}
          {isPublicView && (
            <Button className="rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground">
              <UsersIcon className="h-5 w-5 mr-2" />
              Follow
            </Button>
          )}
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-8">
            <div className="p-4 rounded-lg bg-muted/50 shadow-sm">
              <p className="text-2xl font-bold text-primary">{user.followers}</p>
              <p className="text-sm text-muted-foreground">Followers</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 shadow-sm">
              <p className="text-2xl font-bold text-primary">{user.following}</p>
              <p className="text-sm text-muted-foreground">Following</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 shadow-sm">
              <p className="text-2xl font-bold text-primary">{user.storiesAuthored}</p>
              <p className="text-sm text-muted-foreground">Stories Authored</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 shadow-sm">
              <p className="text-2xl font-bold text-primary">{user.storiesRead}</p>
              <p className="text-sm text-muted-foreground">Stories Read</p>
            </div>
          </div>

          <Tabs defaultValue="authored" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 rounded-lg bg-muted/50 p-1">
              <TabsTrigger
                value="authored"
                className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <PenToolIcon className="h-4 w-4 mr-2" /> Authored Works
              </TabsTrigger>
              <TabsTrigger
                value="reading-list"
                className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <BookOpenIcon className="h-4 w-4 mr-2" /> Reading List
              </TabsTrigger>
              {!isPublicView && (
                <TabsTrigger
                  value="stats"
                  className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Stats
                </TabsTrigger>
              )}
            </TabsList>
            <TabsContent value="authored" className="mt-6">
              <h3 className="text-2xl font-serif font-semibold mb-4 text-foreground">Authored Stories</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {authoredStories.length > 0 ? (
                  authoredStories.map((story, index) => <StoryCard key={index} {...story} />)
                ) : (
                  <p className="text-muted-foreground col-span-full text-center py-8">
                    No stories authored yet. Start writing your first masterpiece!
                  </p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="reading-list" className="mt-6">
              <h3 className="text-2xl font-serif font-semibold mb-4 text-foreground">Reading List</h3>
              <p className="text-muted-foreground">
                This section would display bookmarked, in-progress, and completed reads.
                <br />
                (See the dedicated Library component for a more detailed view.)
              </p>
            </TabsContent>
            {!isPublicView && (
              <TabsContent value="stats" className="mt-6">
                <h3 className="text-2xl font-serif font-semibold mb-4 text-foreground">Writing & Reading Stats</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4 rounded-lg bg-muted/50 shadow-sm">
                    <p className="text-xl font-bold text-primary">{user.totalWordsWritten}</p>
                    <p className="text-sm text-muted-foreground">Total Words Written</p>
                  </Card>
                  <Card className="p-4 rounded-lg bg-muted/50 shadow-sm">
                    <p className="text-xl font-bold text-primary">{user.storiesRead}</p>
                    <p className="text-sm text-muted-foreground">Stories Completed</p>
                  </Card>
                  {/* Add more stats here */}
                </div>
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
