import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure screenshots directory exists
const screenshotsDir = path.join(__dirname, '../public/screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// Function to create a simple colored screenshot
async function createScreenshot(filename, width, height) {
  try {
    await sharp({
      create: {
        width: width,
        height: height,
        channels: 4,
        background: { r: 14, g: 165, b: 233, alpha: 1 } // #0ea5e9
      }
    })
    .png()
    .toFile(path.join(screenshotsDir, filename));
    
    console.log(`Created ${filename} (${width}x${height})`);
  } catch (error) {
    console.error(`Error creating ${filename}:`, error);
  }
}

// Create screenshots
async function generateAllScreenshots() {
  await createScreenshot('desktop-1.png', 1280, 800);
  await createScreenshot('desktop-2.png', 1280, 800);
  await createScreenshot('mobile-1.png', 320, 640);
  await createScreenshot('mobile-2.png', 320, 640);
  
  console.log('All screenshots generated successfully!');
}

generateAllScreenshots(); 