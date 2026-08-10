// Convert Hex to RGBA with opacity
export function hexToRgba(hex: string, alpha: number): string {
    const cleanHex = hex.replace('#', '');
    if (cleanHex.length !== 6) return `rgba(6, 182, 212, ${alpha})`;
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Darken a Hex color by a percentage (0 to 1, e.g. 0.25 for 25% darker)
export function darkenHex(hex: string, percent: number = 0.25): string {
    const cleanHex = hex.replace('#', '');
    if (cleanHex.length !== 6) return '#0284c7';
    let r = parseInt(cleanHex.substring(0, 2), 16);
    let g = parseInt(cleanHex.substring(2, 4), 16);
    let b = parseInt(cleanHex.substring(4, 6), 16);

    r = Math.max(0, Math.floor(r * (1 - percent)));
    g = Math.max(0, Math.floor(g * (1 - percent)));
    b = Math.max(0, Math.floor(b * (1 - percent)));

    const toHex = (n: number) => n.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Generate CSS linear gradient from Hex code to a slightly darker shade
export function getHexGradient(hex: string, percent: number = 0.25): string {
    const darker = darkenHex(hex, percent);
    return `linear-gradient(135deg, ${hex} 0%, ${darker} 100%)`;
}
