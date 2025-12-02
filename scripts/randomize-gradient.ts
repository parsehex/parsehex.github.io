import chalk from 'chalk';

const COLORS = {
	Sky_Blue: 'rgba(56, 189, 248, 0.15)',
	Blue: 'rgba(59, 130, 246, 0.15)',
	Light_Blue: 'rgba(96, 165, 250, 0.15)',
	Royal_Blue: 'rgba(37, 99, 235, 0.15)',
	Purple: 'rgba(168, 85, 247, 0.15)',
	Deep_Purple: 'rgba(147, 51, 234, 0.15)',
	Light_Purple: 'rgba(192, 132, 252, 0.15)',
	Violet: 'rgba(126, 34, 206, 0.15)',
	Pink: 'rgba(236, 72, 153, 0.15)',
	Light_Pink: 'rgba(244, 114, 182, 0.15)',
	Hot_Pink: 'rgba(219, 39, 119, 0.15)',
	Green: 'rgba(34, 197, 94, 0.15)',
	Emerald: 'rgba(16, 185, 129, 0.15)',
	Light_Green: 'rgba(74, 222, 128, 0.15)',
	Teal: 'rgba(20, 184, 166, 0.15)',
	Orange: 'rgba(251, 146, 60, 0.15)',
	Amber: 'rgba(251, 191, 36, 0.15)',
	Yellow: 'rgba(234, 179, 8, 0.15)',
	Red: 'rgba(239, 68, 68, 0.15)',
	Light_Red: 'rgba(248, 113, 113, 0.15)',
	Dark_Red: 'rgba(220, 38, 38, 0.15)',
};

// Curated list of good-looking gradient colors
const GRADIENT_COLORS = Object.entries(COLORS);

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

const arg = process.argv[2];

if (arg === '--all') {
	for (const pair of GRADIENT_COLORS) {
		const [name, color] = pair;
		console.log(`${name}: ${chalk.bold(color)}`);
	}
	process.exit(0);
}

const colors = getRandomPair();

const [tlName, tlColor] = colors.topLeft;
const [trName, trColor] = colors.topRight;

console.log('Randomized colors:');
console.log(
	`   Top-left: ${chalk.bold.underline(tlColor)} (${tlName.replace('_', ' ')})`
);
console.log(
	`   Top-right: ${chalk.bold.underline(trColor)} (${trName.replace('_', ' ')})`
);
console.log('Refer to this page for instructions:');
console.log(
	'https://projectdepot.github.io/SrcGallery/config.html#background-colors'
);
