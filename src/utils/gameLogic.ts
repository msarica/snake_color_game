import { Block, Position, Color, Level } from '../types/game.js';
import { GAME_CONFIG } from './config.js';

export function generateRandomColor(availableColors: Color[]): Color {
    return availableColors[Math.floor(Math.random() * availableColors.length)];
}

export function generatePattern(level: number, availableColors: Color[]): Color[] {
    // Deprecated in new flow: pattern is derived from a Hamiltonian path over the grid.
    // Kept for compatibility if needed elsewhere.
    const length = Math.min(2 + Math.floor(level / 3), 6);
    const pattern: Color[] = [];
    for (let i = 0; i < length; i++) {
        pattern.push(generateRandomColor(availableColors));
    }
    return pattern;
}

export function generateBlocks(
    gridSize: { width: number; height: number },
    pattern: Color[]
): Block[] {
    const blocks: Block[] = [];
    let id = 0;

    for (let y = 0; y < gridSize.height; y++) {
        for (let x = 0; x < gridSize.width; x++) {
            blocks.push({
                id: `block-${id++}`,
                color: generateRandomColor(pattern),
                position: { x, y },
                isSelected: false,
                isConnected: false
            });
        }
    }

    return blocks;
}

export function areAdjacent(pos1: Position, pos2: Position): boolean {
    const dx = Math.abs(pos1.x - pos2.x);
    const dy = Math.abs(pos1.y - pos2.y);
    return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
}

export function canSelectBlock(block: Block, selectedBlocks: Block[]): boolean {
    if (block.isSelected) return false;

    // First block can be selected from anywhere
    if (selectedBlocks.length === 0) return true;

    // Check if block is adjacent to the last selected block
    const lastSelected = selectedBlocks[selectedBlocks.length - 1];
    return areAdjacent(block.position, lastSelected.position);
}

export function isPatternComplete(selectedPattern: Color[], targetPattern: Color[]): boolean {
    // For start-to-finish patterns, we need exact match
    if (targetPattern.length === 0) return false;
    if (selectedPattern.length === 0) return false;

    // Check if patterns have the same length first
    if (selectedPattern.length !== targetPattern.length) {
        return false;
    }

    // Check if patterns match exactly
    for (let i = 0; i < selectedPattern.length; i++) {
        if (selectedPattern[i] !== targetPattern[i]) {
            return false;
        }
    }
    return true;
}


export function createLevel(levelId: number): Level {
    const gridSizeIndex = Math.min(
        Math.floor((levelId - 1) / 5),
        GAME_CONFIG.gridSizes.length - 1
    );
    const gridSize = GAME_CONFIG.gridSizes[gridSizeIndex];

    const colorCount = Math.min(2 + Math.floor(levelId / 8), GAME_CONFIG.colors.length);
    const availableColors = GAME_CONFIG.colors.slice(0, colorCount);

    // New strategy: generate grid first with random colors, then derive pattern
    const blocks = generateRandomGridBlocks(gridSize, availableColors);

    // Build a randomized Hamiltonian path that covers all blocks
    const pathPositions = generateRandomHamiltonianPath(gridSize);

    // Read colors along the path to form a long color sequence
    const colorsAlongPath: Color[] = pathPositions.map(pos => {
        const b = blocks.find(bl => bl.position.x === pos.x && bl.position.y === pos.y)!;
        return b.color;
    });

    // Derive start-to-finish pattern from the sequence
    const pattern = deriveStartToFinishPattern(colorsAlongPath);

    return {
        id: levelId,
        gridSize,
        colors: availableColors,
        pattern,
        blocks,
        isCompleted: false,
        isUnlocked: levelId === 1
    };
}

export function getConnectedBlocks(block: Block, allBlocks: Block[]): Block[] {
    const connected: Block[] = [block];
    const visited = new Set<string>();
    const queue = [block];

    while (queue.length > 0) {
        const current = queue.shift()!;
        visited.add(current.id);

        for (const otherBlock of allBlocks) {
            if (
                !visited.has(otherBlock.id) &&
                otherBlock.color === current.color &&
                areAdjacent(current.position, otherBlock.position)
            ) {
                connected.push(otherBlock);
                queue.push(otherBlock);
                visited.add(otherBlock.id);
            }
        }
    }

    return connected;
}

/**
 * Checks if a level has a valid solution by finding a path through adjacent blocks
 * that matches the target pattern and covers ALL blocks
 */
export function hasValidSolution(level: Level): boolean {
    const { pattern, blocks } = level;

    // Filter blocks to only include those with colors present in the pattern
    const patternColors = new Set(pattern);
    const relevantBlocks = blocks.filter(block => patternColors.has(block.color));

    // If there are blocks with colors not in the pattern, the level is unsolvable
    if (relevantBlocks.length !== blocks.length) {
        return false;
    }

    // Try to find a valid path starting from each block
    for (const startBlock of relevantBlocks) {
        if (startBlock.color === pattern[0]) {
            const solution = findSolutionPath(startBlock, relevantBlocks, pattern, []);
            // Solution must cover all relevant blocks and match the pattern
            if (solution.length === relevantBlocks.length && isValidPatternSequence(solution, pattern)) {
                return true;
            }
        }
    }

    return false;
}

/**
 * Recursively finds a solution path through adjacent blocks that covers ALL blocks
 */
function findSolutionPath(
    currentBlock: Block,
    allBlocks: Block[],
    targetPattern: Color[],
    currentPath: Block[]
): Block[] {
    // Add current block to path
    const newPath = [...currentPath, currentBlock];

    // If we've covered all blocks, check if the sequence is valid
    if (newPath.length === allBlocks.length) {
        return newPath;
    }

    // Try to continue the path with adjacent blocks
    const adjacentBlocks = allBlocks.filter(block =>
        !newPath.some(pathBlock => pathBlock.id === block.id) && // Not already in path
        areAdjacent(currentBlock.position, block.position) // Adjacent
    );

    // Try each valid adjacent block
    for (const nextBlock of adjacentBlocks) {
        const solution = findSolutionPath(nextBlock, allBlocks, targetPattern, newPath);
        if (solution.length === allBlocks.length) {
            return solution;
        }
    }

    return [];
}

/**
 * Checks if a sequence of blocks matches the target pattern
 * The pattern defines the order of colors, but multiple blocks of the same color are allowed
 */
function isValidPatternSequence(blockSequence: Block[], targetPattern: Color[]): boolean {
    if (targetPattern.length === 0) return false;
    for (let i = 0; i < blockSequence.length; i++) {
        const expected = targetPattern[i % targetPattern.length];
        if (blockSequence[i].color !== expected) return false;
    }
    return true;
}

/**
 * Creates a guaranteed solvable level by first generating a pattern,
 * then placing blocks in a way that ensures all blocks can be selected in the correct pattern order
 */
export function createGuaranteedSolvableLevel(
    levelId: number,
    gridSize: { width: number; height: number },
    availableColors: Color[]
): Level {
    // New guaranteed approach mirrors createLevel: generate grid first, random Hamiltonian path, derive pattern
    const blocks = generateRandomGridBlocks(gridSize, availableColors);
    const pathPositions = generateRandomHamiltonianPath(gridSize);

    const colorsAlongPath: Color[] = pathPositions.map(pos => {
        const b = blocks.find(bl => bl.position.x === pos.x && bl.position.y === pos.y)!;
        return b.color;
    });
    const pattern = deriveStartToFinishPattern(colorsAlongPath);

    return {
        id: levelId,
        gridSize,
        colors: availableColors,
        pattern,
        blocks,
        isCompleted: false,
        isUnlocked: levelId === 1
    };
}

/**
 * Generates a Hamiltonian path starting from a random position using randomized DFS
 */
function generateRandomHamiltonianPath(gridSize: { width: number; height: number }): Position[] {
    const { width, height } = gridSize;
    const totalCells = width * height;

    // Generate all possible positions
    const allPositions: Position[] = [];
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            allPositions.push({ x, y });
        }
    }

    // Try multiple random starting points to ensure we find a valid path
    const maxAttempts = 10;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        // Pick a random starting position
        const startIndex = Math.floor(Math.random() * allPositions.length);
        const startPos = allPositions[startIndex];

        const path = findHamiltonianPathFromStart(startPos, gridSize);
        if (path.length === totalCells) {
            return path;
        }
    }

    // Fallback: if DFS fails, use the old serpentine method with random start
    return generateSerpentineWithRandomStart(gridSize);
}

/**
 * Uses randomized DFS to find a Hamiltonian path starting from a specific position
 */
function findHamiltonianPathFromStart(
    startPos: Position,
    gridSize: { width: number; height: number }
): Position[] {
    const { width, height } = gridSize;
    const visited = new Set<string>();
    const path: Position[] = [];

    function dfs(current: Position): boolean {
        const key = `${current.x},${current.y}`;
        if (visited.has(key)) return false;

        visited.add(key);
        path.push(current);

        // If we've visited all cells, we found a Hamiltonian path
        if (path.length === width * height) {
            return true;
        }

        // Get all adjacent positions
        const adjacent: Position[] = [];
        const directions = [
            { dx: 0, dy: -1 }, // up
            { dx: 1, dy: 0 },  // right
            { dx: 0, dy: 1 },  // down
            { dx: -1, dy: 0 }  // left
        ];

        for (const { dx, dy } of directions) {
            const nextX = current.x + dx;
            const nextY = current.y + dy;
            if (nextX >= 0 && nextX < width && nextY >= 0 && nextY < height) {
                adjacent.push({ x: nextX, y: nextY });
            }
        }

        // Randomize the order of adjacent positions for variety
        for (let i = adjacent.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [adjacent[i], adjacent[j]] = [adjacent[j], adjacent[i]];
        }

        // Try each adjacent position
        for (const next of adjacent) {
            if (dfs(next)) {
                return true;
            }
        }

        // Backtrack
        visited.delete(key);
        path.pop();
        return false;
    }

    dfs(startPos);
    return path;
}

/**
 * Fallback method: serpentine path with random starting corner
 */
function generateSerpentineWithRandomStart(gridSize: { width: number; height: number }): Position[] {
    const { width, height } = gridSize;

    // Choose random starting corner
    const corners = [
        { x: 0, y: 0 },                    // top-left
        { x: width - 1, y: 0 },           // top-right
        { x: 0, y: height - 1 },          // bottom-left
        { x: width - 1, y: height - 1 }   // bottom-right
    ];
    const startCorner = corners[Math.floor(Math.random() * corners.length)];

    // Generate serpentine path
    const path: Position[] = [];
    for (let y = 0; y < height; y++) {
        if (y % 2 === 0) {
            for (let x = 0; x < width; x++) path.push({ x, y });
        } else {
            for (let x = width - 1; x >= 0; x--) path.push({ x, y });
        }
    }

    // Transform path to start from the chosen corner
    if (startCorner.x === width - 1) {
        // Flip horizontally
        path.forEach(p => p.x = width - 1 - p.x);
    }
    if (startCorner.y === height - 1) {
        // Flip vertically
        path.forEach(p => p.y = height - 1 - p.y);
    }

    return path;
}

/**
 * Calculates the Manhattan distance between two positions
 */
// Removed unused getDistance helper

/**
 * Generates blocks for the grid with random colors from the available set.
 * Ensures that at least 2 different colors are used in the grid.
 */
function generateRandomGridBlocks(
    gridSize: { width: number; height: number },
    availableColors: Color[]
): Block[] {
    const blocks: Block[] = [];
    let id = 0;

    // Generate blocks with random colors
    for (let y = 0; y < gridSize.height; y++) {
        for (let x = 0; x < gridSize.width; x++) {
            blocks.push({
                id: `block-${id++}`,
                color: generateRandomColor(availableColors),
                position: { x, y },
                isSelected: false,
                isConnected: false
            });
        }
    }

    // Ensure at least 2 different colors are used
    const usedColors = new Set(blocks.map(block => block.color));
    if (usedColors.size === 1 && availableColors.length > 1) {
        // If only one color was used, randomly change some blocks to a different color
        const currentColor = blocks[0].color;
        const otherColors = availableColors.filter(color => color !== currentColor);

        // Change at least 1 block to a different color (but not more than half)
        const blocksToChange = Math.max(1, Math.floor(blocks.length / 4));
        const indicesToChange = new Set<number>();

        while (indicesToChange.size < blocksToChange) {
            const randomIndex = Math.floor(Math.random() * blocks.length);
            indicesToChange.add(randomIndex);
        }

        indicesToChange.forEach(index => {
            const newColor = otherColors[Math.floor(Math.random() * otherColors.length)];
            blocks[index].color = newColor;
        });
    }

    return blocks;
}

/**
 * Extract the start-to-finish pattern from the given color sequence.
 * Extracts only the color transitions (when color changes) to show the pattern.
 * This represents the actual sequence the player needs to follow from start to finish.
 */
function deriveStartToFinishPattern(sequence: Color[]): Color[] {
    if (sequence.length === 0) return [];

    // Extract only the transitions (when color changes)
    const transitions: Color[] = [sequence[0]]; // Always include the first color

    for (let i = 1; i < sequence.length; i++) {
        if (sequence[i] !== sequence[i - 1]) {
            transitions.push(sequence[i]);
        }
    }

    // If we only have one color, we need to ensure the pattern has at least 2 colors
    if (transitions.length === 1) {
        // Find a different color from the available colors in the sequence
        const availableColors = [...new Set(sequence)];
        if (availableColors.length > 1) {
            // Find the first different color and create a 2-color pattern
            const firstColor = transitions[0];
            const secondColor = availableColors.find(color => color !== firstColor)!;
            return [firstColor, secondColor];
        } else {
            // This should not happen if generateRandomGridBlocks works correctly,
            // but as a fallback, return a pattern with the same color repeated
            return [transitions[0], transitions[0]];
        }
    }

    // Return the full transition sequence as the start-to-finish pattern
    return transitions;
}
