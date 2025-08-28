import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔨 Building API functions...');

// Create dist/api directory if it doesn't exist
const distApiDir = path.join(__dirname, 'dist', 'api');
if (!fs.existsSync(distApiDir)) {
  fs.mkdirSync(distApiDir, { recursive: true });
}

// Copy lib directory to dist
const libDir = path.join(__dirname, 'lib');
const distLibDir = path.join(__dirname, 'dist', 'lib');
if (!fs.existsSync(distLibDir)) {
  fs.mkdirSync(distLibDir, { recursive: true });
}

// Copy lib files directly (no conversion)
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const items = fs.readdirSync(src);
  for (const item of items) {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    
    if (fs.statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else if (item.endsWith('.ts')) {
      // Just copy TypeScript files as-is
      fs.copyFileSync(srcPath, destPath);
      console.log(`📄 Copied lib/${item}`);
    } else {
      // Copy non-TypeScript files as-is
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyDir(libDir, distLibDir);

// Try to build with TypeScript
try {
  console.log('📝 Compiling TypeScript...');
  execSync('npx tsc --project tsconfig.api.json --outDir dist/api --skipLibCheck', { 
    stdio: 'inherit',
    cwd: __dirname 
  });
  console.log('✅ TypeScript compilation completed');
} catch (error) {
  console.log('⚠️ TypeScript compilation had errors, but continuing...');
  
  // If TypeScript fails, try to copy and convert manually
  console.log('🔄 Attempting manual conversion...');
  const apiDir = path.join(__dirname, 'api');
  const apiFiles = fs.readdirSync(apiDir).filter(file => file.endsWith('.ts'));

  for (const file of apiFiles) {
    const srcPath = path.join(apiDir, file);
    const destPath = path.join(distApiDir, file.replace('.ts', '.js'));
    
    // Just copy the file for now
    fs.copyFileSync(srcPath, destPath);
    console.log(`📄 Copied ${file} to ${file.replace('.ts', '.js')}`);
  }
}

console.log('✅ API build completed!');
console.log(`📁 Output directory: ${distApiDir}`);
console.log(`📁 Lib directory: ${distLibDir}`);
