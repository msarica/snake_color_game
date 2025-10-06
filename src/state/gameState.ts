import { GameState, GameAction, Level, Block, Color } from '../types/game.js';
import { createLevel } from '../utils/gameLogic.js';
import { saveGameState, loadGameState, saveHighestLevel, loadHighestLevel } from '../utils/storage.js';
import { loadSettings } from '../utils/settings.js';

export class GameStateManager {
    private state: GameState;
    private currentLevel: Level | null = null;
    private listeners: Array<(state: GameState) => void> = [];

    constructor() {
        this.state = this.initializeState();
        this.loadFromStorage();
    }

    private initializeState(): GameState {
        return {
            currentLevel: 1,
            highestUnlockedLevel: 1,
            selectedBlocks: [],
            selectedPattern: [],
            isGameComplete: false
        };
    }

    private loadFromStorage(): void {
        const savedState = loadGameState();
        const savedHighestLevel = loadHighestLevel();

        if (savedState) {
            this.state = { ...this.state, ...savedState };
        }

        if (savedHighestLevel > this.state.highestUnlockedLevel) {
            this.state.highestUnlockedLevel = savedHighestLevel;
        }
    }

    public getState(): GameState {
        return { ...this.state };
    }

    public getCurrentLevel(): Level | null {
        return this.currentLevel;
    }

    public loadLevel(levelId: number): void {
        if (levelId > this.state.highestUnlockedLevel) {
            console.warn(`Level ${levelId} is not unlocked yet`);
            return;
        }

        this.currentLevel = createLevel(levelId);
        this.state.currentLevel = levelId;
        this.state.selectedBlocks = [];
        this.state.selectedPattern = [];
        this.notifyListeners();
    }

    public dispatch(action: GameAction): void {
        switch (action.type) {
            case 'SELECT_BLOCK':
                this.selectBlock(action.block);
                break;
            case 'DESELECT_BLOCK':
                this.deselectBlock(action.block);
                break;
            case 'RESET_LEVEL':
                this.resetLevel();
                break;
            case 'COMPLETE_LEVEL':
                this.completeLevel();
                break;
            case 'UNLOCK_LEVEL':
                this.unlockLevel(action.level);
                break;
            case 'LOAD_GAME':
                this.loadGame(action.state);
                break;
            case 'SAVE_GAME':
                this.saveGame();
                break;
        }
    }

    private selectBlock(block: Block): void {
        if (!this.currentLevel) return;

        // Check if block can be selected (adjacency)
        const canSelect = this.state.selectedBlocks.length === 0 ||
            this.areAdjacent(block, this.state.selectedBlocks[this.state.selectedBlocks.length - 1]);

        if (!canSelect) return;

        // Check if move is valid according to pattern (if prevent mistakes is enabled)
        const settings = loadSettings();
        if (settings.preventMistakes && !this.isValidMoveAccordingToPattern(block)) {
            return;
        }

        // Update block state
        const blockIndex = this.currentLevel.blocks.findIndex(b => b.id === block.id);
        if (blockIndex !== -1) {
            this.currentLevel.blocks[blockIndex].isSelected = true;
        }

        // Add to selected blocks
        this.state.selectedBlocks.push(block);

        // Update selected pattern to only include transitions
        this.updateSelectedPattern(block.color);

        this.notifyListeners();
    }

    private deselectBlock(block: Block): void {
        if (!this.currentLevel) return;

        // Find the index of the clicked block in the selected sequence
        const startIndex = this.state.selectedBlocks.findIndex(b => b.id === block.id);
        if (startIndex === -1) return;

        // If clicked is the last selected, nothing to remove
        if (startIndex === this.state.selectedBlocks.length - 1) {
            this.notifyListeners();
            return;
        }

        // Collect blocks to be removed (after the clicked index to the end)
        const removedBlocks = this.state.selectedBlocks.slice(startIndex + 1);

        // Splice selections after the clicked index (keep clicked selected)
        this.state.selectedBlocks.splice(startIndex + 1);

        // Rebuild the selected pattern from the remaining selected blocks
        this.rebuildSelectedPattern();

        // Clear isSelected for all removed blocks in the level
        const removedIds = new Set(removedBlocks.map(b => b.id));
        this.currentLevel.blocks.forEach(b => {
            if (removedIds.has(b.id)) {
                b.isSelected = false;
            }
        });

        this.notifyListeners();
    }

    private updateSelectedPattern(newColor: Color): void {
        // If this is the first block, add it to the pattern
        if (this.state.selectedPattern.length === 0) {
            this.state.selectedPattern.push(newColor);
            return;
        }

        // If the color is different from the last color in the pattern, add it
        const lastColor = this.state.selectedPattern[this.state.selectedPattern.length - 1];
        if (newColor !== lastColor) {
            this.state.selectedPattern.push(newColor);
        }
    }

    private rebuildSelectedPattern(): void {
        this.state.selectedPattern = [];

        if (this.state.selectedBlocks.length === 0) return;

        // Rebuild pattern from selected blocks, only including transitions
        for (const block of this.state.selectedBlocks) {
            this.updateSelectedPattern(block.color);
        }
    }

    private resetLevel(): void {
        if (!this.currentLevel) return;

        // Reset all blocks
        this.currentLevel.blocks.forEach(block => {
            block.isSelected = false;
            block.isConnected = false;
        });

        this.state.selectedBlocks = [];
        this.state.selectedPattern = [];

        this.notifyListeners();
    }

    private completeLevel(): void {
        if (!this.currentLevel) return;

        this.currentLevel.isCompleted = true;

        // Unlock next level
        const nextLevel = this.state.currentLevel + 1;
        if (nextLevel > this.state.highestUnlockedLevel) {
            this.state.highestUnlockedLevel = nextLevel;
            saveHighestLevel(nextLevel);
        }

        this.saveGame();
        this.notifyListeners();
    }

    private unlockLevel(level: number): void {
        if (level > this.state.highestUnlockedLevel) {
            this.state.highestUnlockedLevel = level;
            saveHighestLevel(level);
            this.notifyListeners();
        }
    }

    private loadGame(state: GameState): void {
        this.state = { ...state };
        this.notifyListeners();
    }

    private saveGame(): void {
        saveGameState(this.state);
    }

    private areAdjacent(block1: Block, block2: Block): boolean {
        const dx = Math.abs(block1.position.x - block2.position.x);
        const dy = Math.abs(block1.position.y - block2.position.y);
        return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
    }

    private isValidMoveAccordingToPattern(block: Block): boolean {
        if (!this.currentLevel) return false;

        const { pattern } = this.currentLevel;
        const currentPatternLength = this.state.selectedPattern.length;

        // If we haven't started the pattern yet, any color that matches the first pattern color is valid
        if (currentPatternLength === 0) {
            return block.color === pattern[0];
        }

        // Get the last color in the current selected pattern
        const lastSelectedColor = this.state.selectedPattern[currentPatternLength - 1];

        // If the clicked block is the same color as the last selected color, it's always valid
        // (we can have multiple blocks of the same color in sequence)
        if (block.color === lastSelectedColor) {
            return true;
        }

        // If it's a different color, check if it's the next expected transition in the pattern
        const currentPatternIndex = (currentPatternLength - 1) % pattern.length;
        const nextExpectedColor = pattern[(currentPatternIndex + 1) % pattern.length];

        return block.color === nextExpectedColor;
    }

    public subscribe(listener: (state: GameState) => void): () => void {
        this.listeners.push(listener);
        return () => {
            const index = this.listeners.indexOf(listener);
            if (index > -1) {
                this.listeners.splice(index, 1);
            }
        };
    }

    private notifyListeners(): void {
        this.listeners.forEach(listener => listener(this.getState()));
    }
}
