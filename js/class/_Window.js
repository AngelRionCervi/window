import { Mouse } from "../utils/Mouse.js";
import { windowEls } from "../class/windowEls.js";

const _mouse = new Mouse();

export default class _Window {
    constructor(entete, x, y, width, height) {
        this.entete = entete;
        this.width = width;
        this.height = height;
        this.postMinimizedHeight = null;
        this.headerHeight = 40;
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
        this.borderWidth = 10;
        this.minWidth = 60;
        this.minHeight = 40;
    }

    build() {
        const listeners = {
            escapeBtnListener: { type: "click", callback: this.removeEl.bind(this) },
            minimizeBtnListener: { type: "click", callback: this.minimize.bind(this) },
            headerMouseDownListener: { type: "mousedown", callback: this.focus.bind(this) },
            headerMouseUpListener: { type: "mouseup", callback: this.release.bind(this) },
            borders: [
                { type: "mousedown", callback: this.borderSelect.bind(this) },
                /*{ type: "mouseup", callback: this.borderLeave.bind(this) },*/
            ],
        };

        return windowEls(this, listeners);
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
            this.elements.body.style.display = "none";
            this.postMinimizedHeight = this.height;
            this.height = this.headerHeight;
        } else {
            this.elements.body.style.display = "block";
            this.height = this.postMinimizedHeight;
        }
        this.updatePosAndShape();
    }

    removeEl() {
        this.winEl.remove();
    }

    focus(e) {
        this.selected = true;
        this.clickPos = _mouse.getCursorPos(this.winEl, e);
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
                if (this.width - this.minWidth - this.borderWidth * 2 <= 0) {
                    this.x += this.width - this.borderWidth * 2 - this.minWidth;
                }
            },

            bottom: () => {
                this.height = evt.clientY - this.resizeStart.y + this.preResizeHeight;
            },

            top: () => {
                this.y = evt.clientY - this.mousePosOnBorder.y;
                this.height = this.resizeStart.y - evt.clientY + this.preResizeHeight;
                if (this.height - this.minHeight - this.borderWidth * 2 <= 0) {
                    this.y += this.height - this.borderWidth * 2 - this.minHeight;
                }
            },
        };

        const dirStrings = this.borderSelected.split("-");
        dirStrings.forEach((direction) => dirObj[direction]());

        if (this.width - this.minWidth - this.borderWidth * 2 <= 0) {
            this.width = this.minWidth + this.borderWidth * 2;
        }
        if (this.height - this.minHeight - this.borderWidth * 2 <= 0) {
            this.height = this.minHeight + this.borderWidth * 2;
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

    getEl() {
        return this.winEl;
    }
}
