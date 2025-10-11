import { GameState, Level } from '../types/game.js';

// Declare the global version variable injected by Vite
declare const __APP_VERSION__: string;

export class Header {
  private container: HTMLElement;
  private onInfoClick?: () => void;

  constructor(container: HTMLElement, onInfoClick?: () => void) {
    this.container = container;
    this.onInfoClick = onInfoClick;
    this.render();
    this.setupEventListeners();
  }

  private render(): void {
    this.container.innerHTML = `
      <div class="header">
        <div class="header-content">
          <h1 class="game-title">Snake Color Puzzle <span class="version">v${__APP_VERSION__}</span><button class="info-button-small" id="info-button" aria-label="View instructions" title="How to Play">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <path d="M12 16v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M12 8h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button></h1>
          <div class="level-info">
            <button class="level-number level-trigger" id="open-level-dialog" aria-label="Change level">Level <span id="current-level">1</span> ⌄</button>
            <button class="control-button restart-button" id="restart-button" aria-label="Restart level">🔄 Restart</button>
            <button class="control-button settings-button" id="open-settings-dialog" aria-label="Open settings">⚙️ Settings</button>
          </div>
        </div>
      </div>
    `;
  }

  private setupEventListeners(): void {
    const infoBtn = this.container.querySelector('#info-button');
    if (infoBtn && this.onInfoClick) {
      infoBtn.addEventListener('click', this.onInfoClick);
    }
  }

  public update(_state: GameState, level: Level): void {
    const levelElement = this.container.querySelector('#current-level');

    if (levelElement) {
      levelElement.textContent = level.id.toString();
    }
  }
}
