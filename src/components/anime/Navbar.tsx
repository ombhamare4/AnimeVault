"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Menu, X, Tv, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface NavbarProps {
  onSearch?: (query: string) => void;
  searchQuery?: string;
}

export function Navbar({ onSearch, searchQuery = "" }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim() && onSearch) {
      onSearch(localSearch.trim());
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "glass shadow-lg shadow-purple-500/5"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <Tv className="w-8 h-8 text-purple-500" />
              <Sparkles className="w-4 h-4 text-pink-500 absolute -top-1 -right-1" />
            </motion.div>
            <span className="text-xl font-bold gradient-text">
              AnimeVault
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/#trending">Trending</NavLink>
            <NavLink href="/#top">Top Rated</NavLink>
            <NavLink href="/#seasonal">Seasonal</NavLink>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <motion.div
                initial={false}
                animate={{ width: searchOpen ? 280 : 44 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <Input
                  type="text"
                  placeholder="Search anime..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className={cn(
                    "h-11 bg-white/5 border-purple-500/20 focus:border-purple-500/50",
                    "placeholder:text-slate-400 text-white rounded-full transition-all duration-200",
                    searchOpen ? "pl-4 pr-10 opacity-100" : "opacity-0 p-0"
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSearchOpen(!searchOpen);
                    if (searchOpen && localSearch.trim() && onSearch) {
                      onSearch(localSearch.trim());
                    }
                  }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full text-slate-300 hover:text-white hover:bg-white/5"
                >
                  <Search className="w-5 h-5" />
                </Button>
              </motion.div>
            </form>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-slate-300 hover:text-white rounded-full"
            >
              <Search className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-300 hover:text-white rounded-full"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden pb-4"
          >
            <form onSubmit={handleSearchSubmit}>
              <Input
                type="text"
                placeholder="Search anime..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="h-11 bg-white/5 border-purple-500/20 focus:border-purple-500/50 rounded-full"
              />
            </form>
          </motion.div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden pb-4"
          >
            <div className="flex flex-col gap-2">
              <MobileNavLink href="/" onClick={() => setMobileMenuOpen(false)}>
                Home
              </MobileNavLink>
              <MobileNavLink href="/#trending" onClick={() => setMobileMenuOpen(false)}>
                Trending
              </MobileNavLink>
              <MobileNavLink href="/#top" onClick={() => setMobileMenuOpen(false)}>
                Top Rated
              </MobileNavLink>
              <MobileNavLink href="/#seasonal" onClick={() => setMobileMenuOpen(false)}>
                Seasonal
              </MobileNavLink>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="relative text-slate-300 hover:text-white transition-colors py-2 group"
    >
      <span>{children}</span>
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 group-hover:w-full" />
    </Link>
  );
}

function MobileNavLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="text-slate-300 hover:text-white hover:bg-white/5 px-4 py-3 rounded-lg transition-all"
    >
      {children}
    </Link>
  );
}
