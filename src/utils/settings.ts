import { Settings } from '../types/game.js';

const DEFAULT_SETTINGS: Settings = {
    preventMistakes: false
};

const STORAGE_KEY = 'color-game-settings';

export function saveSettings(settings: Settings): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
        console.warn('Failed to save settings:', error);
    }
}

export function loadSettings(): Settings {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            return JSON.parse(saved) as Settings;
        }
    } catch (error) {
        console.warn('Failed to load settings:', error);
    }
    return DEFAULT_SETTINGS;
}

export function clearSettings(): void {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.warn('Failed to clear settings:', error);
    }
}
