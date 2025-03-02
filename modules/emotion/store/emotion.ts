import { atom } from 'jotai';
import { Emotion } from '../models';

/**
 * Atom for storing the current emotion type
 */
export const emotionTypeAtom = atom<string>('neutral');

/**
 * Atom for storing the current emotion entity from API
 */
export const currentEmotionAtom = atom<Emotion | null>(null);

/**
 * Atom for storing the loading state of emotion operations
 */
export const emotionLoadingAtom = atom<boolean>(false);

/**
 * Atom for storing any error from emotion operations
 */
export const emotionErrorAtom = atom<Error | null>(null);
