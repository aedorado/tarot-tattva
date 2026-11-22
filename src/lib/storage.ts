import { SavedReading, UserNote } from '@/types/tarot';

const NOTES_KEY = 'tarot_tattva_card_notes';
const READINGS_KEY = 'tarot_tattva_readings';

export function getCardNotes(): Record<string, UserNote> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error('Failed to load notes', e);
    return {};
  }
}

export function saveCardNote(cardName: string, notes: string): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getCardNotes();
    current[cardName] = {
      cardName,
      notes,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(NOTES_KEY, JSON.stringify(current));
  } catch (e) {
    console.error('Failed to save note', e);
  }
}

export function getSavedReadings(): SavedReading[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(READINGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to load readings', e);
    return [];
  }
}

export function saveReading(reading: SavedReading): void {
  if (typeof window === 'undefined') return;
  try {
    const list = getSavedReadings();
    list.unshift(reading);
    localStorage.setItem(READINGS_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save reading', e);
  }
}

export function deleteReading(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const list = getSavedReadings().filter(r => r.id !== id);
    localStorage.setItem(READINGS_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to delete reading', e);
  }
}
