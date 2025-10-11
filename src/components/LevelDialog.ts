import { GameState } from '../types/game.js';
import { GAME_CONFIG } from '../utils/config.js';
import { GameStateManager } from '../state/gameState.js';

export class LevelDialog {
    private container: HTMLElement;
    private gameStateManager: GameStateManager;
    private isOpen: boolean = false;

    constructor(container: HTMLElement, gameStateManager: GameStateManager) {
        this.container = container;
        this.gameStateManager = gameStateManager;
        this.render();
        this.attachGlobalHandlers();
    }

    private render(): void {
        const existing = this.container.querySelector('.level-dialog-overlay');
        if (existing) return;

        const overlay = document.createElement('div');
        overlay.className = 'level-dialog-overlay';
        overlay.innerHTML = `
      <div class="level-dialog" role="dialog" aria-modal="true" aria-labelledby="level-dialog-title">
        <div class="level-dialog-header">
          <h3 id="level-dialog-title">Select Level</h3>
          <button class="level-dialog-close" id="level-dialog-close" aria-label="Close">✖</button>
        </div>
        <div class="level-dialog-body">
          <div class="level-buttons" id="dialog-level-buttons"></div>
        </div>
      </div>
    `;

        this.container.appendChild(overlay);

        const closeBtn = overlay.querySelector('#level-dialog-close');
        closeBtn?.addEventListener('click', () => this.close());

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) this.close();
        });
    }

    private attachGlobalHandlers(): void {
        document.addEventListener('keydown', (e) => {
            if (this.isOpen && e.key === 'Escape') {
                this.close();
            }
        });
    }

    public open(): void {
        const overlay = this.container.querySelector('.level-dialog-overlay') as HTMLElement | null;
        if (!overlay) return;
        this.isOpen = true;
        overlay.style.display = 'flex';
    }

    public close(): void {
        const overlay = this.container.querySelector('.level-dialog-overlay') as HTMLElement | null;
        if (!overlay) return;
        this.isOpen = false;
        overlay.style.display = 'none';
    }

    public update(state: GameState): void {
        const buttonsContainer = this.container.querySelector('#dialog-level-buttons');
        if (!buttonsContainer) return;

        buttonsContainer.innerHTML = '';

        const maxLevelsToShow = GAME_CONFIG.maxLevels;
        for (let i = 1; i <= maxLevelsToShow; i++) {
            const button = document.createElement('button');
            const isLocked = i > state.highestUnlockedLevel;
            const isCurrent = i === state.currentLevel;
            const isCompleted = i < state.highestUnlockedLevel; // linear progression implies earlier are completed

            button.className = `level-button ${isLocked ? 'locked' : 'unlocked'} ${isCurrent ? 'current' : ''} ${isCompleted ? 'completed' : ''}`;
            button.textContent = i.toString();
            button.disabled = isLocked;

            if (!isLocked) {
                button.addEventListener('click', async () => {
                    await this.gameStateManager.loadLevel(i);
                    this.close();
                });
            }

            buttonsContainer.appendChild(button);
        }
    }
}


