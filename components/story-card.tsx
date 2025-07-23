"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

interface StoryCardProps {
  title: string
  author: string
  readTime: string
  imageUrl: string
}

export default function StoryCard({ title, author, readTime, imageUrl }: StoryCardProps) {
  return (
    // Removed whileHover and transition props to remove bounce effect
    <div className="cursor-pointer">
      <Card className="w-full h-full rounded-xl overflow-hidden shadow-md bg-card text-card-foreground border-none">
        <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-72">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={title}
            layout="fill"
            objectFit="cover"
            className="rounded-t-xl"
          />
        </div>
        <CardContent className="p-4 space-y-2">
          <h3 className="text-xl font-serif font-semibold text-foreground line-clamp-2">{title}</h3>
          <p className="text-sm text-muted-foreground font-sans">By {author}</p>
          <p className="text-xs text-muted-foreground font-sans">{readTime} read</p>
        </CardContent>
      </Card>
    </div>
  )
}
