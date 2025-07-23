"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SearchIcon, FilterIcon } from "lucide-react"
import StoryCard from "@/components/story-card"

interface DiscoverViewProps {
  initialGenre?: string
}

export default function DiscoverView({ initialGenre }: DiscoverViewProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGenre, setSelectedGenre] = useState(initialGenre || "")
  const [selectedPopularity, setSelectedPopularity] = useState("")
  const [selectedUploadDate, setSelectedUploadDate] = useState("")
  const [storiesToShow, setStoriesToShow] = useState(8) // Initial number of stories to show

  // Dummy data for stories (same as in app/page.tsx for consistency)
  const allStories = [
    {
      title: "The Whispering Woods",
      author: "Elara Vance",
      readTime: "15 min",
      imageUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder-ob7miW3mUreePYfXdVwkpFWHthzoR5.svg?height=300&width=400",
      content: `...`,
      genre: "Fantasy",
      popularity: "Trending",
      uploadDate: "Today",
    },
    {
      title: "Echoes of Starlight",
      author: "Kaelen Thorne",
      readTime: "20 min",
      imageUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder-ob7miW3mUreePYfXdVwkpFWHthzoR5.svg?height=300&width=400",
      content: `...`,
      genre: "Sci-Fi",
      popularity: "Most Read",
      uploadDate: "This Week",
    },
    {
      title: "City of Forgotten Dreams",
      author: "Seraphina Nightshade",
      readTime: "10 min",
      imageUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder-ob7miW3mUreePYfXdVwkpFWHthzoR5.svg?height=300&width=400",
      content: `...`,
      genre: "Mystery",
      popularity: "Top Rated",
      uploadDate: "This Month",
    },
    {
      title: "The Last Alchemist's Secret",
      author: "Rowan Blackwood",
      readTime: "25 min",
      imageUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder-ob7miW3mUreePYfXdVwkpFWHthzoR5.svg?height=300&width=400",
      content: `...`,
      genre: "Fantasy",
      popularity: "Trending",
      uploadDate: "All Time",
    },
    {
      title: "Beneath the Crimson Sky",
      author: "Lyra Dawn",
      readTime: "12 min",
      imageUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder-ob7miW3mUreePYfXdVwkpFWHthzoR5.svg?height=300&width=400",
      content: `...`,
      genre: "Sci-Fi",
      popularity: "Most Read",
      uploadDate: "Today",
    },
    {
      title: "Chronicles of the Azure Sea",
      author: "Finnian Storm",
      readTime: "18 min",
      imageUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder-ob7miW3mUreePYfXdVwkpFWHthzoR5.svg?height=300&width=400",
      content: `...`,
      genre: "Fantasy",
      popularity: "Top Rated",
      uploadDate: "This Week",
    },
    {
      title: "The Dragon's Roar",
      author: "Anya Sharma",
      readTime: "30 min",
      imageUrl: "/placeholder.svg?height=300&width=400",
      content: `...`,
      genre: "Fantasy",
      popularity: "Trending",
      uploadDate: "This Month",
    },
    {
      title: "Stars Beyond Reach",
      author: "Zoe Chen",
      readTime: "22 min",
      imageUrl: "/placeholder.svg?height=300&width=400",
      content: `...`,
      genre: "Sci-Fi",
      popularity: "Most Read",
      uploadDate: "All Time",
    },
    {
      title: "Love in the Time of AI",
      author: "Samira Khan",
      readTime: "17 min",
      imageUrl: "/placeholder.svg?height=300&width=400",
      content: `...`,
      genre: "Romance",
      popularity: "Trending",
      uploadDate: "Today",
    },
    {
      title: "The Silent Witness",
      author: "David Lee",
      readTime: "28 min",
      imageUrl: "/placeholder.svg?height=300&width=400",
      content: `...`,
      genre: "Thriller",
      popularity: "Top Rated",
      uploadDate: "This Week",
    },
  ]

  // Update selectedGenre when initialGenre prop changes
  useEffect(() => {
    if (initialGenre) {
      setSelectedGenre(initialGenre)
    }
  }, [initialGenre])

  const availableGenres = ["Fantasy", "Sci-Fi", "Romance", "Thriller", "Mystery", "Horror", "Young Adult", "Historical"]
  const popularityOptions = ["Trending", "Most Read", "Top Rated"]
  const uploadDateOptions = ["Today", "This Week", "This Month", "All Time"]

  // Dummy filtering logic
  const filteredStories = allStories.filter((story) => {
    const matchesGenre = selectedGenre ? story.genre === selectedGenre : true
    const matchesPopularity = selectedPopularity ? story.popularity === selectedPopularity : true
    const matchesUploadDate = selectedUploadDate ? story.uploadDate === selectedUploadDate : true
    const matchesSearchTerm = searchTerm
      ? story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.genre.toLowerCase().includes(searchTerm.toLowerCase())
      : true
    return matchesGenre && matchesPopularity && matchesUploadDate && matchesSearchTerm
  })

  const displayedStories = filteredStories.slice(0, storiesToShow)

  const handleLoadMore = () => {
    setStoriesToShow((prev) => prev + 8) // Load 8 more stories
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-8 max-w-5xl">
      <div className="space-y-8">
        <section className="text-center py-16 md:py-24 bg-gradient-to-br from-misty-blue/20 to-lavender/20 rounded-xl shadow-lg">
          <h2 className="text-4xl sm:text-5xl font-serif font-bold mb-4 text-foreground drop-shadow-sm">
            Deep Dive into Discovery
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Find exactly what you're looking for.
          </p>
          <div className="max-w-xl mx-auto relative px-4">
            <SearchIcon className="absolute left-7 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search by title, author, genre, or tags..."
              className="w-full pl-10 pr-3 py-3 rounded-full border border-input bg-background shadow-md focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            variant="default" // Changed to default for primary styling
            className="mt-8 rounded-full px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
          >
            <FilterIcon className="h-4 w-4 mr-2" /> Advanced Filters
          </Button>
        </section>

        {/* Comprehensive Filter Options */}
        <section>
          <Card className="rounded-xl shadow-lg bg-card text-card-foreground p-6 md:p-8">
            <CardHeader>
              <CardTitle className="text-2xl font-serif font-semibold text-foreground">Filter Options</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-2 text-foreground">Genres</h4>
                <div className="flex flex-wrap gap-2">
                  {availableGenres.map((genre) => (
                    <Button
                      key={genre}
                      variant={selectedGenre === genre ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedGenre(selectedGenre === genre ? "" : genre)}
                      className={
                        selectedGenre === genre
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
                          : "rounded-full bg-transparent border-border text-foreground hover:bg-muted"
                      }
                    >
                      {genre}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-foreground">Popularity</h4>
                <div className="flex flex-wrap gap-2">
                  {popularityOptions.map((pop) => (
                    <Button
                      key={pop}
                      variant={selectedPopularity === pop ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedPopularity(selectedPopularity === pop ? "" : pop)}
                      className={
                        selectedPopularity === pop
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
                          : "rounded-full bg-transparent border-border text-foreground hover:bg-muted"
                      }
                    >
                      {pop}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-foreground">Upload Date</h4>
                <div className="flex flex-wrap gap-2">
                  {uploadDateOptions.map((date) => (
                    <Button
                      key={date}
                      variant={selectedUploadDate === date ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedUploadDate(selectedUploadDate === date ? "" : date)}
                      className={
                        selectedUploadDate === date
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
                          : "rounded-full bg-transparent border-border text-foreground hover:bg-muted"
                      }
                    >
                      {date}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Search Results / All Stories */}
        <section>
          <h3 className="text-2xl font-serif font-semibold mb-4 text-foreground">
            {selectedGenre || selectedPopularity || selectedUploadDate || searchTerm
              ? "Filtered Stories"
              : "All Stories"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedStories.length > 0 ? (
              displayedStories.map((story, index) => <StoryCard key={index} {...story} />)
            ) : (
              <p className="text-muted-foreground col-span-full text-center py-8">
                No stories found for the current selection.
              </p>
            )}
          </div>
          {filteredStories.length > storiesToShow && (
            <div className="text-center mt-8">
              <Button
                onClick={handleLoadMore}
                className="rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Load More Stories
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
