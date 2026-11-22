import React from 'react';
import CardGrid from '@/components/CardGrid';
import { Sparkles, Layers } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-parchment-surface border border-parchment-border">
        <div className="max-w-2xl space-y-3">
          <span className="text-[11px] font-semibold tracking-widest text-parchment-brass uppercase">
            Course Study Deck • Rider–Waite
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl text-parchment-text font-normal tracking-tight">
            Tarotpedia &amp; Symbolism Guide
          </h1>
          <p className="text-xs sm:text-sm text-parchment-muted leading-relaxed">
            Study the 78 cards, their traditional symbolism, light and shadow interpretations, and add your personal lecture notes as you progress through your course.
          </p>

          <div className="pt-2 flex flex-wrap gap-2.5">
            <Link
              href="/study"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-parchment-brass text-parchment-base font-medium text-xs shadow-subtle hover:bg-parchment-brassHover transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Active Recall Flashcards
            </Link>
            <Link
              href="/spreads"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-parchment-elevated hover:bg-parchment-border text-parchment-text border border-parchment-border text-xs font-medium transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-parchment-dim" />
              Practice Spreads
            </Link>
          </div>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <CardGrid />
    </div>
  );
}
