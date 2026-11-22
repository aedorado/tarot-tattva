'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Sparkles, BookMarked, Check, Compass, Sun, Moon, HelpCircle } from 'lucide-react';
import { TarotCard } from '@/types/tarot';
import { getCardNotes, saveCardNote } from '@/lib/storage';

interface CardModalProps {
  card: TarotCard | null;
  onClose: () => void;
}

export default function CardModal({ card, onClose }: CardModalProps) {
  const [activeTab, setActiveTab] = useState<'meanings' | 'correspondences' | 'notes'>('meanings');
  const [userNote, setUserNote] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (card) {
      const allNotes = getCardNotes();
      setUserNote(allNotes[card.name]?.notes || '');
      setSaveSuccess(false);
      setActiveTab('meanings');
    }
  }, [card]);

  if (!card) return null;

  const handleSaveNote = () => {
    saveCardNote(card.name, userNote);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-fade-in">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-parchment-surface border border-parchment-border shadow-card flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-parchment-base/80 hover:bg-parchment-base text-parchment-muted hover:text-parchment-text transition-colors border border-parchment-border"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left: Card Artwork */}
        <div className="md:w-5/12 bg-parchment-base p-6 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-parchment-border">
          <div className="relative w-44 h-72 sm:w-52 sm:h-88 rounded-xl overflow-hidden shadow-card border border-parchment-border my-auto">
            <Image
              src={`/cards/${card.img}`}
              alt={card.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 200px, 240px"
            />
          </div>

          <div className="w-full mt-4 text-center">
            <h2 className="font-serif text-xl sm:text-2xl font-normal text-parchment-text">
              {card.name}
            </h2>
            <div className="flex items-center justify-center gap-1.5 mt-1.5 text-[11px] text-parchment-dim">
              <span className="px-2 py-0.5 rounded bg-parchment-surface border border-parchment-border">
                {card.arcane}
              </span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded bg-parchment-surface border border-parchment-border">
                Suit: {card.suit}
              </span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded bg-parchment-surface border border-parchment-border">
                #{card.number}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Tabbed Study Details */}
        <div className="md:w-7/12 flex flex-col h-full overflow-hidden bg-parchment-surface">
          {/* Tabs */}
          <div className="flex items-center gap-1 border-b border-parchment-border px-6 pt-3 bg-parchment-surface">
            <button
              onClick={() => setActiveTab('meanings')}
              className={`pb-2.5 px-2.5 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'meanings'
                  ? 'border-parchment-brass text-parchment-brass'
                  : 'border-transparent text-parchment-muted hover:text-parchment-text'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Core Meanings
            </button>
            <button
              onClick={() => setActiveTab('correspondences')}
              className={`pb-2.5 px-2.5 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'correspondences'
                  ? 'border-parchment-brass text-parchment-brass'
                  : 'border-transparent text-parchment-muted hover:text-parchment-text'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              Symbolism &amp; Lore
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`pb-2.5 px-2.5 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'notes'
                  ? 'border-parchment-brass text-parchment-brass'
                  : 'border-transparent text-parchment-muted hover:text-parchment-text'
              }`}
            >
              <BookMarked className="w-3.5 h-3.5" />
              Course Notes
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6 overflow-y-auto flex-1 space-y-5">
            {activeTab === 'meanings' && (
              <>
                {/* Keywords */}
                <div>
                  <span className="text-[10px] uppercase font-semibold text-parchment-brass tracking-wider block mb-2">
                    Keywords
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {card.keywords.map((kw, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 text-xs rounded bg-parchment-base text-parchment-muted border border-parchment-border"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Divinatory / Fortune Telling */}
                {card.fortune_telling && card.fortune_telling.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-parchment-base border border-parchment-border">
                    <span className="text-[10px] uppercase font-semibold text-parchment-brass tracking-wider block mb-1.5">
                      Fortune Telling &amp; Divination
                    </span>
                    <ul className="list-disc list-inside text-xs text-parchment-muted space-y-1">
                      {card.fortune_telling.map((ft, i) => (
                        <li key={i}>{ft}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Light vs Shadow */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-parchment-base border border-parchment-border">
                    <div className="flex items-center gap-1.5 mb-1.5 text-parchment-brass font-medium text-xs">
                      <Sun className="w-3.5 h-3.5" />
                      <span>Light (Upright)</span>
                    </div>
                    <ul className="text-xs text-parchment-muted space-y-1.5 list-disc list-inside">
                      {card.meanings.light.map((m, i) => (
                        <li key={i} className="leading-relaxed">{m}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-xl bg-parchment-base border border-parchment-border">
                    <div className="flex items-center gap-1.5 mb-1.5 text-parchment-dim font-medium text-xs">
                      <Moon className="w-3.5 h-3.5" />
                      <span>Shadow (Reversed)</span>
                    </div>
                    <ul className="text-xs text-parchment-muted space-y-1.5 list-disc list-inside">
                      {card.meanings.shadow.map((m, i) => (
                        <li key={i} className="leading-relaxed">{m}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Reflection Questions */}
                {card.Questions && card.Questions.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-parchment-base border border-parchment-border">
                    <div className="flex items-center gap-1.5 mb-1.5 text-parchment-brass font-medium text-xs">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Reflection Questions</span>
                    </div>
                    <ul className="text-xs text-parchment-muted space-y-1 list-disc list-inside">
                      {card.Questions.map((q, i) => (
                        <li key={i}>{q}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}

            {activeTab === 'correspondences' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  {card.Archetype && (
                    <div className="p-3 rounded-lg bg-parchment-base border border-parchment-border">
                      <span className="text-[10px] text-parchment-dim block">Archetype</span>
                      <span className="font-medium text-parchment-text">{card.Archetype}</span>
                    </div>
                  )}
                  {card.Numerology && (
                    <div className="p-3 rounded-lg bg-parchment-base border border-parchment-border">
                      <span className="text-[10px] text-parchment-dim block">Numerology</span>
                      <span className="font-medium text-parchment-text">{card.Numerology}</span>
                    </div>
                  )}
                  {card.Elemental && (
                    <div className="p-3 rounded-lg bg-parchment-base border border-parchment-border">
                      <span className="text-[10px] text-parchment-dim block">Elemental</span>
                      <span className="font-medium text-parchment-text">{card.Elemental}</span>
                    </div>
                  )}
                  {card.Astrology && (
                    <div className="p-3 rounded-lg bg-parchment-base border border-parchment-border">
                      <span className="text-[10px] text-parchment-dim block">Astrology</span>
                      <span className="font-medium text-parchment-text">{card.Astrology}</span>
                    </div>
                  )}
                  {card.HebrewAlphabet && (
                    <div className="p-3 rounded-lg bg-parchment-base border border-parchment-border">
                      <span className="text-[10px] text-parchment-dim block">Hebrew Letter</span>
                      <span className="font-medium text-parchment-text">{card.HebrewAlphabet}</span>
                    </div>
                  )}
                  {card.Affirmation && (
                    <div className="p-3 rounded-lg bg-parchment-base border border-parchment-border">
                      <span className="text-[10px] text-parchment-dim block">Affirmation</span>
                      <span className="font-medium italic text-parchment-brass">{card.Affirmation}</span>
                    </div>
                  )}
                </div>

                {card.MythicalSpiritual && (
                  <div className="p-3.5 rounded-xl bg-parchment-base border border-parchment-border">
                    <span className="text-[10px] uppercase font-semibold text-parchment-brass tracking-wider block mb-1">
                      Mythical &amp; Spiritual Backstory
                    </span>
                    <p className="text-xs text-parchment-muted leading-relaxed">
                      {card.MythicalSpiritual}
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-parchment-muted">
                  <span>Take personal notes from your lectures for <strong>{card.name}</strong>.</span>
                  {saveSuccess && (
                    <span className="text-parchment-brass flex items-center gap-1 font-medium">
                      <Check className="w-3.5 h-3.5" /> Saved!
                    </span>
                  )}
                </div>

                <textarea
                  value={userNote}
                  onChange={(e) => setUserNote(e.target.value)}
                  placeholder="e.g. In lecture, the teacher highlighted this card as an indication of..."
                  rows={8}
                  className="w-full p-3.5 rounded-xl bg-parchment-base border border-parchment-border focus:border-parchment-brass focus:outline-none text-xs sm:text-sm text-parchment-text placeholder-parchment-dim resize-none"
                />

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveNote}
                    className="px-4 py-2 rounded-lg bg-parchment-brass hover:bg-parchment-brassHover text-parchment-base font-semibold text-xs transition-colors shadow-subtle flex items-center gap-1.5"
                  >
                    <BookMarked className="w-3.5 h-3.5" />
                    Save Note
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
