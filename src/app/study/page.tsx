'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Sparkles, RotateCw, CheckCircle, RefreshCcw, Sun, Moon, ArrowRight, ArrowLeft } from 'lucide-react';
import { TarotCard } from '@/types/tarot';
import { allCards } from '@/lib/cards';
import { getCardNotes } from '@/lib/storage';

export default function StudyPage() {
  const [deckType, setDeckType] = useState<'all' | 'major' | 'wands' | 'cups' | 'swords' | 'pentacles'>('major');
  const [deck, setDeck] = useState<TarotCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCount, setMasteredCount] = useState(0);
  const [userNotes, setUserNotes] = useState<Record<string, any>>({});

  useEffect(() => {
    let pool = [...allCards];
    if (deckType === 'major') pool = pool.filter(c => c.arcane === 'Major Arcana');
    if (deckType === 'wands') pool = pool.filter(c => c.suit === 'Wands');
    if (deckType === 'cups') pool = pool.filter(c => c.suit === 'Cups');
    if (deckType === 'swords') pool = pool.filter(c => c.suit === 'Swords');
    if (deckType === 'pentacles') pool = pool.filter(c => c.suit === 'Pentacles');

    const shuffled = pool.sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setMasteredCount(0);
    setUserNotes(getCardNotes());
  }, [deckType]);

  const currentCard = deck[currentIndex];

  const handleNext = (mastered = false) => {
    if (mastered) setMasteredCount(prev => prev + 1);
    setIsFlipped(false);
    if (currentIndex < deck.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleShuffle = () => {
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setMasteredCount(0);
  };

  if (!currentCard) return null;
  const noteForCurrent = userNotes[currentCard.name]?.notes;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-normal text-parchment-text flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-parchment-brass" />
            Active Recall Flashcards
          </h1>
          <p className="text-xs sm:text-sm text-parchment-muted mt-0.5">
            Test yourself on card imagery, light/shadow interpretations, and personal lecture notes.
          </p>
        </div>

        {/* Deck Selector */}
        <div className="flex items-center gap-2">
          <select
            value={deckType}
            onChange={(e) => setDeckType(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg bg-parchment-surface border border-parchment-border text-xs sm:text-sm text-parchment-text focus:outline-none focus:border-parchment-brass"
          >
            <option value="major">Major Arcana (22)</option>
            <option value="all">Full Deck (78)</option>
            <option value="wands">Wands (Fire)</option>
            <option value="cups">Cups (Water)</option>
            <option value="swords">Swords (Air)</option>
            <option value="pentacles">Pentacles (Earth)</option>
          </select>

          <button
            onClick={handleShuffle}
            title="Reshuffle deck"
            className="p-2 rounded-lg bg-parchment-surface border border-parchment-border hover:border-parchment-brass text-parchment-muted hover:text-parchment-text transition-colors"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between text-xs text-parchment-dim bg-parchment-surface px-4 py-2 rounded-lg border border-parchment-border">
        <span>Card {currentIndex + 1} of {deck.length}</span>
        <div className="flex-1 mx-4 bg-parchment-base rounded-full h-1 overflow-hidden">
          <div
            className="bg-parchment-brass h-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / deck.length) * 100}%` }}
          />
        </div>
        <span>Mastered: {masteredCount}</span>
      </div>

      {/* Flashcard Component */}
      <div className="perspective-1000 min-h-[460px]">
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className={`relative w-full min-h-[460px] rounded-2xl transition-transform duration-700 transform-style-3d cursor-pointer ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* Front: Card Artwork */}
          <div className="absolute inset-0 backface-hidden rounded-2xl bg-parchment-surface border border-parchment-border shadow-card p-6 flex flex-col items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-parchment-dim">
              Tap card to flip &amp; reveal answer
            </span>

            <div className="relative w-44 h-72 sm:w-52 sm:h-88 rounded-xl overflow-hidden shadow-card border border-parchment-border my-auto">
              <Image
                src={`/cards/${currentCard.img}`}
                alt={currentCard.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 200px, 240px"
                priority
              />
            </div>

            <span className="text-xs text-parchment-dim flex items-center justify-center gap-1">
              <RotateCw className="w-3.5 h-3.5" /> Click anywhere to flip
            </span>
          </div>

          {/* Back: Details */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl bg-parchment-surface border border-parchment-border shadow-card p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4">
              <div className="text-center border-b border-parchment-border pb-3">
                <span className="text-[10px] text-parchment-brass tracking-widest uppercase">
                  {currentCard.arcane} • {currentCard.suit}
                </span>
                <h2 className="font-serif text-2xl font-normal text-parchment-text mt-0.5">
                  {currentCard.name}
                </h2>
              </div>

              {/* Keywords */}
              <div>
                <span className="text-[10px] uppercase font-semibold text-parchment-dim tracking-wider block mb-1.5">
                  Keywords
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentCard.keywords.map((kw, i) => (
                    <span key={i} className="px-2.5 py-0.5 text-xs rounded bg-parchment-base text-parchment-brass border border-parchment-border">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Light & Shadow */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 rounded-xl bg-parchment-base border border-parchment-border">
                  <div className="flex items-center gap-1 font-medium text-parchment-brass mb-1">
                    <Sun className="w-3.5 h-3.5" /> Light (Upright)
                  </div>
                  <ul className="space-y-1 list-disc list-inside text-parchment-muted">
                    {currentCard.meanings.light.slice(0, 3).map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-parchment-base border border-parchment-border">
                  <div className="flex items-center gap-1 font-medium text-parchment-dim mb-1">
                    <Moon className="w-3.5 h-3.5" /> Shadow (Reversed)
                  </div>
                  <ul className="space-y-1 list-disc list-inside text-parchment-muted">
                    {currentCard.meanings.shadow.slice(0, 3).map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Course Notes */}
              {noteForCurrent ? (
                <div className="p-3 rounded-xl bg-parchment-base border border-parchment-brass/30">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-parchment-brass block mb-1">
                    Your Course Notes
                  </span>
                  <p className="text-xs text-parchment-muted whitespace-pre-wrap">{noteForCurrent}</p>
                </div>
              ) : (
                <div className="text-center py-1 text-xs text-parchment-dim italic">
                  No personal notes saved yet for this card (you can add notes in Tarotpedia).
                </div>
              )}
            </div>

            <div className="text-center pt-3 border-t border-parchment-border">
              <span className="text-[11px] text-parchment-dim">Tap to flip back</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="px-3.5 py-2 rounded-lg bg-parchment-surface hover:bg-parchment-elevated disabled:opacity-30 disabled:cursor-not-allowed border border-parchment-border text-xs sm:text-sm font-medium flex items-center gap-1.5 text-parchment-muted hover:text-parchment-text transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Previous
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleNext(false)}
            className="px-3.5 py-2 rounded-lg bg-parchment-surface hover:bg-parchment-elevated border border-parchment-border text-xs sm:text-sm font-medium text-parchment-muted hover:text-parchment-text transition-colors"
          >
            Review Again
          </button>
          <button
            onClick={() => handleNext(true)}
            className="px-4 py-2 rounded-lg bg-parchment-brass hover:bg-parchment-brassHover text-parchment-base font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-subtle transition-colors"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            I Know This!
          </button>
        </div>

        <button
          onClick={() => handleNext(false)}
          className="px-3.5 py-2 rounded-lg bg-parchment-surface hover:bg-parchment-elevated border border-parchment-border text-xs sm:text-sm font-medium flex items-center gap-1.5 text-parchment-muted hover:text-parchment-text transition-colors"
        >
          Next <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
