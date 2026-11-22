'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Layers, Shuffle, BookMarked, Check, RotateCw } from 'lucide-react';
import { TarotCard } from '@/types/tarot';
import { allCards } from '@/lib/cards';
import { saveReading } from '@/lib/storage';

interface SpreadConfig {
  id: string;
  name: string;
  description: string;
  positions: { title: string; hint: string }[];
}

const SPREADS: SpreadConfig[] = [
  {
    id: 'single',
    name: '1-Card: Daily Guidance',
    description: 'A focused single draw for daily reflection, energetic theme, or direct advice.',
    positions: [{ title: 'Daily Guidance / Core Theme', hint: 'What energy to align with today' }]
  },
  {
    id: 'three-time',
    name: '3-Card: Past, Present, Future',
    description: 'Classical time-progression spread showing the root cause, current state, and likely outcome.',
    positions: [
      { title: 'The Past', hint: 'Root influences and lessons' },
      { title: 'The Present', hint: 'Current energy and situation' },
      { title: 'The Future', hint: 'Likely direction and outcome' }
    ]
  },
  {
    id: 'three-clarity',
    name: '3-Card: Situation, Action, Outcome',
    description: 'An action-oriented problem solving spread.',
    positions: [
      { title: 'The Situation', hint: 'What is really going on' },
      { title: 'The Action', hint: 'What advice or step to take' },
      { title: 'The Outcome', hint: 'What develops after the action' }
    ]
  },
  {
    id: 'five-cross',
    name: '5-Card: Elemental Cross',
    description: 'Comprehensive analysis of a situation with internal and external influences.',
    positions: [
      { title: 'Core Issue', hint: 'The heart of the matter' },
      { title: 'Challenge', hint: 'What crosses or tests you' },
      { title: 'Subconscious / Root', hint: 'Underlying foundation' },
      { title: 'Conscious / Mind', hint: 'Your conscious thoughts' },
      { title: 'Resolution', hint: 'The synthesized outcome' }
    ]
  }
];

interface DrawnCard {
  card: TarotCard;
  isReversed: boolean;
  isFlipped: boolean;
}

export default function SpreadsPage() {
  const [selectedSpreadId, setSelectedSpreadId] = useState<string>('three-time');
  const [question, setQuestion] = useState('');
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [userInterpretation, setUserInterpretation] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [allowReversals, setAllowReversals] = useState(true);

  const activeSpread = SPREADS.find((s) => s.id === selectedSpreadId) || SPREADS[0];

  const handleShuffleAndDeal = () => {
    const shuffled = [...allCards].sort(() => Math.random() - 0.5);
    const count = activeSpread.positions.length;
    const picked = shuffled.slice(0, count).map((card) => ({
      card,
      isReversed: allowReversals ? Math.random() > 0.65 : false,
      isFlipped: false
    }));

    setDrawnCards(picked);
    setUserInterpretation('');
    setSavedSuccess(false);
  };

  const flipCard = (index: number) => {
    setDrawnCards((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], isFlipped: true };
      return copy;
    });
  };

  const flipAll = () => {
    setDrawnCards((prev) => prev.map((c) => ({ ...c, isFlipped: true })));
  };

  const handleSaveToJournal = () => {
    if (!drawnCards.length) return;

    saveReading({
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      spreadType: activeSpread.name,
      question: question.trim() || 'General reading',
      cards: drawnCards.map((d, i) => ({
        positionTitle: activeSpread.positions[i]?.title || `Card ${i + 1}`,
        cardName: d.card.name,
        isReversed: d.isReversed
      })),
      userNotes: userInterpretation.trim()
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-normal text-parchment-text flex items-center gap-2">
            <Layers className="w-5 h-5 text-parchment-brass" />
            Interactive Practice Spreads
          </h1>
          <p className="text-xs sm:text-sm text-parchment-muted mt-0.5">
            Draw cards, practice your interpretations, and record readings into your course journal.
          </p>
        </div>

        <label className="flex items-center gap-2 text-xs text-parchment-dim cursor-pointer">
          <input
            type="checkbox"
            checked={allowReversals}
            onChange={(e) => setAllowReversals(e.target.checked)}
            className="rounded bg-parchment-surface border-parchment-border text-parchment-brass focus:ring-0"
          />
          Allow Reversed Cards
        </label>
      </div>

      {/* Setup */}
      <div className="p-4 sm:p-5 rounded-xl bg-parchment-surface border border-parchment-border space-y-4">
        <div className="flex flex-wrap gap-2">
          {SPREADS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setSelectedSpreadId(s.id);
                setDrawnCards([]);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedSpreadId === s.id
                  ? 'bg-parchment-brass text-parchment-base font-semibold shadow-subtle'
                  : 'bg-parchment-base text-parchment-muted hover:text-parchment-text border border-parchment-border'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Reading focus or question (e.g. Guidance for upcoming decision...)"
            className="flex-1 px-3.5 py-2 rounded-lg bg-parchment-base border border-parchment-border text-xs sm:text-sm text-parchment-text placeholder-parchment-dim focus:outline-none focus:border-parchment-brass"
          />

          <button
            onClick={handleShuffleAndDeal}
            className="px-5 py-2 rounded-lg bg-parchment-brass hover:bg-parchment-brassHover text-parchment-base font-semibold text-xs sm:text-sm shadow-subtle flex items-center justify-center gap-1.5 transition-colors"
          >
            <Shuffle className="w-3.5 h-3.5" />
            Shuffle &amp; Deal
          </button>
        </div>
      </div>

      {/* Deal Area */}
      {drawnCards.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-parchment-dim">
            <span>Tap each card to reveal its identity.</span>
            <button
              onClick={flipAll}
              className="text-parchment-brass hover:underline flex items-center gap-1"
            >
              <RotateCw className="w-3 h-3" /> Reveal All Cards
            </button>
          </div>

          <div className={`grid gap-4 ${
            drawnCards.length === 1 ? 'grid-cols-1 max-w-xs mx-auto' :
            drawnCards.length === 3 ? 'grid-cols-1 md:grid-cols-3' :
            'grid-cols-2 md:grid-cols-3 lg:grid-cols-5'
          }`}>
            {drawnCards.map((drawn, index) => {
              const pos = activeSpread.positions[index];
              return (
                <div key={index} className="flex flex-col items-center space-y-2.5">
                  <div className="text-center w-full">
                    <span className="font-serif text-xs font-medium text-parchment-brass block">
                      {pos?.title}
                    </span>
                    <span className="text-[10px] text-parchment-dim line-clamp-1">
                      {pos?.hint}
                    </span>
                  </div>

                  {/* 3D Flip Card */}
                  <div
                    onClick={() => flipCard(index)}
                    className="perspective-1000 w-40 h-68 sm:w-44 sm:h-76 cursor-pointer"
                  >
                    <div
                      className={`relative w-full h-full rounded-xl transition-transform duration-700 transform-style-3d ${
                        drawn.isFlipped ? 'rotate-y-180' : ''
                      }`}
                    >
                      {/* Back */}
                      <div className="absolute inset-0 backface-hidden rounded-xl overflow-hidden shadow-card border border-parchment-border bg-parchment-base">
                        <Image
                          src="/cards/back.jpg"
                          alt="Card Back"
                          fill
                          className="object-cover"
                          sizes="180px"
                        />
                        <div className="absolute inset-0 bg-black/15 hover:bg-transparent transition-colors flex items-center justify-center">
                          <span className="text-[10px] text-parchment-text bg-parchment-base/80 px-2 py-0.5 rounded border border-parchment-border/40">
                            Flip
                          </span>
                        </div>
                      </div>

                      {/* Front */}
                      <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-xl overflow-hidden shadow-card border border-parchment-border bg-parchment-base">
                        <Image
                          src={`/cards/${drawn.card.img}`}
                          alt={drawn.card.name}
                          fill
                          className={`object-cover transition-transform ${
                            drawn.isReversed ? 'rotate-180' : ''
                          }`}
                          sizes="180px"
                        />
                        <div className="absolute bottom-1.5 left-1.5 right-1.5 flex justify-between items-center text-[10px] bg-parchment-base/90 px-2 py-0.5 rounded border border-parchment-border/40 text-parchment-text">
                          <span className="truncate">{drawn.card.name}</span>
                          <span className={drawn.isReversed ? 'text-element-fire font-medium' : 'text-parchment-brass font-medium'}>
                            {drawn.isReversed ? 'Rev' : 'Upr'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Meaning preview */}
                  {drawn.isFlipped && (
                    <div className="w-full text-[11px] bg-parchment-surface p-2.5 rounded-lg border border-parchment-border text-parchment-muted space-y-1">
                      <div className="font-serif font-medium text-parchment-brass">
                        {drawn.isReversed ? 'Reversed (Shadow):' : 'Upright (Light):'}
                      </div>
                      <p className="line-clamp-2 leading-relaxed">
                        {drawn.isReversed
                          ? drawn.card.meanings.shadow[0]
                          : drawn.card.meanings.light[0]}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Synthesis Note */}
          <div className="p-4 sm:p-5 rounded-xl bg-parchment-surface border border-parchment-border space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-medium text-parchment-text text-sm">
                  Your Reading Synthesis &amp; Interpretation
                </h3>
                <p className="text-[11px] text-parchment-dim">
                  Practice synthesizing the cards based on your course principles and intuition.
                </p>
              </div>

              {savedSuccess && (
                <span className="text-xs text-parchment-brass flex items-center gap-1 font-medium">
                  <Check className="w-3.5 h-3.5" /> Saved to Journal!
                </span>
              )}
            </div>

            <textarea
              value={userInterpretation}
              onChange={(e) => setUserInterpretation(e.target.value)}
              placeholder="e.g. Card 1 shows... Card 2 brings the advice to... The key lesson is..."
              rows={4}
              className="w-full p-3.5 rounded-lg bg-parchment-base border border-parchment-border focus:border-parchment-brass focus:outline-none text-xs sm:text-sm text-parchment-text placeholder-parchment-dim resize-none"
            />

            <div className="flex justify-end">
              <button
                onClick={handleSaveToJournal}
                className="px-4 py-2 rounded-lg bg-parchment-brass hover:bg-parchment-brassHover text-parchment-base font-semibold text-xs shadow-subtle transition-colors flex items-center gap-1.5"
              >
                <BookMarked className="w-3.5 h-3.5" />
                Save Reading to Journal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
