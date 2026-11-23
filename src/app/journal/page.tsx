'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { BookmarkCheck, Trash2, Calendar, Download, Sparkles, BookOpen, Layers, GraduationCap } from 'lucide-react';
import { SavedReading, UserNote, TarotCard } from '@/types/tarot';
import { getSavedReadings, deleteReading, getCardNotes } from '@/lib/storage';
import { getCardByName } from '@/lib/cards';
import CardModal from '@/components/CardModal';

interface LectureItem {
  id: string;
  title: string;
  content: string;
}

export default function JournalPage() {
  const [activeTab, setActiveTab] = useState<'readings' | 'notes' | 'lectures'>('lectures');
  const [readings, setReadings] = useState<SavedReading[]>([]);
  const [notes, setNotes] = useState<Record<string, UserNote>>({});
  const [lectures, setLectures] = useState<LectureItem[]>([]);
  const [selectedLectureId, setSelectedLectureId] = useState<string>('');
  const [selectedCardForModal, setSelectedCardForModal] = useState<TarotCard | null>(null);

  useEffect(() => {
    setReadings(getSavedReadings());
    setNotes(getCardNotes());

    fetch('/api/lectures')
      .then((res) => res.json())
      .then((data: LectureItem[]) => {
        setLectures(data);
        if (data.length > 0) {
          setSelectedLectureId(data[0].id);
        }
      })
      .catch((err) => console.error('Failed to load lectures', err));
  }, []);

  const handleDeleteReading = (id: string) => {
    if (confirm('Delete this saved reading?')) {
      deleteReading(id);
      setReadings(getSavedReadings());
    }
  };

  const exportBackup = () => {
    const backupData = {
      date: new Date().toISOString(),
      courseNotes: notes,
      readings: readings
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tarot-tattva-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const cardsWithNotes = Object.values(notes).filter(n => n.notes?.trim().length > 0);
  const activeLecture = lectures.find((l) => l.id === selectedLectureId) || lectures[0];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-normal text-parchment-text flex items-center gap-2">
            <BookmarkCheck className="w-5 h-5 text-parchment-brass" />
            Course Journal &amp; Notes
          </h1>
          <p className="text-xs sm:text-sm text-parchment-muted mt-0.5">
            Review your course curriculum, card-specific lecture notes, and practice spreads.
          </p>
        </div>

        <button
          onClick={exportBackup}
          className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-parchment-elevated border border-parchment-border text-xs font-medium text-parchment-muted hover:text-parchment-text flex items-center gap-1.5 transition-colors shadow-soft"
        >
          <Download className="w-3.5 h-3.5 text-parchment-brass" />
          Export Backup (JSON)
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-parchment-border pb-2.5 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('lectures')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'lectures'
              ? 'bg-parchment-brass text-white font-semibold shadow-soft'
              : 'text-parchment-muted hover:text-parchment-text bg-white border border-parchment-border shadow-xs'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          Curriculum &amp; Lectures ({lectures.length})
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'notes'
              ? 'bg-parchment-brass text-white font-semibold shadow-soft'
              : 'text-parchment-muted hover:text-parchment-text bg-white border border-parchment-border shadow-xs'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          Card Lecture Notes ({cardsWithNotes.length})
        </button>

        <button
          onClick={() => setActiveTab('readings')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'readings'
              ? 'bg-parchment-brass text-white font-semibold shadow-soft'
              : 'text-parchment-muted hover:text-parchment-text bg-white border border-parchment-border shadow-xs'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Practice Readings ({readings.length})
        </button>
      </div>

      {/* Tab: Lectures */}
      {activeTab === 'lectures' && (
        <div className="space-y-4">
          {lectures.length > 1 && (
            <div className="flex gap-2">
              {lectures.map((lec) => (
                <button
                  key={lec.id}
                  onClick={() => setSelectedLectureId(lec.id)}
                  className={`px-3 py-1 rounded-md text-xs font-medium border ${
                    selectedLectureId === lec.id
                      ? 'border-parchment-brass text-parchment-brass bg-parchment-brassTint'
                      : 'border-parchment-border text-parchment-muted hover:text-parchment-text bg-white'
                  }`}
                >
                  {lec.title}
                </button>
              ))}
            </div>
          )}

          {activeLecture ? (
            <div className="p-6 sm:p-8 rounded-xl bg-white border border-parchment-border shadow-card text-parchment-text">
              <article className="prose max-w-none text-xs sm:text-sm leading-relaxed space-y-3.5">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => <h1 className="font-serif text-xl sm:text-2xl font-normal text-parchment-brass border-b border-parchment-border pb-3 mb-4">{children}</h1>,
                    h2: ({ children }) => <h2 className="font-serif text-base sm:text-lg font-medium text-parchment-text border-b border-parchment-border pb-1.5 mt-5 mb-2.5">{children}</h2>,
                    h3: ({ children }) => <h3 className="font-serif text-sm font-medium text-parchment-brass mt-3.5 mb-1.5">{children}</h3>,
                    p: ({ children }) => <p className="text-parchment-muted leading-relaxed my-2">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc list-inside space-y-1 text-parchment-muted my-2">{children}</ul>,
                    li: ({ children }) => <li className="text-parchment-muted">{children}</li>,
                    strong: ({ children }) => <strong className="font-semibold text-parchment-text">{children}</strong>,
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-2 border-parchment-brass bg-parchment-brassTint p-3 rounded-r-lg my-2.5 text-parchment-muted italic">
                        {children}
                      </blockquote>
                    ),
                    table: ({ children }) => (
                      <div className="overflow-x-auto my-3">
                        <table className="w-full text-xs text-left border border-parchment-border">{children}</table>
                      </div>
                    ),
                    th: ({ children }) => <th className="p-2 bg-parchment-elevated border-b border-parchment-border font-medium text-parchment-brass">{children}</th>,
                    td: ({ children }) => <td className="p-2 border-b border-parchment-border/60 text-parchment-muted">{children}</td>,
                    hr: () => <hr className="border-parchment-border my-5" />
                  }}
                >
                  {activeLecture.content}
                </ReactMarkdown>
              </article>
            </div>
          ) : (
            <div className="text-center py-12 text-parchment-dim text-xs">
              Loading course lectures...
            </div>
          )}
        </div>
      )}

      {/* Tab: Card Notes */}
      {activeTab === 'notes' && (
        <div className="space-y-4">
          {cardsWithNotes.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-xl bg-white border border-parchment-border shadow-soft">
              <BookOpen className="w-8 h-8 text-parchment-dim mx-auto mb-2 opacity-60" />
              <h3 className="font-serif text-base text-parchment-text">No card lecture notes yet</h3>
              <p className="text-xs text-parchment-muted mt-1 mb-4">
                Open any card in the Tarotpedia explorer and write notes in the &quot;Course Notes&quot; tab!
              </p>
              <Link
                href="/"
                className="px-3.5 py-1.5 rounded-lg bg-parchment-brass text-white font-semibold text-xs inline-block"
              >
                Browse Tarotpedia
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {cardsWithNotes.map((n) => {
                const card = getCardByName(n.cardName);
                if (!card) return null;
                return (
                  <div
                    key={n.cardName}
                    onClick={() => setSelectedCardForModal(card)}
                    className="p-3.5 rounded-xl bg-white border border-parchment-border hover:border-parchment-brass cursor-pointer transition-colors shadow-soft flex gap-3.5"
                  >
                    <div className="relative w-14 h-24 rounded overflow-hidden flex-shrink-0 border border-parchment-border bg-[#f0ece3]">
                      <Image
                        src={`/cards/${card.img}`}
                        alt={card.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif font-medium text-xs sm:text-sm text-parchment-brass truncate">
                        {card.name}
                      </h4>
                      <p className="text-xs text-parchment-muted mt-1 line-clamp-3 leading-relaxed whitespace-pre-wrap">
                        {n.notes}
                      </p>
                      <span className="text-[10px] text-parchment-dim block mt-1.5">
                        Click to view card &amp; edit notes
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab: Saved Readings */}
      {activeTab === 'readings' && (
        <div className="space-y-4">
          {readings.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-xl bg-white border border-parchment-border shadow-soft">
              <Sparkles className="w-8 h-8 text-parchment-dim mx-auto mb-2 opacity-60" />
              <h3 className="font-serif text-base text-parchment-text">No practice readings saved yet</h3>
              <p className="text-xs text-parchment-muted mt-1 mb-4">
                Deal cards in Practice Spreads and click &quot;Save Reading to Journal&quot;.
              </p>
              <Link
                href="/spreads"
                className="px-3.5 py-1.5 rounded-lg bg-parchment-brass text-white font-semibold text-xs inline-block"
              >
                Go to Practice Spreads
              </Link>
            </div>
          ) : (
            readings.map((reading) => (
              <div
                key={reading.id}
                className="p-4 sm:p-5 rounded-xl bg-white border border-parchment-border shadow-soft space-y-3.5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-parchment-brass tracking-wider">
                      {reading.spreadType}
                    </span>
                    <h3 className="font-serif text-base font-medium text-parchment-text mt-0.5">
                      {reading.question}
                    </h3>
                    <div className="flex items-center gap-1 text-[11px] text-parchment-dim mt-1">
                      <Calendar className="w-3 h-3" />
                      {reading.date}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteReading(reading.id)}
                    title="Delete reading"
                    className="p-1.5 rounded text-parchment-dim hover:text-element-fire transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 pt-1">
                  {reading.cards.map((rc, i) => {
                    const cardData = getCardByName(rc.cardName);
                    return (
                      <div
                        key={i}
                        onClick={() => cardData && setSelectedCardForModal(cardData)}
                        className="p-2 rounded-lg bg-parchment-bg border border-parchment-border flex items-center gap-2.5 cursor-pointer hover:border-parchment-brass transition-colors"
                      >
                        {cardData && (
                          <div className="relative w-8 h-14 rounded overflow-hidden flex-shrink-0 bg-[#f0ece3]">
                            <Image
                              src={`/cards/${cardData.img}`}
                              alt={cardData.name}
                              fill
                              className={`object-cover ${rc.isReversed ? 'rotate-180' : ''}`}
                            />
                          </div>
                        )}
                        <div className="min-w-0">
                          <span className="text-[9px] text-parchment-dim block truncate">
                            {rc.positionTitle}
                          </span>
                          <span className="text-[11px] font-medium text-parchment-text block truncate">
                            {rc.cardName}
                          </span>
                          <span className={`text-[9px] ${rc.isReversed ? 'text-element-fire font-medium' : 'text-parchment-brass font-medium'}`}>
                            {rc.isReversed ? 'Reversed' : 'Upright'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Interpretation */}
                {reading.userNotes && (
                  <div className="p-3 rounded-lg bg-parchment-bg border border-parchment-border text-xs text-parchment-muted leading-relaxed whitespace-pre-wrap">
                    <span className="font-medium text-parchment-brass block mb-1">
                      My Interpretation Notes:
                    </span>
                    {reading.userNotes}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Card Modal */}
      <CardModal
        card={selectedCardForModal}
        onClose={() => {
          setSelectedCardForModal(null);
          setNotes(getCardNotes());
        }}
      />
    </div>
  );
}
