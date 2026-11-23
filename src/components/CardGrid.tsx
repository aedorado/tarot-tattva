'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Search, BookMarked, Filter } from 'lucide-react';
import { TarotCard } from '@/types/tarot';
import { allCards } from '@/lib/cards';
import { getCardNotes } from '@/lib/storage';
import CardModal from './CardModal';

export default function CardGrid() {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null);
  const [userNotes, setUserNotes] = useState<Record<string, any>>({});

  React.useEffect(() => {
    setUserNotes(getCardNotes());
  }, [selectedCard]);

  const filteredCards = useMemo(() => {
    return allCards.filter((card) => {
      if (selectedFilter === 'major' && card.arcane !== 'Major Arcana') return false;
      if (selectedFilter === 'wands' && card.suit !== 'Wands') return false;
      if (selectedFilter === 'cups' && card.suit !== 'Cups') return false;
      if (selectedFilter === 'swords' && card.suit !== 'Swords') return false;
      if (selectedFilter === 'pentacles' && card.suit !== 'Pentacles') return false;
      if (selectedFilter === 'notes' && !userNotes[card.name]?.notes?.trim()) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = card.name.toLowerCase().includes(q);
        const matchesKeywords = card.keywords?.some((k) => k.toLowerCase().includes(q));
        const matchesArchetype = card.Archetype?.toLowerCase().includes(q);
        const matchesElement = card.Elemental?.toLowerCase().includes(q);
        const matchesAstrology = card.Astrology?.toLowerCase().includes(q);
        const matchesNumber = card.number === q;
        return matchesName || matchesKeywords || matchesArchetype || matchesElement || matchesAstrology || matchesNumber;
      }

      return true;
    });
  }, [selectedFilter, searchQuery, userNotes]);

  const filters = [
    { id: 'all', label: `All (${allCards.length})` },
    { id: 'major', label: 'Major Arcana (22)' },
    { id: 'wands', label: 'Wands (Fire)' },
    { id: 'cups', label: 'Cups (Water)' },
    { id: 'swords', label: 'Swords (Air)' },
    { id: 'pentacles', label: 'Pentacles (Earth)' },
    { id: 'notes', label: 'With Notes' },
  ];

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-xl border border-parchment-border shadow-soft">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-parchment-dim" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search card by name, keyword, archetype, element..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-parchment-bg border border-parchment-border text-xs sm:text-sm text-parchment-text placeholder-parchment-dim focus:outline-none focus:border-parchment-brass transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-parchment-dim hover:text-parchment-text"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-xs text-parchment-muted self-end sm:self-center">
          <Filter className="w-3.5 h-3.5 text-parchment-dim" />
          <span>Showing {filteredCards.length} cards</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setSelectedFilter(f.id)}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedFilter === f.id
                ? 'bg-parchment-brass text-white font-semibold shadow-soft'
                : 'bg-white text-parchment-muted hover:text-parchment-text hover:bg-parchment-elevated border border-parchment-border shadow-xs'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      {filteredCards.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-xl bg-white border border-parchment-border shadow-soft">
          <p className="text-sm text-parchment-muted">No cards matched your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {filteredCards.map((card) => {
            const hasNotes = Boolean(userNotes[card.name]?.notes?.trim());
            return (
              <div
                key={card.name}
                onClick={() => setSelectedCard(card)}
                className="group relative flex flex-col rounded-xl overflow-hidden bg-white border border-parchment-border hover:border-parchment-brass transition-all duration-200 shadow-card hover:shadow-cardHover cursor-pointer hover:-translate-y-0.5"
              >
                {/* Artwork */}
                <div className="relative aspect-[7/12] w-full overflow-hidden bg-[#f0ece3]">
                  <Image
                    src={`/cards/${card.img}`}
                    alt={card.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                    className="object-cover group-hover:scale-103 transition-transform duration-300"
                  />

                  {hasNotes && (
                    <div className="absolute top-2 right-2 p-1 rounded bg-parchment-brass text-white shadow-soft" title="Contains course notes">
                      <BookMarked className="w-3 h-3" />
                    </div>
                  )}

                  <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-white/95 text-[10px] text-parchment-muted font-medium border border-parchment-border/60 shadow-xs">
                    {card.suit === 'Trump' ? 'Major' : card.suit}
                  </div>
                </div>

                {/* Card Title & Keywords */}
                <div className="p-3 flex flex-col flex-1 justify-between bg-white border-t border-parchment-border/40">
                  <h4 className="font-serif font-medium text-xs sm:text-sm text-parchment-text group-hover:text-parchment-brass transition-colors truncate">
                    {card.name}
                  </h4>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {card.keywords?.slice(0, 2).map((kw, i) => (
                      <span key={i} className="text-[10px] text-parchment-muted bg-parchment-elevated px-1.5 py-0.5 rounded border border-parchment-border/50">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Card Detail Modal */}
      <CardModal
        card={selectedCard}
        onClose={() => setSelectedCard(null)}
      />
    </div>
  );
}
