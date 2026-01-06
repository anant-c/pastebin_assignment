"use client"

import { Copy, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import * as React from "react"

import { Button } from "@/components/ui/button"

export function Navbar() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center mx-auto px-4 justify-between">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                        <div className="bg-primary text-primary-foreground p-1 rounded-md">
                            <Copy className="size-5" />
                        </div>
                        <span>TextShare</span>
                    </Link>
                </div>
                <div className="flex flex-1 items-center justify-end space-x-2 md:justify-end">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                        aria-label="Toggle theme"
                    >
                        {mounted ? (theme === "dark" ? <Moon className="size-5" /> : <Sun className="size-5" />) : <span className="size-5" />}
                    </Button>
                </div>
            </div>
        </header>
    )
}
