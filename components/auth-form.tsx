"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ChromeIcon } from "lucide-react"
import { FloatingLabelInput } from "@/components/ui/floating-label-input" // Import new component

interface AuthFormProps {
  onLoginSuccess: () => void
}

export default function AuthForm({ onLoginSuccess }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <Card className="w-full max-w-md mx-auto rounded-xl shadow-lg bg-card text-card-foreground">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-3xl font-serif">{isLogin ? "Welcome Back!" : "Join Sunega Novel"}</CardTitle>
        <CardDescription className="text-muted-foreground">
          {isLogin ? "Log in to continue your reading journey." : "Create an account to start writing and reading."}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-4">
          <FloatingLabelInput id="email" label="Email" type="email" />
          <FloatingLabelInput id="password" label="Password" type="password" />
          {!isLogin && <FloatingLabelInput id="confirm-password" label="Confirm Password" type="password" />}
          <Button
            className="w-full rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={onLoginSuccess}
          >
            {isLogin ? "Login" : "Sign Up"}
          </Button>
        </div>
        <div className="relative flex items-center justify-center text-xs uppercase">
          <Separator className="absolute inset-x-0 h-px bg-border" />
          <div className="relative z-10 bg-card px-2 text-muted-foreground">Or continue with</div>
        </div>
        <Button
          variant="outline"
          className="w-full rounded-lg flex items-center gap-2 border-border text-foreground hover:bg-muted bg-transparent"
        >
          <ChromeIcon className="w-5 h-5" />
          Google
        </Button>
      </CardContent>
      <CardFooter className="justify-center text-sm text-muted-foreground">
        {isLogin ? (
          <>
            Don't have an account?{" "}
            <Button variant="link" onClick={() => setIsLogin(false)} className="p-0 h-auto text-primary">
              Sign Up
            </Button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Button variant="link" onClick={() => setIsLogin(true)} className="p-0 h-auto text-primary">
              Login
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  )
}
