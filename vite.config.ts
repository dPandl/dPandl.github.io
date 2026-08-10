import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Custom plugin to prevent Vite build from creating dist/projects.json so gh-pages deployment never overwrites GitHub online admin edits
const ignoreProjectsJsonBuild = () => ({
  name: 'ignore-projects-json-build',
  closeBundle() {
    const distProjectsFile = path.resolve(__dirname, 'dist/projects.json');
    if (fs.existsSync(distProjectsFile)) {
      fs.unlinkSync(distProjectsFile);
      console.log('\n[Vite Build] Removed dist/projects.json to preserve live GitHub admin edits!\n');
    }
  }
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), ignoreProjectsJsonBuild()],
})