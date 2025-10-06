import { GameState } from '../types/game.js';
import { GameStateManager } from '../state/gameState.js';

export class LevelSelector {
    private container: HTMLElement;
    private gameStateManager: GameStateManager;

    constructor(container: HTMLElement, gameStateManager: GameStateManager) {
        this.container = container;
        this.gameStateManager = gameStateManager;
        this.render();
    }

    private render(): void {
        this.container.innerHTML = `
      <div class="level-selector">
        <div class="level-selector-content">
          <h3>Select Level</h3>
          <div class="level-buttons" id="level-buttons">
            <!-- Level buttons will be generated here -->
          </div>
        </div>
      </div>
    `;
    }

    public update(state: GameState): void {
        const levelButtonsContainer = this.container.querySelector('#level-buttons');
        if (!levelButtonsContainer) return;

        levelButtonsContainer.innerHTML = '';

        // Generate level buttons (show first 20 levels)
        const maxLevelsToShow = Math.min(20, state.highestUnlockedLevel + 5);

        for (let i = 1; i <= maxLevelsToShow; i++) {
            const button = document.createElement('button');
            button.className = `level-button ${i <= state.highestUnlockedLevel ? 'unlocked' : 'locked'} ${i === state.currentLevel ? 'current' : ''}`;
            button.textContent = i.toString();
            button.disabled = i > state.highestUnlockedLevel;

            if (i <= state.highestUnlockedLevel) {
                button.addEventListener('click', () => {
                    this.gameStateManager.loadLevel(i);
                });
            }

            levelButtonsContainer.appendChild(button);
        }
    }
}
