import { GameConfig, Color } from '../types/game.js';

export const GAME_CONFIG: GameConfig = {
    maxLevels: 50,
    colors: ['red', 'blue', 'green', 'yellow', 'purple', 'orange'],
    gridSizes: [
        { width: 2, height: 2 },
        { width: 3, height: 3 },
        { width: 4, height: 4 },
        { width: 5, height: 4 },
        { width: 5, height: 5 },
        { width: 6, height: 5 },
        { width: 6, height: 6 },
        { width: 7, height: 6 },
        { width: 7, height: 7 },
        { width: 8, height: 7 },
        { width: 8, height: 8 },
        { width: 9, height: 8 }
    ]
};

export const COLOR_HEX_MAP: Record<Color, string> = {
    red: '#e74c3c',
    blue: '#3498db',
    green: '#2ecc71',
    yellow: '#f1c40f',
    purple: '#9b59b6',
    orange: '#e67e22'
};

export const COLOR_LIGHT_MAP: Record<Color, string> = {
    red: '#fadbd8',
    blue: '#d6eaf8',
    green: '#d5f4e6',
    yellow: '#fef9e7',
    purple: '#e8daef',
    orange: '#fadbd8'
};

export const STORAGE_KEYS = {
    GAME_STATE: 'color-game-state',
    HIGHEST_LEVEL: 'color-game-highest-level'
} as const;
