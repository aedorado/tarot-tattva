export interface TarotCard {
  name: string;
  number: string;
  arcane: 'Major Arcana' | 'Minor Arcana';
  suit: 'Trump' | 'Cups' | 'Swords' | 'Wands' | 'Pentacles';
  img: string;
  fortune_telling: string[];
  keywords: string[];
  meanings: {
    light: string[];
    shadow: string[];
  };
  Archetype?: string;
  HebrewAlphabet?: string;
  Numerology?: string;
  Elemental?: string;
  MythicalSpiritual?: string;
  Questions?: string[];
  Astrology?: string;
  Affirmation?: string;
}

export interface UserNote {
  cardName: string;
  notes: string;
  updatedAt: string;
}

export interface SpreadPosition {
  title: string;
  description: string;
  card?: TarotCard;
  isReversed?: boolean;
}

export interface SavedReading {
  id: string;
  date: string;
  spreadType: string;
  question: string;
  cards: {
    positionTitle: string;
    cardName: string;
    isReversed: boolean;
  }[];
  userNotes: string;
}
