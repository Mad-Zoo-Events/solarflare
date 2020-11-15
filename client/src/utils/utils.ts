export function getShortcut (keyBinding?: number): string {
    return (keyBinding && String.fromCharCode(keyBinding)) || "";
}
