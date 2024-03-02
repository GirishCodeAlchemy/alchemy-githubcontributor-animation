const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');


// Function to map contribution level to color
function getColorForContributionLevel(level) {
    // Define color mapping based on contribution level
    // You can customize this according to your preference
    switch (level) {
        case 4:
            return '#196127'; // Dark green for highest level
        case 3:
            return '#239a3b';
        case 2:
            return '#7bc96f';
        case 1:
            return '#c6e48b';
        default:
            return '#ebedf0'; // Light grey for no contributions
    }
}

const drawContributions = async (contributions) => {
    // Define canvas size and cell dimensions
    const cellSize = 100;
    const canvasWidth = 53 * cellSize; // 53 weeks in a year
    const canvasHeight = 7 * cellSize; // 7 days in a week

    // Create a new canvas instance
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');

    // Loop through contributions and draw each cell
    contributions.forEach(contribution => {
        const x = contribution.x * cellSize;
        const y = contribution.y * cellSize;
        const color = getColorForContributionLevel(contribution.level);

        // Draw filled rectangle for contribution cell
        ctx.fillStyle = color;
        ctx.fillRect(x, y, cellSize, cellSize);

        // Draw border around each cell
        ctx.strokeStyle = '#ffff'; // Light grey color for border
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, cellSize, cellSize);
    });

    // Save the canvas as an image file
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('github_contributions.png', buffer);
    console.log('GitHub contributions image generated successfully.');
}



module.exports = { drawContributions };