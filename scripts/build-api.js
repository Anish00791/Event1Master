import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Create dist/api directory if it doesn't exist
const apiDistDir = path.join(rootDir, 'dist', 'api');
if (!fs.existsSync(apiDistDir)) {
  fs.mkdirSync(apiDistDir, { recursive: true });
  console.log('Created dist/api directory');
}

// Copy all files from api folder to dist/api
const apiSourceDir = path.join(rootDir, 'api');
if (!fs.existsSync(apiSourceDir)) {
  console.error('API source directory does not exist!');
  process.exit(1);
}

// Function to copy a directory recursively
function copyDir(src, dest) {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // Read all files in source directory
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      // Recursively copy subdirectories
      copyDir(srcPath, destPath);
    } else {
      // Copy files
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied: ${srcPath} -> ${destPath}`);
    }
  }
}

try {
  copyDir(apiSourceDir, apiDistDir);
  console.log('Successfully copied API files to dist/api');
} catch (error) {
  console.error('Error copying API files:', error);
  process.exit(1);
} 