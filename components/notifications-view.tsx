"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BellIcon, BookOpenIcon, UserPlusIcon, MessageSquareIcon, StarIcon } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface Notification {
  id: string
  type: "new_story" | "follow" | "comment" | "like"
  message: string
  timestamp: string
  read: boolean
}

export default function NotificationsView() {
  // Dummy notification data
  const notifications: Notification[] = [
    {
      id: "n1",
      type: "new_story",
      message: "New story 'The Whispering Woods' by Elara Vance is out!",
      timestamp: "2 hours ago",
      read: false,
    },
    {
      id: "n2",
      type: "follow",
      message: "Kaelen Thorne started following you.",
      timestamp: "5 hours ago",
      read: false,
    },
    {
      id: "n3",
      type: "comment",
      message: "Seraphina Nightshade commented on 'City of Forgotten Dreams'.",
      timestamp: "1 day ago",
      read: true,
    },
    {
      id: "n4",
      type: "like",
      message: "Your story 'The Last Alchemist's Secret' received 10 new likes!",
      timestamp: "2 days ago",
      read: true,
    },
    {
      id: "n5",
      type: "new_story",
      message: "Lyra Dawn published 'Beneath the Crimson Sky'.",
      timestamp: "3 days ago",
      read: true,
    },
  ]

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "new_story":
        return <BookOpenIcon className="h-5 w-5 text-misty-blue" />
      case "follow":
        return <UserPlusIcon className="h-5 w-5 text-lavender" />
      case "comment":
        return <MessageSquareIcon className="h-5 w-5 text-blush-pink" />
      case "like":
        return <StarIcon className="h-5 w-5 text-blush-pink" />
      default:
        return <BellIcon className="h-5 w-5 text-muted-foreground" />
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-8 max-w-3xl">
      <Card className="rounded-xl shadow-lg bg-card text-card-foreground p-6 md:p-8">
        <CardHeader className="mb-6">
          <CardTitle className="text-3xl font-serif font-bold text-primary">Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <div key={notification.id}>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1">
                    <p
                      className={`text-base ${notification.read ? "text-muted-foreground" : "font-medium text-foreground"}`}
                    >
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.timestamp}</p>
                  </div>
                  {!notification.read && <span className="w-2 h-2 bg-blush-pink rounded-full flex-shrink-0 mt-2" />}
                </div>
                {index < notifications.length - 1 && <Separator className="my-4 bg-border" />}
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-8">No new notifications.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
