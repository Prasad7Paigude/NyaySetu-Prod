"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import Link from "next/link";
import { FaUserCircle } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

export default function DashNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const navItems = [
    { name: "Home", link: "/dashboard" },
    { name: "AI Chatbot", link: "/chatbot" },
    {
      name: "More",
      submenu: [
        { name: "About", link: "/about" },
        { name: "Training", link: "/training" },
        { name: "Feature", link: "/features" },
      ],
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  return (
    <Navbar className="fixed top-0 left-0 w-full z-50">
      {/* Desktop Navbar */}
      <NavBody isScrolled={isScrolled}>
        <NavbarLogo isScrolled={isScrolled} />
        <NavItems items={navItems} isScrolled={isScrolled} />

        {/* Theme Toggle + Profile Section */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle Button */}
          <AnimatedThemeToggler 
            className={`text-2xl p-1 rounded-full transition-colors ${
              isScrolled 
                ? "text-gray-700 dark:text-white hover:text-gray-500 dark:hover:text-gray-300" 
                : "text-white hover:text-gray-300"
            }`}
          />

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setProfileOpen(!profileOpen)}
              className={`text-2xl p-1 rounded-full transition-colors ${
                isScrolled 
                  ? "text-gray-700 dark:text-white hover:text-gray-500 dark:hover:text-gray-300" 
                  : "text-white hover:text-gray-300"
              }`}
              aria-label="User profile menu"
            >
              <FaUserCircle />
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg shadow-lg overflow-hidden z-50 border border-gray-200 dark:border-gray-700"
                >
                  <Link
                    href="/profile"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => setProfileOpen(false)}
                  >
                    Profile
                  </Link>

                  <button
                    type="button"
                    className="w-full text-left px-4 py-2 mt-1 bg-red-600 hover:bg-red-700 text-white rounded-md transition"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </NavBody>

      {/* Mobile Navbar */}
      <MobileNav isScrolled={isScrolled}>
        <MobileNavHeader>
          <NavbarLogo isScrolled={isScrolled} />
          <div className="flex items-center gap-2">
            <AnimatedThemeToggler 
              className={`text-xl p-1 transition-colors ${
                isScrolled 
                  ? "text-gray-700 dark:text-white" 
                  : "text-white"
              }`}
            />
            <MobileNavToggle
              isOpen={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
              isScrolled={isScrolled}
            />
          </div>
        </MobileNavHeader>

        <MobileNavMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)}>
          {navItems.map((item, index) => (
            <a
              key={index}
              href={item.link}
              className="text-lg font-medium text-gray-900 dark:text-neutral-200"
              onClick={() => setMenuOpen(false)}
            >
              {item.name}
            </a>
          ))}

          {/* Mobile Profile Links */}
          <div className="mt-4 border-t border-gray-300 dark:border-gray-700 pt-2">
            <Link
              href="/profile"
              className="block px-4 py-2 text-gray-900 dark:text-neutral-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
              onClick={() => setMenuOpen(false)}
            >
              Profile
            </Link>

            <Link
              href="/settings"
              className="block px-4 py-2 text-gray-900 dark:text-neutral-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
              onClick={() => setMenuOpen(false)}
            >
              Settings
            </Link>

            <button
              className="w-full text-left px-4 py-2 hover:bg-red-600 text-gray-900 dark:text-white hover:text-white rounded transition"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}