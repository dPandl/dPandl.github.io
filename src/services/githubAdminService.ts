// Helper for GitHub REST API interaction to commit projects.json directly

const REPO_OWNER = 'dPandl';
const REPO_NAME = 'dPandl.github.io';
const FILE_PATH = 'projects.json';

export function getAdminToken(): string | null {
    return localStorage.getItem('by_dp_github_token');
}

export function setAdminToken(token: string): void {
    localStorage.setItem('by_dp_github_token', token.trim());
}

export function removeAdminToken(): void {
    localStorage.removeItem('by_dp_github_token');
}

export function isAdminLoggedIn(): boolean {
    const token = getAdminToken();
    return Boolean(token && token.length > 5);
}

interface FetchFileResult {
    content: string;
    sha: string;
}

// Fetch file SHA & content from GitHub API
export async function getFileFromGitHub(token: string): Promise<FetchFileResult> {
    // Add timestamp param to avoid browser caching without CORS preflight issues
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}?t=${Date.now()}`;
    
    // Support modern Bearer token or token prefix
    const authHeader = token.startsWith('ghp_') || token.startsWith('github_pat_') ? `Bearer ${token}` : `token ${token}`;

    const response = await fetch(url, {
        headers: {
            'Authorization': authHeader,
            'Accept': 'application/vnd.github.v3+json'
        }
    });

    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            throw new Error('Ungültiger GitHub Access Token oder fehlende Lese-/Schreibrechte.');
        }
        if (response.status === 404) {
            throw new Error(`Die Datei '${FILE_PATH}' wurde auf dem Repository '${REPO_OWNER}/${REPO_NAME}' nicht gefunden.`);
        }
        throw new Error(`GitHub API Fehler (${response.status}): ${response.statusText}`);
    }

    const data = await response.json();
    return {
        content: data.content,
        sha: data.sha
    };
}

// Commit updated projects list JSON to GitHub main branch
export async function commitProjectsToGitHub(projectsData: any[], commitMessage: string): Promise<boolean> {
    const token = getAdminToken();
    if (!token) {
        throw new Error('Kein Admin Access Token vorhanden. Bitte melde dich an.');
    }

    // 1. Get current SHA of public/projects.json
    const { sha } = await getFileFromGitHub(token);

    // 2. Format JSON beautifully
    const jsonString = JSON.stringify(projectsData, null, 2);

    // 3. Encode UTF-8 String to Base64 (browser safe Unicode handling)
    const encoder = new TextEncoder();
    const bytes = encoder.encode(jsonString);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    const base64Content = btoa(binary);
    // Put request to commit updated projects.json file
    const authHeader = token.startsWith('ghp_') || token.startsWith('github_pat_') ? `Bearer ${token}` : `token ${token}`;

    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': authHeader,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: commitMessage || 'Update projects.json via Web Admin',
            content: base64Content,
            sha: sha,
            branch: 'main'
        })
    });

    if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.message || `Commit fehlgeschlagen (${response.status})`);
    }

    return true;
}
