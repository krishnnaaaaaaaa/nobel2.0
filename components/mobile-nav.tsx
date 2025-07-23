"use client"

import { HomeIcon, SearchIcon, BellIcon, UserIcon } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
// Removed useTheme import
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface MobileNavProps {
  onNavigate: (page: string) => void
  currentPage: string // Added to highlight active icon
}

export default function MobileNav({ onNavigate, currentPage }: MobileNavProps) {
  // Removed useTheme state
  // const { theme } = useTheme()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null // Avoid hydration mismatch
  }

  const getIconClass = (page: string) => `${currentPage === page ? "text-primary" : "text-muted-foreground"}`



  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50 md:hidden">
      <nav className="flex justify-around items-center h-16 px-4">
        <motion.div whileTap={{ scale: 0.9 }}>
          <Link
            href="#"
            onClick={() => onNavigate("home")}
            className="flex flex-col items-center gap-1 text-xs font-medium"
          >
            <HomeIcon className={`w-6 h-6 ${getIconClass("home")}`} />
            <span className={getIconClass("home")}>Home</span>
          </Link>
        </motion.div>
        <motion.div whileTap={{ scale: 0.9 }}>
          <Link
            href="#"
            onClick={() => onNavigate("discover")}
            className="flex flex-col items-center gap-1 text-xs font-medium"
          >
            <SearchIcon className={`w-6 h-6 ${getIconClass("discover")}`} />
            <span className={getIconClass("discover")}>Discover</span>
          </Link>
        </motion.div>
<motion.div whileTap={{ scale: 0.9 }}>
          <Link
            href="#"
            onClick={() => onNavigate("notifications")}
            className="flex flex-col items-center gap-1 text-xs font-medium"
          >
            <BellIcon className={`w-6 h-6 ${getIconClass("notifications")}`} />
            <span className={getIconClass("notifications")}>Notifications</span>
          </Link>
        </motion.div>
        <motion.div whileTap={{ scale: 0.9 }}>
          <Link
            href="#"
            onClick={() => onNavigate("profile")}
            className="flex flex-col items-center gap-1 text-xs font-medium"
          >
            <UserIcon className={`w-6 h-6 ${getIconClass("profile")}`} />
            <span className={getIconClass("profile")}>Profile</span>
          </Link>
        </motion.div>
      </nav>
    </div>
  )
}
