export type Color = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange';

export interface Position {
    x: number;
    y: number;
}

export interface Block {
    id: string;
    color: Color;
    position: Position;
    isSelected: boolean;
    isConnected: boolean;
}

export interface Level {
    id: number;
    gridSize: { width: number; height: number };
    colors: Color[];
    pattern: Color[];
    blocks: Block[];
    isCompleted: boolean;
    isUnlocked: boolean;
}

export interface GameState {
    currentLevel: number;
    highestUnlockedLevel: number;
    selectedBlocks: Block[];
    selectedPattern: Color[];
    isGameComplete: boolean;
}

export interface GameConfig {
    maxLevels: number;
    colors: Color[];
    gridSizes: { width: number; height: number }[];
}

export interface Settings {
    preventMistakes: boolean;
}

export type GameAction =
    | { type: 'SELECT_BLOCK'; block: Block }
    | { type: 'DESELECT_BLOCK'; block: Block }
    | { type: 'RESET_LEVEL' }
    | { type: 'COMPLETE_LEVEL' }
    | { type: 'UNLOCK_LEVEL'; level: number }
    | { type: 'LOAD_GAME'; state: GameState }
    | { type: 'SAVE_GAME' };
