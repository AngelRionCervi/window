import { Mouse } from "../utils/Mouse.js";
import { windowEls } from "../class/windowEls.js";

const _mouse = new Mouse();

export default class _Window {
    constructor(entete, x, y, width, height) {
        this.entete = entete;
        this.width = width;
        this.height = height;
        this.postMinimizedHeight = null;
        this.x = x;
        this.y = y;
        this.selected = false;
        this.borderSelected = null;
        this.resizeStart = null;
        this.mousePosOnBorder = null;
        this.clickPos = { x: 0, y: 0 };
        this.winEl = null;
        this.id = "_" + Math.random();
        this.minimized = false;
        this.elements = {};
        this.preResizeWidth = null;
        this.preResizeHeight = null;
        // user decides
        this.borderWidth = 10;
        this.minWidth = 60 + this.borderWidth * 2;
        this.headerHeight = 40 + this.borderWidth * 2;
    }

    build() {
        const listeners = {
            escapeBtnListener: { type: "click", callback: this.removeEl.bind(this) },
            minimizeBtnListener: { type: "click", callback: this.minimize.bind(this) },
            headerMouseDownListener: { type: "mousedown", callback: this.focus.bind(this) },
            headerMouseUpListener: { type: "mouseup", callback: this.release.bind(this) },
            containerMouseDownListener: { type: "mousedown", callback: this.focus.bind(this, null) },
            borders: { type: "mousedown", callback: this.borderSelect.bind(this) },
        };

        const options = {
            borderWidth: "7px",
            cornerSize: "14px",
        }

        return windowEls(this, listeners, options);
    }

    create() {
        this.elements = this.build();
        this.winEl = this.elements.windowEl;
        this.updatePosAndShape();
        document.body.appendChild(this.winEl);
    }

    minimize() {
        this.minimized = !this.minimized;
        if (this.minimized) {
            this.postMinimizedHeight = this.height;
            this.height = this.headerHeight;
        } else {
            this.height = this.postMinimizedHeight;
        }
        this.updatePosAndShape();
    }

    removeEl() {
        this.winEl.remove();
    }

    focus(evt = null) {
        if (!evt) return;
        this.selected = true;
        this.clickPos = _mouse.getCursorPos(this.winEl, evt);
    }

    release() {
        this.selected = false;
    }

    drag(e) {
        if (!this.selected || !this.clickPos) return;
        this.x = e.clientX - this.clickPos.x;
        this.y = e.clientY - this.clickPos.y;
        this.updatePosAndShape();
    }

    updatePosAndShape() {
        this.winEl.style.left = `${this.x}px`;
        this.winEl.style.top = `${this.y}px`;
        this.winEl.style.width = `${this.width}px`;
        this.winEl.style.height = `${this.height}px`;
    }

    borderSelect(evt) {
        this.resizeStart = { x: evt.clientX, y: evt.clientY };
        this.mousePosOnBorder = _mouse.getCursorPos(evt.target, evt);
        this.preResizeWidth = this.width;
        this.preResizeHeight = this.height;
        this.borderSelected = evt.target.getAttribute("data-resize");
    }

    borderLeave() {
        this.resizeStart = null;
        this.borderSelected = null;
    }

    resize(evt) {
        const dirObj = {
            right: () => {
                this.width = evt.clientX - this.resizeStart.x + this.preResizeWidth;
            },

            left: () => {
                this.x = evt.clientX - this.mousePosOnBorder.x;
                this.width = this.resizeStart.x - evt.clientX + this.preResizeWidth;
                if (this.width - this.minWidth <= 0) {
                    this.x += this.width - this.minWidth;
                }
            },

            bottom: () => {
                this.height = evt.clientY - this.resizeStart.y + this.preResizeHeight;
            },

            top: () => {
                this.y = evt.clientY - this.mousePosOnBorder.y;
                this.height = this.resizeStart.y - evt.clientY + this.preResizeHeight;
                if (this.height - this.headerHeight <= 0) {
                    this.y += this.height - this.headerHeight;
                }
            },
        };

        let dirStrings = this.borderSelected.split("-");
        if (this.minimized) {
            dirStrings = dirStrings.filter((el) => el !== "top" && el !== "bottom");
        }
        dirStrings.forEach((direction) => dirObj[direction]());

        if (this.width - this.minWidth <= 0) {
            this.width = this.minWidth;
        }
        if (this.height - this.headerHeight <= 0) {
            this.height = this.headerHeight;
        }

        this.updatePosAndShape();
    }

    isBorderSelected() {
        return this.borderSelected;
    }

    getID() {
        return this.id;
    }

    isSelected() {
        return this.selected;
    }

    isMinimized() {
        return this.minimized;
    }

    getEl() {
        return this.winEl;
    }
}
