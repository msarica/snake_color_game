# Snake Color Puzzle 🎮

A mobile-optimized puzzle game built with TypeScript and Vite. Players must select colored blocks in a specific pattern sequence to complete levels.

## 🎯 Game Concept

- **Grid-based gameplay**: Each level displays a grid of colored blocks (red, blue, green, yellow, purple, orange)
- **Pattern matching**: Players must select blocks in an order that matches the displayed pattern sequence
- **Adjacent selection**: Blocks can only be connected if they are horizontally or vertically adjacent
- **Progressive difficulty**: Levels become more complex with longer patterns and more colors

## 🚀 Features

### Core Gameplay
- ✅ Multiple levels with increasing difficulty
- ✅ Pattern sequence display at the top
- ✅ Adjacent block selection only
- ✅ Visual feedback for selected blocks
- ✅ Level completion validation

### Mobile Optimization
- ✅ Touch-friendly controls
- ✅ Responsive design for all screen sizes
- ✅ Optimized for mobile browsers
- ✅ No text selection or zoom interference
- ✅ Smooth animations and transitions

### PWA Features
- ✅ Install as standalone app on mobile/desktop
- ✅ Offline functionality with service worker
- ✅ App icons for home screen
- ✅ Fast loading with caching
- ✅ Native app-like experience

### Progress System
- ✅ Level unlocking system
- ✅ Progress persistence with localStorage
- ✅ Level selector for jumping between unlocked levels

### UI/UX
- ✅ Clean, modern interface
- ✅ Intuitive controls
- ✅ Visual pattern display
- ✅ Success/error feedback
- ✅ Restart functionality

## 🛠️ Technology Stack

- **TypeScript** - Type-safe development
- **Vite** - Fast development server and build tool
- **Vite PWA Plugin** - Progressive Web App functionality
- **Workbox** - Service worker for offline support
- **Vanilla JavaScript** - No framework dependencies
- **CSS3** - Modern styling with flexbox and grid
- **localStorage** - Progress persistence

## 📁 Project Structure

```
src/
├── components/          # UI Components
│   ├── Game.ts         # Main game controller
│   ├── Header.ts       # Game header with level
│   ├── LevelSelector.ts # Level selection interface
│   ├── PatternDisplay.ts # Pattern visualization
│   ├── GameGrid.ts     # Game grid with blocks
├── state/              # State Management
│   └── gameState.ts    # Game state manager
├── types/              # TypeScript Types
│   └── game.ts         # Game type definitions
├── utils/              # Utilities
│   ├── config.ts       # Game configuration
│   ├── gameLogic.ts    # Core game logic
│   └── storage.ts      # localStorage utilities
├── main.ts             # Application entry point
└── styles.css          # Global styles
```

## 🎮 How to Play

1. **Start**: Begin with Level 1 (automatically unlocked)
2. **Observe**: Look at the pattern sequence displayed at the top
3. **Select**: Tap blocks in the correct order to match the pattern
4. **Connect**: Only select blocks that are adjacent to your last selection
5. **Complete**: Tap "Check" to validate your pattern
6. **Progress**: Unlock new levels as you complete previous ones

### Game Rules
- Blocks must be selected in the exact pattern sequence shown
- Only adjacent blocks (horizontally or vertically) can be selected
- You can deselect blocks by tapping them again
- Use "Restart" to reset the current level
- Use the level selector to jump between unlocked levels

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd snake-color-puzzle
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Navigate to `http://localhost:3000`
   - For mobile testing, use your computer's IP address

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment.

## 📱 Mobile Testing

### Local Network Testing
1. Find your computer's IP address
2. Access `http://YOUR_IP:3000` from your mobile device
3. Ensure both devices are on the same network

### Browser Developer Tools
1. Open Chrome DevTools (F12)
2. Click the device toggle button
3. Select a mobile device preset
4. Test touch interactions

## 🎨 Customization

### Adding New Colors
Edit `src/utils/config.ts`:
```typescript
export const GAME_CONFIG: GameConfig = {
  colors: ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'cyan'],
  // ... other config
};
```

### Adjusting Difficulty
Modify level progression in `src/utils/gameLogic.ts`:
```typescript
export function generatePattern(level: number, availableColors: Color[]): Color[] {
  const baseLength = Math.min(2 + Math.floor(level / 3), 8); // Increase max length
  // ... rest of function
}
```

### Changing Grid Sizes
Update grid configurations in `src/utils/config.ts`:
```typescript
gridSizes: [
  { width: 4, height: 4 },
  { width: 5, height: 4 },
  // Add more sizes...
]
```

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Code Style
- TypeScript strict mode enabled
- Consistent naming conventions
- Component-based architecture
- Separation of concerns

## 🐛 Troubleshooting

### Common Issues

**Game not loading**
- Check browser console for errors
- Ensure all dependencies are installed
- Verify TypeScript compilation

**Touch not working on mobile**
- Check viewport meta tag
- Verify touch-action CSS property
- Test in different browsers

**Progress not saving**
- Check localStorage availability
- Verify browser permissions
- Clear browser cache if needed

## 📄 License

This project is licensed under the ISC License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📱 PWA Installation

### On Mobile (iOS/Android)
1. Open the game in Safari (iOS) or Chrome (Android)
2. Tap the "Share" button (iOS) or menu (Android)
3. Select "Add to Home Screen"
4. The app will appear on your home screen like a native app

### On Desktop (Chrome/Edge)
1. Open the game in your browser
2. Look for the install icon in the address bar
3. Click "Install" to add it as a desktop app
4. Launch it anytime from your apps menu

### PWA Benefits
- **Offline Play**: Continue playing without internet connection
- **Fast Loading**: Assets are cached for instant startup
- **Native Experience**: Full-screen, no browser UI
- **Easy Access**: One tap from your home screen
- **Auto-updates**: Always get the latest version

## 🎯 Future Enhancements

- [ ] Sound effects and music
- [ ] More game modes
- [ ] Leaderboards
- [ ] Achievements system
- [ ] Custom level editor
- [ ] Multiplayer support
- [ ] Push notifications for daily challenges

---

**Enjoy playing the Snake Color Puzzle!** 🎉
