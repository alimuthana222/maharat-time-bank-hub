
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { NavLinks } from "./navbar/NavLinks";
import { SearchBar } from "./navbar/SearchBar";
import { ThemeToggle } from "./navbar/ThemeToggle";
import { UserMenu } from "./navbar/UserMenu";
import { MobileMenu } from "./navbar/MobileMenu";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsScrolled(offset > 70);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? "bg-background/80 backdrop-blur-md border-b shadow-sm" 
          : "bg-background border-b"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <span className="font-bold text-2xl text-primary">مهارات</span>
            </Link>
            
            <NavLinks />
          </div>
          
          <div className="flex items-center gap-4">
            <SearchBar />
            <ThemeToggle />
            <UserMenu />
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
