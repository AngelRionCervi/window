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
        this.windowClickPos = { x: 0, y: 0 };
        this.winEl = null;
        this.id = "_" + Math.random();
        this.minimized = false;
        this.maximized = false;
        this.elements = {};
        this.preResizeWidth = null;
        this.preResizeHeight = null;
        this.preMaximizedWidth = null;
        this.preMaximizedHeight = null;
        this.maximizedData = { x: 0, y: 0, width: 0, height: 0 };
        this.maximizeSides = { left: null, right: null, top: null };
        // user decides
        this.borderWidth = 10;
        this.minWidth = 60 + this.borderWidth * 2;
        this.headerHeight = 40 + this.borderWidth;
        this.enableGesture = true;
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
            headerHeight: `${this.headerHeight}px`,
        };

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
            this.height = this.headerHeight + this.borderWidth;
        } else {
            this.height = this.postMinimizedHeight;
        }
        this.updatePosAndShape();
    }

    maximize() {
        console.log("maximizing");
        this.preMaximizedWidth = this.width;
        this.preMaximizedHeight = this.height;

        const maxProps = {
            x: null,
            y: null,
            width: null,
            height: null,
        };
        for (const key in this.maximizeSides) {
            if (this.maximizeSides[key]) {
                switch (key) {
                    case "left":
                        maxProps.x = 0;
                        maxProps.y = 0;
                        maxProps.width = window.innerWidth / 2;
                        maxProps.height = window.innerHeight;
                        break;
                    case "right":
                        maxProps.x = window.innerWidth / 2;
                        maxProps.y = 0;
                        maxProps.width = window.innerWidth / 2;
                        maxProps.height = window.innerHeight;
                        break;
                    case "top":
                        maxProps.x = 0;
                        maxProps.y = 0;
                        maxProps.width = window.innerWidth;
                        maxProps.height = window.innerHeight;
                        break;
                }
            }
        }

        this.x = maxProps.x;
        this.y = maxProps.y;
        this.width = maxProps.width;
        this.height = maxProps.height;

        this.maximized = true;
        this.maximizedData = maxProps;
        this.updatePosAndShape();
    }

    removeEl() {
        this.winEl.remove();
    }

    focus(evt = null) {
        if (!evt) return;
        this.selected = true;
        this.windowClickPos = _mouse.getCursorPos(this.winEl, evt);
    }

    release() {
        this.selected = false;
        console.log(this.maximizeSides)
        if (Object.values(this.maximizeSides).some((el) => el)) {
            this.maximize();
        }
    }

    drag(evt) {
        if (!this.selected || !this.windowClickPos) return;

        if (this.maximized) {
            this.width = this.preMaximizedWidth;
            this.height = this.preMaximizedHeight;
            this.windowClickPos.x =
                this.windowClickPos.x * (this.preMaximizedWidth / this.maximizedData.width) - this.borderWidth;
            this.maximized = false;
        }

        this.x = evt.clientX - this.windowClickPos.x;
        this.y = evt.clientY - this.windowClickPos.y;
        console.log(this.windowClickPos.x * (this.preMaximizedWidth / this.maximizedData.width));

        for (const key in this.maximizeSides) {
            this.maximizeSides[key] = false;
        }

        if (evt.clientX < 10) {
            this.maximizeSides.left = true;
        } else if (evt.clientX > window.innerWidth - 10) {
            this.maximizeSides.right = true;
        }
        if (evt.clientY < 10) {
            this.maximizeSides.top = true;
        }

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
                if (this.height - this.headerHeight <= this.borderWidth) {
                    this.y += this.height - this.headerHeight - this.borderWidth;
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
        if (this.height - this.headerHeight <= this.borderWidth) {
            this.height = this.headerHeight + this.borderWidth;
        }

        this.maximized = false;
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
