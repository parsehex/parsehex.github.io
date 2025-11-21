#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// Curated list of beautiful gradient colors (with low opacity for subtle backgrounds)
const GRADIENT_COLORS = [
	// Blues
	'rgba(56, 189, 248, 0.15)',   // Sky blue
	'rgba(59, 130, 246, 0.15)',   // Blue
	'rgba(96, 165, 250, 0.15)',   // Light blue
	'rgba(37, 99, 235, 0.15)',    // Royal blue

	// Purples
	'rgba(168, 85, 247, 0.15)',   // Purple
	'rgba(147, 51, 234, 0.15)',   // Deep purple
	'rgba(192, 132, 252, 0.15)',  // Light purple
	'rgba(126, 34, 206, 0.15)',   // Violet

	// Pinks
	'rgba(236, 72, 153, 0.15)',   // Pink
	'rgba(244, 114, 182, 0.15)',  // Light pink
	'rgba(219, 39, 119, 0.15)',   // Hot pink

	// Greens
	'rgba(34, 197, 94, 0.15)',    // Green
	'rgba(16, 185, 129, 0.15)',   // Emerald
	'rgba(74, 222, 128, 0.15)',   // Light green
	'rgba(20, 184, 166, 0.15)',   // Teal

	// Oranges/Yellows
	'rgba(251, 146, 60, 0.15)',   // Orange
	'rgba(251, 191, 36, 0.15)',   // Amber
	'rgba(234, 179, 8, 0.15)',    // Yellow

	// Reds
	'rgba(239, 68, 68, 0.15)',    // Red
	'rgba(248, 113, 113, 0.15)',  // Light red
	'rgba(220, 38, 38, 0.15)',    // Dark red
];

function getRandomColor() {
	return GRADIENT_COLORS[Math.floor(Math.random() * GRADIENT_COLORS.length)];
}

function getRandomPair() {
	const color1 = getRandomColor();
	let color2 = getRandomColor();

	// Ensure we get two different colors
	while (color1 === color2) {
		color2 = getRandomColor();
	}

	return { topLeft: color1, topRight: color2 };
}

// Read config.json
const configPath = join(process.cwd(), 'config.json');
const config = JSON.parse(readFileSync(configPath, 'utf-8'));

// Generate random gradient colors
const newColors = getRandomPair();

// Update config
if (!config.theme) {
	config.theme = {};
}
config.theme.gradientColors = newColors;

// Write back to config.json
writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n');

console.log('✨ Randomized gradient colors!');
console.log(`   Top-left: ${newColors.topLeft}`);
console.log(`   Top-right: ${newColors.topRight}`);
