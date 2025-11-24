"use client";
import { useState, useEffect } from "react";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavToggle,
  MobileNavHeader,
  MobileNavMenu,
  NavbarLogo,
} from "@/components/ui/resizable-navbar";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import Link from "next/link";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

export default function NavbarComponent() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", link: "/" },
    { name: "AI Chatbot", link: "/login" },
    {
      name: "More",
      submenu: [
        { name: "About", link: "/about" },
        { name: "Training", link: "/training" },
      ],
    },
  ];

  return (
    <Navbar className="fixed top-0 left-0 w-full z-50">
      {/* 🖥️ Desktop Navbar */}
      <NavBody isScrolled={isScrolled}>
        <NavbarLogo isScrolled={isScrolled} />
        <NavItems items={navItems} isScrolled={isScrolled} />

        <div className="flex items-center gap-4">
          <AnimatedThemeToggler
            className="relative z-50 cursor-pointer text-2xl p-1 rounded-full transition-colors text-foreground hover:text-muted-foreground"
          />
          <Link href="/login">
            <ShimmerButton
              background="var(--primary)"
              shimmerColor="var(--primary-foreground)"
              className="text-primary-foreground dark:[--bg:var(--accent)] dark:[--shimmer-color:var(--accent-foreground)] dark:text-accent-foreground"
            >
              Log In
            </ShimmerButton>
          </Link>

          <Link href="/signup">
            <ShimmerButton
              background="var(--primary)"
              shimmerColor="var(--primary-foreground)"
              className="text-primary-foreground dark:[--bg:var(--accent)] dark:[--shimmer-color:var(--accent-foreground)] dark:text-accent-foreground"
            >
              Sign Up
            </ShimmerButton>
          </Link>
        </div>
      </NavBody>

      {/* 📱 Mobile Navbar */}
      <MobileNav isScrolled={isScrolled}>
        <MobileNavHeader>
          <NavbarLogo isScrolled={isScrolled} />
          <div className="flex items-center gap-2">
            <AnimatedThemeToggler
              className="text-xl p-1 transition-colors text-foreground"
            />
            <MobileNavToggle
              isOpen={menuOpen}
              isScrolled={isScrolled}
              onClick={() => setMenuOpen(!menuOpen)}
            />
          </div>
        </MobileNavHeader>

        <MobileNavMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)}>
          {navItems.map((item, index) => (
            <a
              key={index}
              href={item.link}
              className="text-lg font-medium text-foreground"
              onClick={() => setMenuOpen(false)}
            >
              {item.name}
            </a>
          ))}
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
