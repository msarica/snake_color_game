import { Level, Block } from '../types/game.js';
import { GameStateManager } from '../state/gameState.js';
import { COLOR_HEX_MAP } from '../utils/config.js';

export class GameGrid {
    private container: HTMLElement;
    private gridElement: HTMLElement | null = null;

    constructor(container: HTMLElement, _gameStateManager: GameStateManager) {
        this.container = container;
        this.render();
    }

    private render(): void {
        this.container.innerHTML = `
      <div class="game-grid">
        <div class="grid-container" id="grid-container">
          <!-- Grid will be generated here -->
        </div>
      </div>
    `;
        this.gridElement = this.container.querySelector('#grid-container');
    }

    public update(level: Level, selectedBlocks: Block[], gameStateManager: GameStateManager): void {
        if (!this.gridElement) return;

        // Clear existing grid
        this.gridElement.innerHTML = '';

        // Set grid size
        this.gridElement.style.gridTemplateColumns = `repeat(${level.gridSize.width}, 1fr)`;
        this.gridElement.style.gridTemplateRows = `repeat(${level.gridSize.height}, 1fr)`;

        // Create blocks
        level.blocks.forEach(block => {
            const blockElement = document.createElement('div');
            blockElement.className = `game-block ${block.isSelected ? 'selected' : ''}`;
            blockElement.style.backgroundColor = COLOR_HEX_MAP[block.color];

            // Ensure positioning context for overlay
            blockElement.style.position = 'relative';

            // If selected, show its selection order number
            if (block.isSelected) {
                const orderIndex = selectedBlocks.findIndex(b => b.id === block.id);
                if (orderIndex !== -1) {
                    const badge = document.createElement('div');
                    badge.textContent = String(orderIndex + 1);
                    badge.style.position = 'absolute';
                    badge.style.top = '4px';
                    badge.style.right = '6px';
                    badge.style.background = 'rgba(0,0,0,0.65)';
                    badge.style.color = '#fff';
                    badge.style.borderRadius = '10px';
                    badge.style.padding = '2px 6px';
                    badge.style.fontSize = '12px';
                    badge.style.lineHeight = '1';
                    badge.style.pointerEvents = 'none';
                    blockElement.appendChild(badge);
                }
            }

            // Add touch/click event listeners
            blockElement.addEventListener('click', () => {
                this.handleBlockClick(block, gameStateManager);
            });

            blockElement.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.handleBlockClick(block, gameStateManager);
            });

            this.gridElement!.appendChild(blockElement);
        });
    }

    private handleBlockClick(block: Block, gameStateManager: GameStateManager): void {
        if (block.isSelected) {
            // Deselect block
            gameStateManager.dispatch({ type: 'DESELECT_BLOCK', block });
        } else {
            // Try to select block
            gameStateManager.dispatch({ type: 'SELECT_BLOCK', block });
        }
    }
}
