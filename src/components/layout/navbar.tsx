"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Menu } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { ThemeToggle } from "@/components/shared/theme-toggle"

interface NavLink {
  name: string
  href: string
  children?: { name: string; href: string }[]
}

const navLinks: NavLink[] = [
  { name: "الرئيسية", href: "/" },
  { name: "نبذة عني", href: "/about/" },
  {
    name: "الصفوف الدراسية",
    href: "#",
    children: [
      { name: "الصف الأول الثانوي", href: "/grades/grade1/" },
      { name: "الصف الثاني الثانوي", href: "/grades/grade2/" },
      { name: "الصف الثالث الثانوي", href: "/grades/grade3/" },
    ],
  },
  { name: "المواعيد", href: "/schedule/" },
  { name: "حجز السنة الجديدة", href: "/reserve/" },
  { name: "تواصل معي", href: "/#contact" },
]

function isActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/" || pathname === "/index.html"
  }
  return pathname.startsWith(href)
}

export function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "fixed top-4 right-1/2 translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl rounded-2xl border transition-all duration-300",
        scrolled
          ? "scrolled border-border/40 bg-background/80 shadow-lg backdrop-blur-md"
          : "border-transparent bg-background/60 backdrop-blur-sm"
      )}
    >
      <nav className="flex items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="text-lg font-bold text-primary hover:opacity-80 transition-opacity"
        >
          أ/ أشرف حسن
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          <NavigationMenu>
            <NavigationMenuList>
              {navLinks.map((link) => {
                if (link.children) {
                  return (
                    <NavigationMenuItem key={link.name}>
                      <NavigationMenuTrigger className="text-sm font-medium">
                        {link.name}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid gap-1 p-2 w-48">
                          {link.children.map((child) => (
                            <li key={child.name}>
                              <NavigationMenuLink
                                href={child.href}
                                className={cn(
                                  "block rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted",
                                  isActive(pathname, child.href) &&
                                    "bg-muted font-medium"
                                )}
                              >
                                {child.name}
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  )
                }

                return (
                  <NavigationMenuItem key={link.name}>
                    <NavigationMenuLink
                      href={link.href}
                      className={cn(
                        "inline-flex h-9 w-max items-center justify-center rounded-lg px-2.5 py-1.5 text-sm font-medium transition-all outline-none hover:bg-muted focus:bg-muted",
                        isActive(pathname, link.href) &&
                          "bg-muted font-medium text-primary"
                      )}
                    >
                      {link.name}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )
              })}
            </NavigationMenuList>
          </NavigationMenu>
          <ThemeToggle />
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger>
              <div
                className="inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground h-10 w-10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                aria-label="فتح القائمة"
              >
                <Menu className="size-5" />
              </div>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="text-right">القائمة</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-1 mt-4">
                {navLinks.map((link) => {
                  if (link.children) {
                    return (
                      <div key={link.name} className="space-y-1">
                        <div className="px-3 py-2 text-sm font-medium text-muted-foreground">
                          {link.name}
                        </div>
                        {link.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            onClick={() => setMobileOpen(false)}
                            className={cn(
                              "block rounded-md px-6 py-2 text-sm transition-colors hover:bg-muted",
                              isActive(pathname, child.href) &&
                                "bg-muted font-medium text-primary"
                            )}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )
                  }

                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                        isActive(pathname, link.href) &&
                          "bg-muted text-primary"
                      )}
                    >
                      {link.name}
                    </Link>
                  )
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </motion.header>
  )
}
