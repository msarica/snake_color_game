import { GameState, Settings } from '../types/game.js';
import { saveSettings, loadSettings } from '../utils/settings.js';

export class SettingsDialog {
    private container: HTMLElement;
    private overlay: HTMLElement | null = null;
    private dialog: HTMLElement | null = null;
    private settings: Settings;

    constructor(container: HTMLElement) {
        this.container = container;
        this.settings = loadSettings();
        this.render();
    }

    private render(): void {
        // Create overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'settings-overlay';
        this.overlay.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.4);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;

        // Create dialog
        this.dialog = document.createElement('div');
        this.dialog.className = 'settings-dialog';
        this.dialog.style.cssText = `
            background: white;
            padding: 24px 28px;
            border-radius: 12px;
            font-size: 16px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            display: flex;
            flex-direction: column;
            gap: 20px;
            min-width: 320px;
            max-width: 400px;
        `;

        // Dialog content
        this.dialog.innerHTML = `
            <div class="settings-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <h2 style="margin: 0; font-size: 20px; font-weight: bold; color: #2c3e50;">Settings</h2>
                <button class="close-button" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #7f8c8d;">&times;</button>
            </div>
            
            <div class="settings-content">
                <div class="setting-item" style="display: flex; align-items: center; gap: 12px; padding: 12px 0;">
                    <input type="checkbox" id="prevent-mistakes" class="setting-checkbox" style="width: 18px; height: 18px; cursor: pointer;">
                    <label for="prevent-mistakes" style="cursor: pointer; font-size: 16px; color: #2c3e50;">
                        Prevent mistakes
                    </label>
                </div>
                <div class="setting-description" style="font-size: 14px; color: #7f8c8d; margin-top: 4px; line-height: 1.4;">
                    When enabled, invalid moves will be blocked. You can only click on blocks that match the current pattern position.
                </div>
            </div>
            
            <div class="settings-actions" style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 8px;">
                <button class="control-button cancel-button" style="background: #95a5a6; color: white; padding: 10px 16px; border-radius: 8px; font-size: 14px; font-weight: 600; border: none; cursor: pointer;">
                    Cancel
                </button>
                <button class="control-button save-button" style="background: #3498db; color: white; padding: 10px 16px; border-radius: 8px; font-size: 14px; font-weight: 600; border: none; cursor: pointer;">
                    Save
                </button>
            </div>
        `;

        this.overlay.appendChild(this.dialog);
        this.container.appendChild(this.overlay);

        this.setupEventListeners();
        this.updateUI();
    }

    private setupEventListeners(): void {
        if (!this.overlay || !this.dialog) return;

        // Close button
        const closeButton = this.dialog.querySelector('.close-button');
        closeButton?.addEventListener('click', () => this.close());

        // Cancel button
        const cancelButton = this.dialog.querySelector('.cancel-button');
        cancelButton?.addEventListener('click', () => this.close());

        // Save button
        const saveButton = this.dialog.querySelector('.save-button');
        saveButton?.addEventListener('click', () => this.saveSettings());

        // Close on overlay click
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.close();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) {
                this.close();
            }
        });
    }

    private updateUI(): void {
        if (!this.dialog) return;

        const preventMistakesCheckbox = this.dialog.querySelector('#prevent-mistakes') as HTMLInputElement;
        if (preventMistakesCheckbox) {
            preventMistakesCheckbox.checked = this.settings.preventMistakes;
        }
    }

    public open(): void {
        if (this.overlay) {
            this.overlay.style.display = 'flex';
            // Focus the first interactive element
            const firstInput = this.dialog?.querySelector('input') as HTMLInputElement;
            firstInput?.focus();
        }
    }

    public close(): void {
        if (this.overlay) {
            this.overlay.style.display = 'none';
        }
    }

    public isOpen(): boolean {
        return this.overlay?.style.display === 'flex';
    }

    private saveSettings(): void {
        if (!this.dialog) return;

        const preventMistakesCheckbox = this.dialog.querySelector('#prevent-mistakes') as HTMLInputElement;

        this.settings = {
            preventMistakes: preventMistakesCheckbox?.checked || false
        };

        saveSettings(this.settings);
        this.close();
    }

    public getSettings(): Settings {
        return this.settings;
    }

    public update(_state: GameState): void {
        // Settings dialog doesn't need to update based on game state
        // but we keep this method for consistency with other components
    }
}
