export type ProjectCategory = string;

export type PlatformSupport = 'mobile' | 'desktop' | 'both';

export interface Project {
    id: string;
    title: string;
    tagline: string;
    description: string;
    longDescription?: string;
    color: string; // Hex Farbcode (z. B. "#8b5cf6")
    glowColor?: string; // Abwärtskompatibilität
    isFeatured?: boolean; // Kennzeichnung als App des Monats / Spotlight App
    githubRepo?: string; // z. B. "dPandl/griddly-csv" für auto-release fetch
    openUrl?: string;
    downloadUrl?: string;
    downloadFilename?: string;
    downloadUrls?: {
        windows?: string;
        linux?: string;
        mac?: string;
        android?: string;
    };
    status?: string;
    category: ProjectCategory;
    version: string;
    releaseDate: string;
    updatedDate: string;
    supportedPlatforms?: PlatformSupport; // 'mobile' (nur Smartphone), 'desktop' (nur PC), 'both' (beide)
    mobileCompatible?: boolean; // Abwärtskompatibilität
    icon?: string;
    screenshots?: string[];
    features?: string[];
    developer?: string;
}

export const initialProjects: Project[] = [];

// In-Memory-Cache, damit Folgeaufrufe und Komponenten-Wechsel synchron und ohne Re-Fetch sofort verfügbar sind
let cachedProjects: Project[] | null = null;
let fetchPromise: Promise<Project[]> | null = null;

// Helper to enrich projects with live GitHub release details if githubRepo is specified
async function enrichWithGitHubReleases(projectsList: Project[]): Promise<Project[]> {
    return Promise.all(
        projectsList.map(async (project) => {
            if (!project.githubRepo) return project;
            try {
                // Clean input: remove https://github.com/ and trailing slashes
                const cleanRepo = project.githubRepo
                    .replace(/^https?:\/\/github\.com\//i, '')
                    .trim()
                    .replace(/\/+$/, '');

                if (!cleanRepo) return project;

                // Fetch latest release from GitHub API (public API, no auth required)
                const res = await fetch(`https://api.github.com/repos/${cleanRepo}/releases/latest`);
                if (res.ok) {
                    const release = await res.json();
                    const version = release.tag_name ? release.tag_name.replace(/^v/, '') : project.version;
                    
                    let downloadUrl = project.downloadUrl;
                    let downloadFilename = project.downloadFilename;
                    const autoDownloadUrls = { ...project.downloadUrls };

                    if (release.assets && release.assets.length > 0) {
                        release.assets.forEach((asset: any) => {
                            const name = (asset.name || '').toLowerCase();
                            const url = asset.browser_download_url;

                            if (name.includes('.exe') || name.includes('-win') || name.includes('.msi')) {
                                autoDownloadUrls.windows = url;
                            } else if (name.includes('.apk')) {
                                autoDownloadUrls.android = url;
                            } else if (name.includes('.dmg') || name.includes('-mac') || name.includes('.pkg')) {
                                autoDownloadUrls.mac = url;
                            } else if (name.includes('.appimage') || name.includes('.deb') || name.includes('-linux') || name.includes('.rpm') || (name.includes('linux') && name.includes('.zip'))) {
                                autoDownloadUrls.linux = url;
                            }
                        });

                        // Default fallback asset
                        if (!downloadUrl && release.assets[0]) {
                            downloadUrl = release.assets[0].browser_download_url;
                            downloadFilename = release.assets[0].name;
                        }
                    }

                    return {
                        ...project,
                        version: version || project.version,
                        downloadUrl: downloadUrl,
                        downloadFilename: downloadFilename,
                        downloadUrls: autoDownloadUrls
                    };
                }
            } catch (e) {
                console.warn(`Could not fetch latest release for ${project.githubRepo}:`, e);
            }
            return project;
        })
    );
}

export function invalidateProjectsCache() {
    cachedProjects = null;
    fetchPromise = null;
}

export async function fetchProjects(forceRefresh = false): Promise<Project[]> {
    if (!forceRefresh && cachedProjects && cachedProjects.length > 0) {
        return cachedProjects;
    }

    if (!forceRefresh && fetchPromise) {
        return fetchPromise;
    }

    fetchPromise = (async () => {
        const timestamp = Date.now();
        let loadedProjects: Project[] = [];

        // 0. If admin token exists, fetch directly via GitHub REST API (always 100% immediate & real-time)
        const adminToken = localStorage.getItem('by_dp_github_token');
        if (adminToken) {
            try {
                const url = `https://api.github.com/repos/dPandl/dPandl.github.io/contents/projects.json?t=${timestamp}`;
                const authHeader = adminToken.startsWith('ghp_') || adminToken.startsWith('github_pat_') ? `Bearer ${adminToken}` : `token ${adminToken}`;
                const apiRes = await fetch(url, {
                    headers: { 'Authorization': authHeader, 'Accept': 'application/vnd.github.v3+json' }
                });
                if (apiRes.ok) {
                    const apiData = await apiRes.json();
                    if (apiData.content) {
                        const binary = atob(apiData.content.replace(/\s/g, ''));
                        const bytes = new Uint8Array(binary.length);
                        for (let i = 0; i < binary.length; i++) {
                            bytes[i] = binary.charCodeAt(i);
                        }
                        const text = new TextDecoder('utf-8').decode(bytes);
                        const parsed = JSON.parse(text);
                        if (Array.isArray(parsed) && parsed.length > 0) {
                            const enriched = await enrichWithGitHubReleases(parsed);
                            cachedProjects = enriched;
                            return enriched;
                        }
                    }
                }
            } catch (err) {
                console.warn('GitHub REST API direct fetch failed, falling back to public files:', err);
            }
        }

        // 1. Try local relative fetch with cache-busting
        try {
            const response = await fetch(`./projects.json?t=${timestamp}`);
            if (response.ok) {
                const data = await response.json();
                if (Array.isArray(data) && data.length > 0) {
                    loadedProjects = data;
                }
            }
        } catch (e) {
            console.warn('Local projects.json fetch failed:', e);
            // 2. Fallback to raw GitHub main branch
            try {
                const rawUrl = `https://raw.githubusercontent.com/dPandl/dPandl.github.io/main/projects.json?t=${timestamp}`;
                const rawResponse = await fetch(rawUrl);
                if (rawResponse.ok) {
                    const rawData = await rawResponse.json();
                    if (Array.isArray(rawData) && rawData.length > 0) {
                        loadedProjects = rawData;
                    }
                }
            } catch (e2) {
                console.warn('Raw GitHub fetch failed:', e2);
            }
        }

        const enriched = await enrichWithGitHubReleases(loadedProjects);
        cachedProjects = enriched;
        return enriched;
    })();

    return fetchPromise;
}

export const projects = initialProjects;

