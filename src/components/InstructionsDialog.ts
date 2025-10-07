export class InstructionsDialog {
    private container: HTMLElement;
    private overlay: HTMLElement | null = null;
    private dialog: HTMLElement | null = null;

    constructor(container: HTMLElement) {
        this.container = container;
        this.render();
    }

    private render(): void {
        // Create overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'instructions-overlay';
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
        this.dialog.className = 'instructions-dialog';
        this.dialog.style.cssText = `
            background: white;
            padding: 24px 28px;
            border-radius: 12px;
            font-size: 16px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            display: flex;
            flex-direction: column;
            gap: 20px;
            min-width: 400px;
            max-width: 500px;
            max-height: 80vh;
            overflow-y: auto;
        `;

        // Dialog content
        this.dialog.innerHTML = `
            <div class="instructions-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <h2 style="margin: 0; font-size: 20px; font-weight: bold; color: #2c3e50;">How to Play</h2>
                <button class="close-button" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #7f8c8d;">&times;</button>
            </div>
            
            <div class="instructions-content" style="line-height: 1.6; color: #2c3e50;">
                <div class="instruction-section" style="margin-bottom: 20px;">
                    <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #34495e;">🎯 Objective</h3>
                    <p style="margin: 0;">Select blocks in the correct order to match the color pattern shown at the top of the screen.</p>
                </div>

                <div class="instruction-section" style="margin-bottom: 20px;">
                    <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #34495e;">🎮 How to Play</h3>
                    <ul style="margin: 0; padding-left: 20px;">
                        <li style="margin-bottom: 6px;">Look at the color pattern displayed at the top</li>
                        <li style="margin-bottom: 6px;">Click on blocks in the grid to select them in the correct order</li>
                        <li style="margin-bottom: 6px;">Each selected block should match the next color in the pattern</li>
                        <li style="margin-bottom: 6px;">Complete the pattern to finish the level</li>
                    </ul>
                </div>

                <div class="instruction-section" style="margin-bottom: 20px;">
                    <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #34495e;">⚙️ Settings</h3>
                    <ul style="margin: 0; padding-left: 20px;">
                        <li style="margin-bottom: 6px;"><strong>Prevent Mistakes:</strong> When enabled, you can only click on blocks that match the current pattern position</li>
                        <li style="margin-bottom: 6px;">Use the Settings button to toggle this feature</li>
                    </ul>
                </div>

                <div class="instruction-section" style="margin-bottom: 20px;">
                    <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #34495e;">🔄 Controls</h3>
                    <ul style="margin: 0; padding-left: 20px;">
                        <li style="margin-bottom: 6px;"><strong>Restart:</strong> Reset the current level</li>
                        <li style="margin-bottom: 6px;"><strong>Level Selector:</strong> Choose different levels</li>
                        <li style="margin-bottom: 6px;"><strong>Settings:</strong> Adjust game preferences</li>
                    </ul>
                </div>

                <div class="instruction-section">
                    <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #34495e;">💡 Tips</h3>
                    <ul style="margin: 0; padding-left: 20px;">
                        <li style="margin-bottom: 6px;">Start with the first color in the pattern</li>
                        <li style="margin-bottom: 6px;">Look for blocks that are connected to your current selection</li>
                        <li style="margin-bottom: 6px;">Use the "Prevent Mistakes" setting if you want guidance</li>
                        <li style="margin-bottom: 6px;">Take your time to plan your moves</li>
                    </ul>
                </div>
            </div>
            
            <div class="instructions-actions" style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 8px;">
                <button class="control-button close-instructions-button" style="background: #3498db; color: white; padding: 10px 16px; border-radius: 8px; font-size: 14px; font-weight: 600; border: none; cursor: pointer;">
                    Got it!
                </button>
            </div>
        `;

        this.overlay.appendChild(this.dialog);
        this.container.appendChild(this.overlay);

        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        if (!this.overlay || !this.dialog) return;

        // Close button
        const closeButton = this.dialog.querySelector('.close-button');
        closeButton?.addEventListener('click', () => this.close());

        // Close instructions button
        const closeInstructionsButton = this.dialog.querySelector('.close-instructions-button');
        closeInstructionsButton?.addEventListener('click', () => this.close());

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

    public open(): void {
        if (this.overlay) {
            this.overlay.style.display = 'flex';
            // Focus the first interactive element
            const firstButton = this.dialog?.querySelector('button') as HTMLButtonElement;
            firstButton?.focus();
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
}
