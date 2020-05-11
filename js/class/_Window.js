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
        this.clickPos = { x: 0, y: 0 };
        this.winEl = null;
        this.id = "_" + Math.random();
        this.minimized = false;
        this.elements = {};
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
        this.resizeStart = { x: evt.screenX, y: evt.screenY };
        this.borderSelected = evt.target.getAttribute("data-resize");
    }

    borderLeave() {
        this.resizeStart = null;
        this.borderSelected = null;
    }

    resize(evt) {
        console.log("resize", evt, evt.screenX, this.resizeStart.x);
        switch (this.borderSelected) {
            case "right":
                console.log("resize right");
                this.width = this.resizeStart.x - this.x + evt.screenX - this.resizeStart.x;
                break;
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
