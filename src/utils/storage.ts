import { GameState } from '../types/game.js';
import { STORAGE_KEYS } from './config.js';

export function saveGameState(state: GameState): void {
    try {
        localStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(state));
    } catch (error) {
        console.warn('Failed to save game state:', error);
    }
}

export function loadGameState(): GameState | null {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.GAME_STATE);
        if (saved) {
            return JSON.parse(saved) as GameState;
        }
    } catch (error) {
        console.warn('Failed to load game state:', error);
    }
    return null;
}

export function saveHighestLevel(level: number): void {
    try {
        localStorage.setItem(STORAGE_KEYS.HIGHEST_LEVEL, level.toString());
    } catch (error) {
        console.warn('Failed to save highest level:', error);
    }
}

export function loadHighestLevel(): number {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.HIGHEST_LEVEL);
        if (saved) {
            return parseInt(saved, 10) || 1;
        }
    } catch (error) {
        console.warn('Failed to load highest level:', error);
    }
    return 1;
}

export function clearGameData(): void {
    try {
        localStorage.removeItem(STORAGE_KEYS.GAME_STATE);
        localStorage.removeItem(STORAGE_KEYS.HIGHEST_LEVEL);
    } catch (error) {
        console.warn('Failed to clear game data:', error);
    }
}
