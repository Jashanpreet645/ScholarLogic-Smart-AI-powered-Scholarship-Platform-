"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "motion/react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground opacity-50">
        <Sun className="h-5 w-5" />
      </div>
    )
  }

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="relative w-10 h-10 shrink-0 aspect-square rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/40 hover:bg-primary/20 dark:hover:bg-primary/30 transition-all duration-300 active:scale-90 group outline-hidden hover:shadow-lg hover:shadow-primary/10"
      aria-label="Toggle theme"
    >
    

      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {theme === "light" ? (
            <motion.div
              key="sun"
              initial={{ rotate: -90, scale: 0, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 90, scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <Sun className="h-5 w-5 text-amber-500" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ rotate: -90, scale: 0, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 90, scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <Moon className="h-5 w-5 text-violet-400" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
