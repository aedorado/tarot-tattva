'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Sparkles, Layers, BookmarkCheck } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Tarotpedia', icon: BookOpen },
    { href: '/study', label: 'Flashcards', icon: Sparkles },
    { href: '/spreads', label: 'Practice Spreads', icon: Layers },
    { href: '/journal', label: 'Course Journal', icon: BookmarkCheck },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-parchment-base/90 border-b border-parchment-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-md bg-parchment-brassMuted border border-parchment-brass/40 flex items-center justify-center group-hover:border-parchment-brass transition-colors">
            <span className="font-serif font-bold text-parchment-brass text-base select-none">T</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif tracking-wider text-parchment-text font-semibold text-lg">
              Tarot Tattva
            </span>
            <span className="hidden sm:inline-block text-[11px] uppercase tracking-widest text-parchment-dim border-l border-parchment-border pl-2">
              Study Companion
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-parchment-surface text-parchment-brass border border-parchment-borderLight'
                    : 'text-parchment-muted hover:text-parchment-text hover:bg-parchment-surface/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-parchment-brass' : 'text-parchment-dim'}`} />
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
