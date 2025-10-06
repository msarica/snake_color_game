import { Color, GameState, Block } from '../types/game.js';
import { COLOR_HEX_MAP } from '../utils/config.js';
import { loadSettings } from '../utils/settings.js';

export class PatternDisplay {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.render();
  }

  private render(): void {
    this.container.innerHTML = `
      <div class="pattern-display">
        <div class="pattern-display-content">
          <h3>Match this pattern:</h3>
          <div class="pattern-container">
            <div class="target-pattern" id="target-pattern">
              <!-- Target pattern will be displayed here -->
            </div>
          </div>
        </div>
      </div>
    `;
  }

  public update(targetPattern: Color[], selectedPattern: Color[], _gameState?: GameState, selectedBlocks?: Block[]): void {
    const targetContainer = this.container.querySelector('#target-pattern');
    const settings = loadSettings();

    if (targetContainer) {
      targetContainer.innerHTML = '';
      targetPattern.forEach((color, index) => {
        const colorBlock = document.createElement('div');
        colorBlock.className = 'pattern-color-block';
        colorBlock.style.backgroundColor = COLOR_HEX_MAP[color];

        // Add indicator when prevent mistakes is enabled
        if (settings.preventMistakes && this.shouldShowIndicator(index, selectedPattern, targetPattern, selectedBlocks)) {
          const indicator = document.createElement('div');
          indicator.className = 'pattern-indicator';
          indicator.style.cssText = `
            position: absolute;
            top: -8px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-bottom: 12px solid #e74c3c;
            z-index: 10;
          `;
          colorBlock.style.position = 'relative';
          colorBlock.appendChild(indicator);
        }

        targetContainer.appendChild(colorBlock);
      });
    }
  }

  private shouldShowIndicator(patternIndex: number, _selectedPattern: Color[], targetPattern: Color[], selectedBlocks?: Block[]): boolean {
    if (selectedBlocks && selectedBlocks.length === 0) {
      // Show indicator on first color if no blocks selected yet
      return patternIndex === 0;
    }

    if (!selectedBlocks || selectedBlocks.length === 0) {
      return false;
    }

    // Find the correct position in the pattern cycle
    // Count how many color transitions have been made in the selected blocks
    let currentPosition = 0;
    for (let i = 1; i < selectedBlocks.length; i++) {
      if (selectedBlocks[i].color !== selectedBlocks[i - 1].color) {
        currentPosition++;
      }
    }
    currentPosition = currentPosition % targetPattern.length;

    // Show indicator on the current position in the pattern
    return patternIndex === currentPosition;
  }
}
