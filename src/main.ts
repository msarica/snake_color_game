import { Game } from './components/Game.js';
import './styles.css';

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    if (app) {
        new Game(app);
    }
});
