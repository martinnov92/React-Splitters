export function unselectAll() {
    try {
        window.getSelection().removeAllRanges();
    } catch (e) {
        console.warn(e);
    }
}