import { GameState, Level } from '../types/game.js';

export class Header {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.render();
  }

  private render(): void {
    this.container.innerHTML = `
      <div class="header">
        <div class="header-content">
          <h1 class="game-title">Color Puzzle</h1>
          <div class="level-info">
            <button class="level-number level-trigger" id="open-level-dialog" aria-label="Change level">Level <span id="current-level">1</span> ⌄</button>
            <button class="control-button restart-button" id="restart-button" aria-label="Restart level">🔄 Restart</button>
            <button class="control-button settings-button" id="open-settings-dialog" aria-label="Open settings">⚙️ Settings</button>
          </div>
        </div>
      </div>
    `;
  }

  public update(state: GameState, level: Level): void {
    const levelElement = this.container.querySelector('#current-level');

    if (levelElement) {
      levelElement.textContent = level.id.toString();
    }
  }
}
