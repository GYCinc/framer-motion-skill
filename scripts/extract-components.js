const fs = require('fs');
const path = require('path');

const HTML_FILE = path.join(__dirname, '../../framer-motion-ultimate.html');
const OUTPUT_DIR = path.join(__dirname, '../components/demos');
const REGISTRY_FILE = path.join(__dirname, '../lib/demoRegistry.js');

// Read the HTML file
const html = fs.readFileSync(HTML_FILE, 'utf-8');
const lines = html.split('\n');

// Find all function declarations
const functionPattern = /^\s*function (\w+Demo)\(\) \{/;
const components = [];

console.log('Scanning for component functions...');

for (let i = 0; i < lines.length; i++) {
  const match = lines[i].match(functionPattern);
  if (match) {
    const functionName = match[1];
    const startLine = i;

    // Find the end of the function by counting braces
    let braceCount = 0;
    let endLine = startLine;
    let foundFirstBrace = false;

    for (let j = startLine; j < lines.length; j++) {
      const line = lines[j];

      // Count braces (simple approach - works for most cases)
      for (const char of line) {
        if (char === '{') {
          braceCount++;
          foundFirstBrace = true;
        } else if (char === '}') {
          braceCount--;
          if (foundFirstBrace && braceCount === 0) {
            endLine = j;
            break;
          }
        }
      }

      if (foundFirstBrace && braceCount === 0) {
        break;
      }
    }

    // Look backwards for data dependencies (const/let declarations)
    // Capture const/let declarations and their preceding comments, but stop at functions or section markers
    let dataStartLine = startLine;
    let foundDataDeclaration = false;

    for (let j = startLine - 1; j >= 0; j--) {
      const line = lines[j];
      const trimmed = line.trim();

      // Stop at previous function
      if (trimmed.match(/function \w+Demo\(\)/)) break;

      // Stop at section markers
      if (trimmed.includes('// ===')) break;
      if (trimmed.includes('DEMO COMPONENTS')) break;

      // Stop at closing braces (end of previous function)
      if (trimmed === '}' && !foundDataDeclaration) break;

      // Check if this is a top-level const/let declaration (not indented into a function)
      // But skip demoComponents which is the registry itself
      if (trimmed.match(/^(const|let)\s+\w+\s*=/) && !line.match(/^\s{6,}/) && !trimmed.includes('demoComponents')) {
        dataStartLine = j;
        foundDataDeclaration = true;
      }
      // Allow comments and blank lines if we've found data declarations
      else if (foundDataDeclaration && (trimmed.startsWith('//') || trimmed === '')) {
        dataStartLine = j;
      }
      // If we found data declarations but now hit something else, stop
      else if (foundDataDeclaration && !trimmed.startsWith('//') && trimmed !== '') {
        break;
      }
    }

    // Extract the component code
    const componentLines = lines.slice(dataStartLine, endLine + 1);

    components.push({
      name: functionName,
      id: functionName.replace('Demo', '').toLowerCase(),
      startLine: dataStartLine,
      endLine: endLine,
      code: componentLines.join('\n')
    });

    console.log(`Found: ${functionName} (lines ${dataStartLine}-${endLine})`);
  }
}

console.log(`\nTotal components found: ${components.length}`);

// Create output directory
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Generate component files
console.log('\nGenerating component files...');

components.forEach(comp => {
  const componentCode = generateComponentFile(comp);
  const fileName = `${comp.name}.jsx`;
  const filePath = path.join(OUTPUT_DIR, fileName);

  fs.writeFileSync(filePath, componentCode);
  console.log(`Created: ${fileName}`);
});

// Generate registry file
console.log('\nGenerating registry...');
generateRegistry(components);

console.log('\n✅ Extraction complete!');
console.log(`📁 Components: ${OUTPUT_DIR}`);
console.log(`📄 Registry: ${REGISTRY_FILE}`);

// Helper functions

function generateComponentFile(comp) {
  // Clean up the code
  let code = comp.code;

  // Remove leading whitespace consistently
  const lines = code.split('\n');
  const minIndent = lines
    .filter(line => line.trim().length > 0)
    .map(line => line.match(/^\s*/)[0].length)
    .reduce((min, indent) => Math.min(min, indent), Infinity);

  const cleanedLines = lines.map(line =>
    line.length > minIndent ? line.slice(minIndent) : line
  );

  code = cleanedLines.join('\n').trim();

  // Replace function declaration with export default
  code = code.replace(
    /function (\w+Demo)\(\) \{/,
    'export default function $1() {'
  );

  return `'use client';

import React from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, Reorder } from 'framer-motion';

${code}
`;
}

function generateRegistry(components) {
  const imports = components
    .map(comp => `import ${comp.name} from '../components/demos/${comp.name}';`)
    .join('\n');

  const registry = components
    .map(comp => `  '${comp.id}': ${comp.name},`)
    .join('\n');

  const registryCode = `// Auto-generated by extract-components.js
${imports}

export const demoComponents = {
${registry}
};

export const demoIds = Object.keys(demoComponents);
`;

  fs.writeFileSync(REGISTRY_FILE, registryCode);
  console.log('Created: demoRegistry.js');
}
