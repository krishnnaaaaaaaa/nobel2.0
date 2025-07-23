"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
// Removed SunIcon, MoonIcon imports
// Removed useTheme import

interface HeaderProps {
  isAuthenticated: boolean
  onLoginClick: () => void
  onNavigate: (page: string) => void
  currentPage: string // Added to highlight active link
}

export default function Header({ isAuthenticated, onLoginClick, onNavigate, currentPage }: HeaderProps) {
  // Removed useTheme state and useEffect for mounting
  // const { theme, setTheme } = useTheme()
  // const [isMounted, setIsMounted] = useState(false)
  // useEffect(() => { setIsMounted(true) }, [])
  // if (!isMounted) { return null }

  const navLinkClass = (page: string) =>
    `text-foreground hover:text-primary ${currentPage === page ? "font-bold text-primary" : ""}`

  return (
    <header className="flex items-center justify-between p-4 md:px-8 border-b border-border bg-background">
      <h1 className="text-2xl font-serif font-bold text-primary">
        <Link href="#" onClick={() => onNavigate("home")}>
          Sunega Novel
        </Link>
      </h1>
      <nav className="hidden md:flex items-center gap-6">
        <Button variant="link" onClick={() => onNavigate("home")} className={navLinkClass("home")}>
          Home
        </Button>
        <Button variant="link" onClick={() => onNavigate("discover")} className={navLinkClass("discover")}>
          Discover
        </Button>
        {isAuthenticated && (
          <>
            <Button variant="link" onClick={() => onNavigate("library")} className={navLinkClass("library")}>
              Library
            </Button>
            <Button
              variant="link"
              onClick={() => onNavigate("notifications")}
              className={navLinkClass("notifications")}
            >
              Notifications
            </Button>
          </>
        )}
      </nav>
      <div className="flex items-center gap-4">
        {/* Removed theme toggle button */}
        {isAuthenticated ? (
          <Button
            variant="outline"
            className="rounded-lg hidden md:inline-flex bg-transparent border-border text-foreground hover:bg-muted"
            onClick={() => onNavigate("profile")}
          >
            Profile
          </Button>
        ) : (
          <Button
            onClick={onLoginClick}
            className="rounded-lg hidden md:inline-flex bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Login
          </Button>
        )}
      </div>
    </header>
  )
}
