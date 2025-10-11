export class LoadingScreen {
    private container: HTMLElement;
    private isVisible: boolean = false;

    constructor(container: HTMLElement) {
        this.container = container;
        this.render();
    }

    private render(): void {
        this.container.innerHTML = `
            <div class="loading-screen" style="display: none;">
                <div class="loading-content">
                    <div class="loading-spinner">
                        <div class="spinner-ring"></div>
                        <div class="spinner-ring"></div>
                        <div class="spinner-ring"></div>
                        <div class="spinner-ring"></div>
                    </div>
                    <div class="loading-text">Generating Level...</div>
                    <div class="loading-subtext">Creating the perfect puzzle for you</div>
                </div>
            </div>
        `;

        // Add CSS styles
        const style = document.createElement('style');
        style.textContent = `
            .loading-screen {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                backdrop-filter: blur(4px);
            }

            .loading-content {
                text-align: center;
                color: white;
            }

            .loading-spinner {
                position: relative;
                width: 80px;
                height: 80px;
                margin: 0 auto 24px;
            }

            .spinner-ring {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border: 3px solid transparent;
                border-top: 3px solid #3498db;
                border-radius: 50%;
                animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
            }

            .spinner-ring:nth-child(1) {
                animation-delay: -0.45s;
                border-top-color: #e74c3c;
            }

            .spinner-ring:nth-child(2) {
                animation-delay: -0.3s;
                border-top-color: #f39c12;
            }

            .spinner-ring:nth-child(3) {
                animation-delay: -0.15s;
                border-top-color: #2ecc71;
            }

            .spinner-ring:nth-child(4) {
                border-top-color: #9b59b6;
            }

            @keyframes spin {
                0% {
                    transform: rotate(0deg);
                }
                100% {
                    transform: rotate(360deg);
                }
            }

            .loading-text {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 8px;
                color: #ecf0f1;
            }

            .loading-subtext {
                font-size: 16px;
                color: #bdc3c7;
                opacity: 0.8;
            }

            .loading-screen.show {
                display: flex !important;
                animation: fadeIn 0.3s ease-in-out;
            }

            .loading-screen.hide {
                animation: fadeOut 0.3s ease-in-out forwards;
            }

            @keyframes fadeIn {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }

            @keyframes fadeOut {
                from {
                    opacity: 1;
                }
                to {
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    public show(): void {
        if (this.isVisible) return;

        const loadingScreen = this.container.querySelector('.loading-screen') as HTMLElement;
        if (loadingScreen) {
            loadingScreen.style.display = 'flex';
            loadingScreen.classList.add('show');
            this.isVisible = true;
        }
    }

    public hide(): void {
        if (!this.isVisible) return;

        const loadingScreen = this.container.querySelector('.loading-screen') as HTMLElement;
        if (loadingScreen) {
            loadingScreen.classList.remove('show');
            loadingScreen.classList.add('hide');

            // Remove from DOM after animation completes
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                loadingScreen.classList.remove('hide');
                this.isVisible = false;
            }, 300);
        }
    }

    public isShowing(): boolean {
        return this.isVisible;
    }
}
