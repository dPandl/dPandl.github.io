import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const targetFile = path.join(rootDir, 'public', 'projects.json');

async function syncProjectsJson() {
    console.log('\n[Pre-Deploy] Lade aktuellste projects.json von GitHub main branch runter...');
    try {
        const rawUrl = `https://raw.githubusercontent.com/dPandl/dPandl.github.io/main/projects.json?t=${Date.now()}`;
        const res = await fetch(rawUrl);
        
        if (res.ok) {
            const data = await res.text();
            // Validate JSON
            JSON.parse(data);
            fs.writeFileSync(targetFile, data, 'utf8');
            console.log('[Pre-Deploy] public/projects.json erfolgreich mit neustem GitHub-Stand überschrieben! ✅\n');
        } else {
            console.warn(`[Pre-Deploy] Download warnung (${res.status}): Behalte bestehende lokale projects.json bei.`);
        }
    } catch (err) {
        console.error('[Pre-Deploy] Fehler beim Runterladen der projects.json:', err);
    }
}

syncProjectsJson();
