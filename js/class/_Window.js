import { Mouse } from "../utils/Mouse.js";
import { windowEls } from "../class/windowEls.js";
import { Emitter } from "../utils/Emitter.js";

const _mouse = new Mouse();

export default class _Window {
    constructor(options, node) {
        this.postMinimizedHeight = null;
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
        this.maximizedData = null;
        this.maximizeSides = { left: null, right: null, top: null };
        this.emitter = new Emitter();
        // user decides
        this.borderWidth = options.borderWidth || 20;
        this.minWidth = options.minWidth ? options.minWidth + this.borderWidth * 2 : 60 + this.borderWidth * 2;
        this.headerHeight = options.headerHeight ? options.headerHeight + this.borderWidth : 30 + this.borderWidth;
        this.cornerSize = options.cornerSize || 16;
        this.enableGesture = options.gesture === true;
        this.entete = options.entete || "";
        this.width = options.width || 100;
        this.height = options.height + this.headerHeight || 100;
        this.x = options.x || 100;
        this.y = options.y || 100;
        this.maximizeTriggerArea = options.maximizeTriggerArea || 12;
    }

    build() {
        const listeners = {
            escapeBtnListener: { type: "click", callback: this.removeEl.bind(this) },
            minimizeBtnListener: { type: "click", callback: this.minimize.bind(this) },
            headerMouseDownListener: { type: "mousedown", callback: this.focus.bind(this) },
            containerMouseDownListener: { type: "mousedown", callback: this.focus.bind(this, null) },
            borders: { type: "mousedown", callback: this.borderSelect.bind(this) },
        };

        const options = {
            borderWidth: `${this.borderWidth}px`,
            cornerSize: `${this.cornerSize}px`,
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
        this.emitter.emit("minimizedToggle", this.minimized);
    }

    checkMaximize(evt) {
        for (const key in this.maximizeSides) {
            this.maximizeSides[key] = false;
        }

        if (evt.clientX < this.maximizeTriggerArea) {
            this.maximizeSides.left = true;
        } else if (evt.clientX > window.innerWidth - this.maximizeTriggerArea) {
            this.maximizeSides.right = true;
        } else if (evt.clientY < this.maximizeTriggerArea) {
            this.maximizeSides.top = true;
        }

       
    }

    maximize() {
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
        this.emitter.emit("maximizedToggle", maxProps);
        this.updatePosAndShape();
    }

    removeEl() {
        this.winEl.remove();
        this.emitter.emit("remove");
    }

    focus(evt = null) {
        if (!evt) return;
        this.selected = true;
        this.windowClickPos = _mouse.getCursorPos(this.winEl, evt);
        this.emitter.emit("focus");
    }

    release(evt) {
        this.selected = false;

        this.emitter.emit("release", evt);
        if (Object.values(this.maximizeSides).some((el) => el)) this.maximize();
    }

    drag(evt) {
        if (!this.selected || !this.windowClickPos) return;

        if (this.maximized) {
            this.width = this.preMaximizedWidth;
            this.height = this.preMaximizedHeight;
            this.windowClickPos.x *= this.preMaximizedWidth / this.maximizedData.width; // new click is at the rario of the maximized window / by the pre maximized width

            // so that we dont hit borders when dragging maximized window
            if (this.windowClickPos.x <= this.borderWidth) {
                this.windowClickPos.x = this.borderWidth + 1;
            } else if (this.windowClickPos.x >= this.width - this.borderWidth) {
                this.windowClickPos.x = this.width - this.borderWidth - 1;
            }

            this.maximized = false;
            this.maximizedData = null;
        }

        this.x = evt.clientX - this.windowClickPos.x;
        this.y = evt.clientY - this.windowClickPos.y;

        this.checkMaximize(evt);
        this.updatePosAndShape();
        this.emitter.emit("drag", evt);
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
        this.emitter.emit("borderSelected");
    }

    borderLeave(evt) {
        this.resizeStart = null;
        this.borderSelected = null;
        this.emitter.emit("borderReleased", evt);
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
        this.emitter.emit("resize", dirStrings);
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

    getMaximizeSide() {
        return Object.keys(this.maximizeSides).find((key) => this.maximizeSides[key]);
    }

    getZindex() {
        return this.winEl.style.zIndex;
    }

    setZindex(zIndex) {
        this.winEl.style.zIndex = zIndex;
    }
}
