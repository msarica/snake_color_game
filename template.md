# Project Template Prompt

Create a modern TypeScript web application with the following specifications:

## Project Structure & Architecture

**Core Technologies:**
- TypeScript with strict configuration
- Vite for bundling and development
- ES modules (type: "module" in package.json)
- PWA support with offline capabilities

**Project Structure:**
```
project-name/
├── src/
│   ├── components/          # UI components (class-based)
│   ├── state/              # State management classes
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions and helpers
│   ├── main.ts             # Application entry point
│   └── styles.css          # Global styles
├── public/                 # Static assets (icons, manifest)
├── dist/                   # Build output
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## State Management Pattern

Implement a **centralized state management system** with:
- **State Manager Class**: A singleton class that manages application state
- **Action-based Updates**: Dispatch actions to modify state
- **Observer Pattern**: Subscribe/unsubscribe to state changes
- **Persistence**: Automatic save/load from localStorage
- **Type Safety**: Full TypeScript support for state and actions

**State Manager Features:**
- Initialize state with default values
- Load persisted state on startup
- Dispatch actions to modify state
- Notify subscribers of state changes
- Save state changes automatically
- Provide getter methods for current state

## Build Configuration

**Vite Configuration:**
- **Subfolder Deployment**: Configure base path for GitHub Pages deployment
- **PWA Plugin**: Service worker, manifest, offline support
- **Build Optimization**: Terser minification, manual chunks disabled
- **Version Injection**: Read version from package.json and inject as global
- **Development Server**: Host on all interfaces, custom port

**TypeScript Configuration:**
- Target ES2020 with strict mode
- ES modules with bundler resolution
- DOM and DOM.Iterable libraries
- Strict type checking enabled
- No unused locals/parameters

## Component Architecture

**Component Pattern:**
- **Class-based Components**: Each component is a TypeScript class
- **DOM Injection**: Components receive container elements in constructor
- **Event Handling**: Internal event listeners and cleanup
- **State Integration**: Components subscribe to state manager
- **Lifecycle Management**: Proper initialization and cleanup

**Component Structure:**
```typescript
export class ComponentName {
    private container: HTMLElement;
    private stateManager: StateManager;
    
    constructor(container: HTMLElement, stateManager: StateManager) {
        this.container = container;
        this.stateManager = stateManager;
        this.initialize();
        this.setupEventListeners();
    }
    
    private initialize(): void { /* DOM setup */ }
    private setupEventListeners(): void { /* Event handling */ }
    private updateUI(): void { /* State-driven UI updates */ }
}
```

## Utility Organization

**Utility Modules:**
- **Storage**: localStorage wrapper with error handling
- **Config**: Constants and configuration values
- **Logic**: Business logic and algorithms
- **Settings**: User preferences management

## PWA Configuration

**Progressive Web App Features:**
- **Service Worker**: Auto-update registration
- **Web App Manifest**: Standalone display, theme colors
- **Offline Support**: Cache all static assets
- **Icons**: Multiple sizes for different platforms
- **Scope Configuration**: Proper subfolder scoping

## Package.json Structure

**Scripts:**
- `dev`: Vite development server
- `build`: TypeScript compilation + Vite build
- `preview`: Preview production build

**Dependencies:**
- **Dev Dependencies**: TypeScript, Vite, PWA plugin, Terser
- **Keywords**: Include relevant technology keywords
- **Version Management**: Semantic versioning

## Development Workflow

**Entry Point Pattern:**
```typescript
// main.ts
import { MainApp } from './components/MainApp.js';
import './styles.css';

document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    if (app) {
        new MainApp(app);
    }
});
```

**State Integration:**
- Components receive state manager in constructor
- Subscribe to state changes for reactive updates
- Dispatch actions to modify application state
- Automatic persistence on state changes

## File Naming & Organization

- **Components**: PascalCase class names, descriptive file names
- **Types**: Comprehensive TypeScript interfaces
- **Utils**: Functional utilities with clear responsibilities
- **State**: Centralized state management logic
- **Assets**: Organized in public/ directory with proper naming

## Build Output

- **Optimized Bundle**: Single JS/CSS files for production
- **Asset Management**: Proper asset hashing and organization
- **Source Maps**: Disabled for production builds
- **Subfolder Ready**: All paths configured for subfolder deployment

Create a complete, production-ready application following these patterns with proper error handling, type safety, and modern web development best practices.
