import { GameStateManager } from '../state/gameState.js';
import { GameState, Level } from '../types/game.js';
import { isPatternComplete } from '../utils/gameLogic.js';
import { Header } from './Header';
import { GameGrid } from './GameGrid';
import { PatternDisplay } from './PatternDisplay';
import { LevelDialog } from './LevelDialog';
import { SettingsDialog } from './SettingsDialog';
import { InstructionsDialog } from './InstructionsDialog';
import { LoadingScreen } from './LoadingScreen';

export class Game {
    private gameStateManager: GameStateManager;
    private container: HTMLElement;
    private header!: Header;
    private levelDialog!: LevelDialog;
    private settingsDialog!: SettingsDialog;
    private instructionsDialog!: InstructionsDialog;
    private patternDisplay!: PatternDisplay;
    private gameGrid!: GameGrid;
    private loadingScreen!: LoadingScreen;
    private currentState: GameState | null = null;
    private currentLevel: Level | null = null;

    constructor(container: HTMLElement) {
        this.container = container;
        this.gameStateManager = new GameStateManager();

        this.initializeComponents();
        this.setupEventListeners();
        this.loadInitialLevel();
    }

    private initializeComponents(): void {
        this.container.innerHTML = '';

        // Create main game structure
        this.container.innerHTML = `
      <div class="game-container">
        <div class="game-header"></div>
        <div class="level-dialog-container"></div>
        <div class="settings-dialog-container"></div>
        <div class="instructions-dialog-container"></div>
        <div class="pattern-display-container"></div>
        <div class="game-grid-container"></div>
        <div class="loading-screen-container"></div>
      </div>
    `;

        // Initialize components
        this.header = new Header(this.container.querySelector('.game-header')!, () => {
            this.instructionsDialog.open();
        });
        this.levelDialog = new LevelDialog(
            this.container.querySelector('.level-dialog-container')!,
            this.gameStateManager
        );
        this.settingsDialog = new SettingsDialog(this.container.querySelector('.settings-dialog-container')!);
        this.instructionsDialog = new InstructionsDialog(this.container.querySelector('.instructions-dialog-container')!);
        this.patternDisplay = new PatternDisplay(this.container.querySelector('.pattern-display-container')!);
        this.gameGrid = new GameGrid(this.container.querySelector('.game-grid-container')!, this.gameStateManager);
        this.loadingScreen = new LoadingScreen(this.container.querySelector('.loading-screen-container')!);
    }

    private setupEventListeners(): void {
        // Subscribe to game state changes
        this.gameStateManager.subscribe((state) => {
            this.currentState = state;
            this.currentLevel = this.gameStateManager.getCurrentLevel();
            this.updateUI();
        });

        // Open dialog when header level is clicked
        const attach = () => {
            const openBtn = this.container.querySelector('#open-level-dialog');
            const restartBtn = this.container.querySelector('#restart-button');
            const settingsBtn = this.container.querySelector('#open-settings-dialog');
            if (openBtn && !openBtn.getAttribute('data-bound')) {
                openBtn.setAttribute('data-bound', 'true');
                openBtn.addEventListener('click', () => {
                    this.levelDialog.open();
                });
            }
            if (restartBtn && !restartBtn.getAttribute('data-bound')) {
                restartBtn.setAttribute('data-bound', 'true');
                restartBtn.addEventListener('click', () => {
                    this.gameStateManager.dispatch({ type: 'RESET_LEVEL' });
                });
            }
            if (settingsBtn && !settingsBtn.getAttribute('data-bound')) {
                settingsBtn.setAttribute('data-bound', 'true');
                settingsBtn.addEventListener('click', () => {
                    this.settingsDialog.open();
                });
            }
        };
        attach();
    }

    private async loadInitialLevel(): Promise<void> {
        const state = this.gameStateManager.getState();
        await this.gameStateManager.loadLevel(state.currentLevel);
    }

    private updateUI(): void {
        if (!this.currentState) return;

        // Handle loading state
        if (this.currentState.isLoading) {
            this.loadingScreen.show();
            return;
        } else {
            this.loadingScreen.hide();
        }

        if (!this.currentLevel) return;

        // Update header
        this.header.update(this.currentState, this.currentLevel);

        // Update level dialog
        this.levelDialog.update(this.currentState);

        // Update pattern display
        this.patternDisplay.update(this.currentLevel.pattern, this.currentState.selectedPattern, this.currentState, this.currentState.selectedBlocks);

        // Update game grid
        this.gameGrid.update(this.currentLevel, this.currentState.selectedBlocks, this.gameStateManager);

        // Auto-check when all blocks selected and level not completed
        if (!this.currentLevel.isCompleted && this.currentLevel.blocks.every(b => b.isSelected)) {
            this.checkAndMaybeCompleteLevel();
        }

        // Show level complete dialog if completed
        if (this.currentLevel.isCompleted) {
            this.showLevelCompleteDialog();
        }
    }

    private checkAndMaybeCompleteLevel(): void {
        const state = this.gameStateManager.getState();
        const level = this.gameStateManager.getCurrentLevel();
        if (!level || level.isCompleted) return;

        const allBlocksSelected = level.blocks.every(block => block.isSelected);
        const patternMatches = isPatternComplete(state.selectedPattern, level.pattern);

        if (allBlocksSelected && patternMatches) {
            this.gameStateManager.dispatch({ type: 'COMPLETE_LEVEL' });
        }
    }

    private showLevelCompleteDialog(): void {
        // Avoid duplicate dialogs
        if (document.querySelector('#level-complete-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'level-complete-overlay';
        overlay.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      `;

        const dialog = document.createElement('div');
        dialog.style.cssText = `
        background: #2ecc71;
        color: white;
        padding: 24px 28px;
        border-radius: 12px;
        font-size: 22px;
        font-weight: bold;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        display: flex;
        flex-direction: column;
        gap: 16px;
        min-width: 260px;
        text-align: center;
      `;

        const title = document.createElement('div');
        title.textContent = '🎉 Level Complete!';

        const nextBtn = document.createElement('button');
        nextBtn.className = 'control-button next-level-button';
        nextBtn.textContent = '➡️ Next Level';
        nextBtn.style.cssText = `
        background: white;
        color: #2ecc71;
        padding: 10px 14px;
        border-radius: 8px;
        font-size: 18px;
        font-weight: 700;
        border: none;
        cursor: pointer;
      `;

        nextBtn.addEventListener('click', async () => {
            const state = this.gameStateManager.getState();
            await this.gameStateManager.loadLevel(state.currentLevel + 1);
            const existing = document.querySelector('#level-complete-overlay');
            if (existing && existing.parentElement) {
                existing.parentElement.removeChild(existing);
            }
        });

        dialog.appendChild(title);
        dialog.appendChild(nextBtn);
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
    }
}
