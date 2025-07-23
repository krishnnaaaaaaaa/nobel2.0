"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import StoryCard from "@/components/story-card"
import { BookmarkIcon, BookOpenIcon, CheckCircleIcon } from "lucide-react"
import { Progress } from "@/components/ui/progress"

type LibraryViewProps = {}

export default function LibraryView({}: LibraryViewProps) {
  // Dummy data for library sections
  const bookmarkedStories = [
    {
      title: "The Whispering Woods",
      author: "Elara Vance",
      readTime: "15 min",
      imageUrl: "/placeholder.svg?height=300&width=400",
    },
    {
      title: "Echoes of Starlight",
      author: "Kaelen Thorne",
      readTime: "20 min",
      imageUrl: "/placeholder.svg?height=300&width=400",
    },
  ]

  const inProgressStories = [
    {
      title: "City of Forgotten Dreams",
      author: "Seraphina Nightshade",
      readTime: "10 min",
      imageUrl: "/placeholder.svg?height=300&width=400",
      progress: 60,
    },
    {
      title: "The Last Alchemist's Secret",
      author: "Rowan Blackwood",
      readTime: "25 min",
      imageUrl: "/placeholder.svg?height=300&width=400",
      progress: 30,
    },
  ]

  const completedStories = [
    {
      title: "Beneath the Crimson Sky",
      author: "Lyra Dawn",
      readTime: "12 min",
      imageUrl: "/placeholder.svg?height=300&width=400",
    },
    {
      title: "Chronicles of the Azure Sea",
      author: "Finnian Storm",
      readTime: "18 min",
      imageUrl: "/placeholder.svg?height=300&width=400",
    },
  ]

  return (
    <div className="container mx-auto py-8 px-4 md:px-8 max-w-5xl">
      <Card className="rounded-xl shadow-lg bg-card text-card-foreground p-6 md:p-8">
        <CardContent>
          <h2 className="text-3xl font-serif font-bold text-primary mb-6">My Library</h2>

          <Tabs defaultValue="in-progress" className="w-full">
            <TabsList className="grid w-full grid-cols-3 rounded-lg bg-muted/50 p-1 mb-6">
              <TabsTrigger
                value="in-progress"
                className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <BookOpenIcon className="h-4 w-4 mr-2" /> In Progress
              </TabsTrigger>
              <TabsTrigger
                value="bookmarked"
                className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <BookmarkIcon className="h-4 w-4 mr-2" /> Bookmarked
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <CheckCircleIcon className="h-4 w-4 mr-2" /> Completed
              </TabsTrigger>
            </TabsList>

            <TabsContent value="in-progress" className="mt-4">
              <h3 className="text-2xl font-serif font-semibold mb-4 text-foreground">Currently Reading</h3>
              {inProgressStories.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {inProgressStories.map((story, index) => (
                    <div key={index} className="relative">
                      <StoryCard {...story} />
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-card/80 backdrop-blur-sm rounded-b-xl">
                        <Progress value={story.progress} className="h-2 bg-muted" indicatorColor="bg-primary" />
                        <p className="text-xs text-muted-foreground text-center mt-1">{story.progress}% complete</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No stories in progress. Start a new read!</p>
              )}
            </TabsContent>

            <TabsContent value="bookmarked" className="mt-4">
              <h3 className="text-2xl font-serif font-semibold mb-4 text-foreground">Bookmarked Stories</h3>
              {bookmarkedStories.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bookmarkedStories.map((story, index) => (
                    <StoryCard key={index} {...story} />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No bookmarked stories yet. Discover something new!
                </p>
              )}
            </TabsContent>

            <TabsContent value="completed" className="mt-4">
              <h3 className="text-2xl font-serif font-semibold mb-4 text-foreground">Completed Reads</h3>
              {completedStories.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {completedStories.map((story, index) => (
                    <StoryCard key={index} {...story} />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  You haven't completed any stories yet. Keep reading!
                </p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
