import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicJsonPath = path.resolve(__dirname, '../public/projects.json');

const RAW_URL = 'https://raw.githubusercontent.com/dPandl/dPandl.github.io/main/projects.json?t=' + Date.now();

console.log('\n[Pre-Deploy Sync] Lade neuste projects.json von GitHub herunter...');

try {
  const response = await fetch(RAW_URL);
  if (response.ok) {
    const content = await response.text();
    // Validate JSON format
    JSON.parse(content);
    fs.writeFileSync(publicJsonPath, content, 'utf8');
    console.log('[Pre-Deploy Sync] ✅ public/projects.json erfolgreich von GitHub aktualisiert!\n');
  } else {
    console.warn(`[Pre-Deploy Sync] ⚠️ GitHub API Status ${response.status}. Nutze bestehende lokale Datei.`);
  }
} catch (error) {
  console.warn('[Pre-Deploy Sync] ⚠️ Konnte neuste projects.json nicht von GitHub laden:', error);
}
