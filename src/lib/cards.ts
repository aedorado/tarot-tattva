import cardsData from '../../data/cards.json';
import { TarotCard } from '@/types/tarot';

export const allCards: TarotCard[] = cardsData as TarotCard[];

export function getCardByName(name: string): TarotCard | undefined {
  return allCards.find((c) => c.name.toLowerCase() === name.toLowerCase());
}

export function getMajorArcana(): TarotCard[] {
  return allCards.filter((c) => c.arcane === 'Major Arcana');
}

export function getMinorArcana(): TarotCard[] {
  return allCards.filter((c) => c.arcane === 'Minor Arcana');
}

export function getCardsBySuit(suit: TarotCard['suit']): TarotCard[] {
  return allCards.filter((c) => c.suit === suit);
}

export function searchCards(query: string): TarotCard[] {
  const q = query.toLowerCase().trim();
  if (!q) return allCards;
  return allCards.filter((card) => {
    return (
      card.name.toLowerCase().includes(q) ||
      card.suit.toLowerCase().includes(q) ||
      card.arcane.toLowerCase().includes(q) ||
      (card.keywords && card.keywords.some((k) => k.toLowerCase().includes(q))) ||
      (card.Archetype && card.Archetype.toLowerCase().includes(q)) ||
      (card.Elemental && card.Elemental.toLowerCase().includes(q)) ||
      (card.Astrology && card.Astrology.toLowerCase().includes(q)) ||
      (card.Numerology && card.Numerology.toLowerCase().includes(q))
    );
  });
}
