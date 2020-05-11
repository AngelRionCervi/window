export class Mouse {
    constructor() {
        this.lastPos = null;
    }

    getCursorPos(el = null, evt = null) {
        if (!evt || !el) return this.lastPos;
        const rect = el.getBoundingClientRect();
        this.lastPos = {
            x: Math.floor(((evt.clientX - rect.left) / (rect.right - rect.left)) * el.offsetWidth),
            y: Math.floor(((evt.clientY - rect.top) / (rect.bottom - rect.top)) * el.offsetHeight),
        };
        return this.lastPos;
    }
}
