import { DomBuilder } from "../utils/DomBuilder.js";
import { Mouse } from "../utils/Mouse.js";
const dob = new DomBuilder();
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
        this.clickPos = { x: 0, y: 0 };
        this.winEl = null;
        this.id = "_" + Math.random();
        this.minimized = false;
        this.elements = null;
    }

    build() {
        const listeners = {
            escapeBtnListener: { type: "click", callback: this.removeEl.bind(this) },
            minimizeBtnListener: { type: "click", callback: this.minimize.bind(this) },
            headerMouseDownListener: { type: "mousedown", callback: this.focus.bind(this) },
            headerMouseUpListener: { type: "mouseup", callback: this.release.bind(this) },
        };

        return new (function (_this) {
            this.escapeBtn = (() =>
                dob.createNode("button", "win-escape-btn", null, "x", listeners.escapeBtnListener))();
            this.minimizeBtn = (() =>
                dob.createNode("button", "win-minimize-btn", null, "v", listeners.minimizeBtnListener))();
            this.enteteContainer = (() => dob.createNode("div", "win-entete", null, _this.entete))();
            this.body = (() => dob.createNode("div", "win-body", null))();
            this.header = (() => {
                return dob.createNode(
                    "div",
                    "win-header",
                    null,
                    [this.enteteContainer, dob.enclose([this.escapeBtn, this.minimizeBtn], "win-btn-container")],
                    [listeners.headerMouseDownListener, listeners.headerMouseUpListener]
                );
            })();
            this.windowEl = (() => dob.createNode("div", "win win-container", null, [this.header, this.body]))();
        })(this);
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
