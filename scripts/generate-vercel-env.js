/**
 * Script to generate Vercel-compatible .env file
 * 
 * Usage: node scripts/generate-vercel-env.js > .env.production
 * Then use vercel CLI to deploy with --env-file=.env.production
 */

const fs = require('fs');
const path = require('path');

// Read the .env file
try {
  const envFile = fs.readFileSync(path.join(process.cwd(), '.env'), 'utf8');
  const envLines = envFile.split('\n').filter(line => 
    line.trim() !== '' && !line.startsWith('#')
  );
  
  const vercelEnv = envLines.map(line => {
    // Split by first = sign
    const [key, value] = line.split(/=(.+)/);
    if (!key || !value) return null;
    
    // Return formatted key-value pair
    return `${key.trim()}=${value.trim()}`;
  }).filter(Boolean);
  
  // Add NODE_ENV=production
  vercelEnv.push('NODE_ENV=production');
  
  // Output the Vercel-compatible env file
  console.log(vercelEnv.join('\n'));
  
  console.error('\nGenerated Vercel-compatible .env file.');
  console.error('Use it with: vercel --env-file=.env.production');
} catch (error) {
  console.error('Error generating Vercel env file:', error);
  process.exit(1);
} 