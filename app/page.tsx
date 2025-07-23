"use client"

import { useState, useEffect } from "react"
import AuthForm from "@/components/auth-form"
import StoryCard from "@/components/story-card"
import MobileNav from "@/components/mobile-nav"
import Header from "@/components/header"
import StoryReader from "@/components/story-reader"
import StoryEditor from "@/components/story-editor"
import UserProfile from "@/components/user-profile"
import LibraryView from "@/components/library-view"
import NotificationsView from "@/components/notifications-view"
import DiscoverView from "@/components/discover-view" // Import DiscoverView
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRightIcon } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false) // Simulate auth state
  // Change currentPage to an object to hold page name and optional params
  const [currentPage, setCurrentPage] = useState<{ name: string; params?: Record<string, any> }>({ name: "home" })
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Placeholder data for stories
  const stories = [
    {
      title: "The Whispering Woods",
      author: "Elara Vance",
      readTime: "15 min",
      imageUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder-ob7miW3mUreePYfXdVwkpFWHthzoR5.svg?height=300&width=400",
      content: `In the heart of the ancient realm, where shadows danced with forgotten light, lay the Whispering Woods. Its trees, gnarled and wise, had stood for millennia, their branches interwoven like the threads of time itself. Legend had it that the woods held secrets, whispered only to those brave enough to listen.

Elara, a young cartographer with an insatiable curiosity, ventured into its depths, her compass spinning wildly, useless against the magic that permeated the air. The path vanished behind her, replaced by a shimmering mist that clung to the moss-covered stones. Birds with iridescent feathers sang melodies that seemed to guide her deeper, while unseen creatures rustled in the undergrowth.

She stumbled upon a clearing, bathed in an ethereal glow. In its center stood a single, ancient oak, its bark etched with symbols that pulsed with a soft, inner light. As Elara reached out, a voice, as old as the woods themselves, echoed in her mind, not with words, but with feelings – a tapestry of joy, sorrow, and profound wisdom. It was the voice of the woods, sharing its memories, its very essence.

Days turned into nights, and Elara lost all sense of time. She learned of ancient civilizations that had thrived and fallen within the woods' embrace, of mythical beasts that roamed its hidden glades, and of a forgotten magic that once bound the world together. The woods didn't just whisper; they sang, they wept, they celebrated, and Elara became a part of their symphony.

When she finally emerged, the world outside seemed dull and muted. But Elara carried the whispers of the woods within her, a treasure trove of stories waiting to be told. Her maps would now chart not just lands, but the very soul of the world, guided by the ancient wisdom she had found in the heart of the Whispering Woods. And sometimes, on quiet nights, if you listened closely, you could still hear the faint echo of those whispers, carried on the wind, inviting others to listen.`,
    },
    {
      title: "Echoes of Starlight",
      author: "Kaelen Thorne",
      readTime: "20 min",
      imageUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder-ob7miW3mUreePYfXdVwkpFWHthzoR5.svg?height=300&width=400",
      content: `The galaxy was a canvas of swirling nebulae and distant suns, but for Captain Kaelen Thorne, it was a battlefield. His ship, the 'Stardust Drifter,' was a relic, patched together from salvaged parts, yet it was his home and his last hope. He chased the echoes of starlight, fragments of a lost civilization said to hold the key to universal peace.

His journey led him to the desolate planet of Xylos, a world scarred by ancient wars, where the very air hummed with residual energy. The ruins of a colossal city stretched across the horizon, silent monuments to a forgotten empire. Kaelen landed the 'Drifter' amidst the rubble, his boots crunching on crystalline dust.

Inside the ruins, he found not gold or power, but knowledge. Holographic projections flickered to life, depicting a civilization that had mastered the art of cosmic harmony, using starlight itself as a conduit for thought and emotion. They had built a network, a 'Chorus of Stars,' that connected every sentient being, fostering empathy and understanding.

But the Chorus had been shattered, its echoes now faint whispers across the void. Kaelen realized his quest wasn't to find a weapon, but to rekindle a song. He spent weeks deciphering the ancient texts, piecing together the fragments of their technology. It was a daunting task, one that tested his resolve and pushed him to the brink of despair.

Finally, with the last piece of the puzzle in place, Kaelen activated a dormant console. A single beam of pure starlight shot into the heavens, followed by another, and another, until the sky above Xylos was ablaze with a celestial symphony. Across the galaxy, dormant nodes of the Chorus flickered to life, and for a brief, glorious moment, every being felt a connection, a shared understanding.

The echoes of starlight had returned, not as a whisper, but as a resounding chorus. Kaelen Thorne, the lone captain, had not found peace, but had reignited the hope for it, a beacon in the vast, silent expanse of the cosmos. His journey was far from over, but now, he had a purpose: to help the galaxy remember the song of unity.`,
    },
    {
      title: "City of Forgotten Dreams",
      author: "Seraphina Nightshade",
      readTime: "10 min",
      imageUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder-ob7miW3mUreePYfXdVwkpFWHthzoR5.svg?height=300&width=400",
      content: `In the heart of the sprawling metropolis, hidden beneath layers of concrete and neon, lay the City of Forgotten Dreams. It was a place where aspirations went to die, where hopes withered, and where the echoes of what might have been lingered like ghosts. Seraphina Nightshade, a detective who specialized in the intangible, felt its pull.

Her latest case involved a string of disappearances, all linked by a common thread: the victims had all abandoned their grandest dreams just before vanishing. Seraphina followed the faint psychic trails, which led her to a forgotten subway station, its tracks overgrown with luminescent moss. Beyond a crumbling wall, she found it – a city built of discarded ambitions.

Buildings shaped like unwritten novels, bridges leading to unbuilt futures, and parks filled with the silent laughter of unlived moments. The air was heavy with a melancholic beauty. Seraphina realized the victims hadn't vanished; they had simply become part of this city, their essence absorbed by the very dreams they had forsaken.

She found the architect of this spectral city: a being of pure despair, born from the collective sorrow of humanity's unfulfilled potential. It fed on forgotten dreams, growing stronger with each abandoned hope. Seraphina knew she couldn't fight it with force; she had to rekindle a dream.

She thought of her own forgotten dream: to be a painter, to capture the vibrant chaos of the city on canvas. She pulled out a small sketchbook and began to draw, not the despair around her, but the vibrant, hopeful city she once envisioned. As she drew, a faint light emanated from her, pushing back the shadows.

The despairing entity recoiled, weakened by the surge of renewed hope. Seraphina didn't defeat it, but she created a sanctuary within the City of Forgotten Dreams, a place where new dreams could be born, and old ones could be remembered. She left the city, knowing that her work was far from over, but now, she carried a brush and a renewed purpose, ready to paint a brighter future, one dream at a time.`,
    },
    {
      title: "The Last Alchemist's Secret",
      author: "Rowan Blackwood",
      readTime: "25 min",
      imageUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder-ob7miW3mUreePYfXdVwkpFWHthzoR5.svg?height=300&width=400",
      content: `In a world where magic had faded into myth, and science reigned supreme, Rowan Blackwood, a reclusive scholar, stumbled upon a hidden chamber beneath his ancestral home. Dust-laden tomes and arcane instruments filled the room, remnants of his great-grandfather, the last known alchemist. Rowan, a skeptic by nature, dismissed it as mere eccentricity.

But then he found the journal. Its pages, brittle with age, detailed experiments not of turning lead into gold, but of transmuting emotions into tangible forms, of distilling memories into elixirs, and of weaving dreams into reality. The last entry spoke of a "Philosopher's Heart," a device capable of unlocking humanity's true potential.

Intrigued despite himself, Rowan began to decipher the alchemist's cryptic notes. He spent months, then years, meticulously recreating the experiments, his scientific mind clashing with the mystical principles. He failed countless times, but each failure revealed a deeper truth about the interconnectedness of matter and spirit.

He learned to harness the subtle energies of the world, not through incantations, but through precise calculations and intricate contraptions. He built the Philosopher's Heart, a complex mechanism of gears, crystals, and pulsating light, designed to resonate with the human soul.

When he finally activated it, the chamber filled with a blinding light, and Rowan felt a surge of understanding, a connection to every living thing. He saw the world not as a collection of separate entities, but as a single, vast, interconnected consciousness. The Philosopher's Heart didn't grant immortality or wealth; it granted enlightenment.

Rowan Blackwood, the last alchemist, had not found a way to turn lead into gold, but he had discovered something far more precious: the true gold of human experience, the boundless potential within each individual. He emerged from the chamber, no longer a skeptic, but a guardian of a profound secret, ready to share the wisdom of the Philosopher's Heart with a world that had forgotten its own magic.`,
    },
    {
      title: "Beneath the Crimson Sky",
      author: "Lyra Dawn",
      readTime: "12 min",
      imageUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder-ob7miW3mUreePYfXdVwkpFWHthzoR5.svg?height=300&width=400",
      content: `The planet Kaelen, perpetually bathed in the glow of its twin crimson suns, was a world of stark beauty and harsh realities. Lyra Dawn, a scavenger by trade, knew every crevice of its red canyons and every whisper of its dust storms. Her life was a constant struggle for survival, until she found the ancient artifact.

It was buried deep within a collapsed mine, a pulsating crystal that hummed with an alien energy. When Lyra touched it, visions flooded her mind: a lush, green Kaelen, teeming with life, before the crimson suns had scorched its surface. She saw a civilization that had once thrived, powered by the very crystal she now held.

The crystal was a key, a remnant of a terraforming project gone awry, designed to transform Kaelen into a paradise. But something had gone wrong, turning the suns crimson and the land barren. Lyra realized the crystal wasn't just a relic; it was a promise, a chance to restore her dying world.

She embarked on a perilous journey across the crimson wastes, guided by the crystal's faint hum and the visions it imparted. She faced sand beasts, rogue scavengers, and the relentless heat of the twin suns. Her only companions were her wits and the unwavering hope that the crystal offered.

Her quest led her to the highest peak of the Obsidian Spires, where a colossal, dormant machine lay half-buried in the rock. It was the heart of the terraforming project, powered by a network of crystals like the one she carried. With trembling hands, Lyra inserted her crystal into a slot, and the machine rumbled to life.

Slowly, agonizingly, the crimson sky began to shift. The air grew cooler, and a faint blue hue emerged from behind the red. Lyra watched as the first drops of rain fell, nourishing the parched earth. She had not just found an artifact; she had found a future. Beneath the changing sky, Lyra Dawn, the scavenger, became the harbinger of a new dawn for Kaelen, a testament to the power of hope in the face of desolation.`,
    },
    {
      title: "Chronicles of the Azure Sea",
      author: "Finnian Storm",
      readTime: "18 min",
      imageUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder-ob7miW3mUreePYfXdVwkpFWHthzoR5.svg?height=300&width=400",
      content: `The world of Aquatica was a vast, shimmering expanse of water, dotted with floating cities and submerged kingdoms. Finnian Storm, a young merman with an insatiable thirst for adventure, yearned to explore beyond the familiar coral reefs of his home. He dreamed of charting the uncharted depths, of discovering the legendary "Azure Sea," a mythical ocean said to hold the secrets of creation.

His elders dismissed it as a child's fantasy, but Finnian found an ancient map, etched onto a giant clam shell, that hinted at its existence. He gathered his courage, packed a few provisions, and set off into the open ocean, his trident his only companion.

His journey was fraught with peril. He navigated treacherous currents, outsmarted colossal sea beasts, and escaped the clutches of jealous kraken. He encountered merfolk from distant tribes, each with their own legends and lore, adding pieces to the puzzle of the Azure Sea.

He learned that the Azure Sea was not a physical place, but a state of being, a convergence of all life's energies, a place where thoughts manifested and dreams took form. It was guarded by ancient, sentient whales who communicated through song, their melodies weaving the very fabric of reality.

Finnian finally reached the heart of the Azure Sea, a vast, luminous expanse where the water glowed with an inner light. The ancient whales greeted him, their songs filling his mind with visions of the universe's birth and the interconnectedness of all life. He didn't find treasure or power, but a profound understanding of his place in the cosmos.

He returned to his home, no longer a restless youth, but a wise storyteller, sharing the chronicles of the Azure Sea with his people. He taught them that the greatest adventures were not found in distant lands, but within the depths of their own souls, and that the secrets of creation were not hidden, but sung in the symphony of life itself. Finnian Storm, the adventurer, became the keeper of the Azure Sea's wisdom, guiding his people towards a deeper harmony with their world.`,
    },
  ]

  // Simulate a story being "in progress" for the current user
  const inProgressStory = isAuthenticated ? stories[2] : null // "City of Forgotten Dreams"

  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
    setCurrentPage({ name: "home" }) // Redirect to home after login
  }

  // Update handleNavigate to accept params
  const handleNavigate = (pageName: string, params?: Record<string, any>) => {
    setCurrentPage({ name: pageName, params })
  }

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  }

  const pageTransition = {
    type: "tween" as const,
    ease: "anticipate" as const,
    duration: 0.4,
  }

  const renderPageContent = () => {
    if (!isAuthenticated) {
      return (
        <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
          <AuthForm onLoginSuccess={handleLoginSuccess} />
        </div>
      )
    }

    switch (currentPage.name) {
      case "home":
        return (
          <div className="space-y-8">
            {/* Wattpad-inspired Hero Section */}
            <section className="relative py-20 md:py-32 lg:py-40 bg-misty-blue rounded-xl overflow-hidden shadow-lg">
              <div className="container mx-auto px-4 md:px-8 text-center relative z-10">
                <h2 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 leading-tight tracking-tight drop-shadow-lg">
                  Your Story, Your World.
                </h2>
                <p className="text-xl sm:text-2xl text-white/90 mb-10 max-w-4xl mx-auto">
                  Sunega Novel is a next-generation storytelling and reading platform, thoughtfully crafted to be a
                  cleaner, more immersive, and more creator-focused alternative.
                </p>
                <div className="flex justify-center">
                  <Button
                    onClick={() => handleNavigate("discover")}
                    className="rounded-full px-8 py-3 text-lg bg-white text-primary hover:bg-gray-100 transition-all shadow-md"
                  >
                    Start Reading
                  </Button>
                </div>
              </div>
              {/* Abstract background shapes (inspired by Wattpad's orange blobs) */}
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blush-pink rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
              <div className="absolute -top-10 -right-10 w-96 h-96 bg-lavender rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-misty-blue rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blush-pink rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-1000"></div>
            </section>

            {/* Continue Reading Section */}
            {inProgressStory && (
              <section>
                <Card className="rounded-xl shadow-lg bg-card text-card-foreground p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
                  <div className="relative w-full md:w-48 h-48 md:h-32 flex-shrink-0 rounded-lg overflow-hidden">
                    <img
                      src={inProgressStory.imageUrl || "/placeholder.svg"}
                      alt={inProgressStory.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-serif font-semibold text-foreground mb-2">
                      Continue Reading: {inProgressStory.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">By {inProgressStory.author}</p>
                    <Button
                      onClick={() => handleNavigate("reader")}
                      className="rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      Resume Reading <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              </section>
            )}

            {/* Webtoons-inspired Genre Filters */}
            <section>
              <h3 className="text-2xl font-serif font-semibold mb-4 text-foreground">Explore Genres</h3>
              <div className="flex flex-wrap gap-2">
                {["Fantasy", "Sci-Fi", "Romance", "Thriller", "Mystery", "Horror", "Young Adult", "Historical"].map(
                  (genre) => (
                    <Button
                      key={genre}
                      variant="outline"
                      onClick={() => handleNavigate("discover", { genre })} // Make genre buttons clickable
                      className="rounded-full border-primary text-primary hover:bg-primary/10 bg-transparent"
                    >
                      {genre}
                    </Button>
                  ),
                )}
              </div>
            </section>

            {/* Webtoons-inspired Trending Stories */}
            <section>
              <h3 className="text-2xl font-serif font-semibold mb-4 text-foreground">Trending Stories</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {stories.slice(0, 4).map((story, index) => (
                  <StoryCard key={index} {...story} />
                ))}
              </div>
            </section>

            {/* Webtoons-inspired New Releases */}
            <section>
              <h3 className="text-2xl font-serif font-semibold mb-4 text-foreground">New Releases</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {stories.slice(2, 6).map((story, index) => (
                  <StoryCard key={index} {...story} />
                ))}
              </div>
            </section>

            {/* Webtoons-inspired Editor's Picks */}
            <section>
              <h3 className="text-2xl font-serif font-semibold mb-4 text-foreground">Editor's Picks</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {stories.slice(0, 3).map((story, index) => (
                  <StoryCard key={index} {...story} />
                ))}
              </div>
            </section>
          </div>
        )
      case "discover":
        return <DiscoverView initialGenre={currentPage.params?.genre} /> // Pass initialGenre to DiscoverView
      case "reader":
        return <StoryReader story={stories[0]} /> // Display the first story as an example
      case "write":
        return <StoryEditor onClose={() => setCurrentPage({ name: "home" })} />
      case "profile":
        return <UserProfile />
      case "library":
        return <LibraryView />
      case "notifications":
        return <NotificationsView />
      default:
        return null
    }
  }

  if (!isMounted) {
    return null // Avoid hydration mismatch
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      <Header
        isAuthenticated={isAuthenticated}
        onLoginClick={() => handleNavigate("login")} // Updated to use handleNavigate
        onNavigate={handleNavigate}
        currentPage={currentPage.name} // Pass currentPage.name
      />
      <AnimatePresence mode="wait">
        <motion.main
          key={currentPage.name} // Key off currentPage.name
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
          className="flex-1 p-4 md:p-8 pb-20 md:pb-8"
        >
          {renderPageContent()}
        </motion.main>
      </AnimatePresence>
      {isAuthenticated && <MobileNav onNavigate={handleNavigate} currentPage={currentPage.name} />}{" "}
      {/* Pass currentPage.name */}
      {/* Footer */}
      <footer className="hidden md:flex flex-col sm:flex-row items-center justify-between p-4 md:px-8 border-t border-border text-muted-foreground text-sm bg-background">
        <p>&copy; {new Date().getFullYear()} Sunega Novel. All rights reserved.</p>
        <nav className="flex gap-4 mt-2 sm:mt-0">
          <a href="#" className="hover:underline">
            Privacy Policy
          </a>
          <a href="#" className="hover:underline">
            Terms of Service
          </a>
          <a href="#" className="hover:underline">
            Contact Us
          </a>
        </nav>
      </footer>
    </div>
  )
}
