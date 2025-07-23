"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface FloatingLabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  id: string
}

const FloatingLabelInput = React.forwardRef<HTMLInputElement, FloatingLabelInputProps>(
  ({ className, type, id, label, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const [hasValue, setHasValue] = React.useState(false)

    const handleFocus = () => setIsFocused(true)
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      setHasValue(!!e.target.value)
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(!!e.target.value)
      if (props.onChange) {
        props.onChange(e)
      }
    }

    return (
      <div className="relative">
        <Input
          id={id}
          type={type}
          className={cn(
            "peer block w-full rounded-lg border border-input bg-background px-3 py-3 text-foreground shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary",
            "pt-6 pb-2", // Adjust padding for label
            className,
          )}
          placeholder=" " // Important for CSS :placeholder-shown
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          ref={ref}
          {...props}
        />
        <Label
          htmlFor={id}
          className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-all duration-200",
            "peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base",
            "peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary",
            (isFocused || hasValue) && "top-2 text-xs text-primary", // Keep label small if focused or has value
          )}
        >
          {label}
        </Label>
      </div>
    )
  },
)
FloatingLabelInput.displayName = "FloatingLabelInput"

export { FloatingLabelInput }
