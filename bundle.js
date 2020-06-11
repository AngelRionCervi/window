(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.myBundle = {}));
}(this, (function (exports) { 'use strict';

    function binder(obj, methods, callbacks, callOriginal = false, callOriginalFirst = false) {
        const meths = [methods].flat();
        const cbs = [callbacks].flat();
        for (const meth of meths) {
            const og = obj[meth];
            obj[meth] = function () {
                const args = [].slice.apply(arguments);
                if (callOriginal && callOriginalFirst) {
                    og.call(obj, ...args);
                    cbs.forEach((cb) => cb(...args));
                } else {
                    cbs.forEach((cb) => cb(...args));
                    if (callOriginal) og.call(obj, ...args);
                }
            };
        }
    }

    /**
     * @license The MIT License (MIT)             - [https://github.com/subversivo58/Emitter/blob/master/LICENSE]
     * @copyright Copyright (c) 2018 Lauro Moraes - [https://github.com/subversivo58]
     * @version 0.1.0 [development stage]         - [https://github.com/subversivo58/Emitter/blob/master/VERSIONING.md]
     */

    class Emitter extends EventTarget {
        constructor() {
            super();
            // store listeners (by callback)
            this.listeners = {
                '*': [] // pre alocate for all (wildcard)
            };
        }
        on(e, cb, once = false) {
            // store one-by-one registered listeners
            !this.listeners[e] ? this.listeners[e] = [cb] : this.listeners[e].push(cb);
            // check `.once()` ... callback `CustomEvent`
            once ? this.addEventListener(e, cb, { once: true }) : this.addEventListener(e, cb);
        }
        off(e, Fn = false) {
            if ( this.listeners[e] ) {
                // remove listener (include ".once()")
                let removeListener = target => {
                    this.removeEventListener(e, target);
                };
                // use `.filter()` to remove expecific event(s) associated to this callback
                const filter = () => {
                    this.listeners[e] = this.listeners[e].filter(val => {
                        return val === Fn ? removeListener(val) : val
                    });
                    // check number of listeners for this target ... remove target if empty
                    if ( this.listeners[e].length === 0 ) {
                        e !== '*' ? delete this.listeners[e] : null;
                    }
                };
                // use `.forEach()` to iterate all listeners for this target
                const iterate = () => {
                    let len = this.listeners[e].length;
                    while (len--) {
                        removeListener(this.listeners[e][len]);
                    }
                    // remove all listeners references (callbacks) for this target (by target object)
                    e !== '*' ? delete this.listeners[e] : this.listeners[e] = [];
                };
                Fn && typeof Fn === 'function' ? filter() : iterate();
            }
        }
        emit(e, d) {
             if ( this.listeners['*'].length > 0 ) {
                 this.dispatchEvent(new CustomEvent('*', {detail: d}));
             }
             this.dispatchEvent(new CustomEvent(e, {detail: d}));
        }
        once(e, cb) {
            this.on(e, cb, true);
        }
    }

    function isElement(element) {
        return element instanceof Element || element instanceof HTMLDocument;
    }

    class DomBuilder {
        element = null;

        createNode(tag, _class = null, id = null, inner = null, listener = null, customAttr = null, inlineStyle = null) {
            this.element = document.createElement(tag);

            if (_class) {
                this.addClasses(_class);
            }

            if (id) {
                this.element.id = id;
            }

            if (inner) {
                inner = [inner].flat();
                inner.forEach((content) => {
                    switch (typeof content) {
                        case "string":
                            this.element.innerText = content;
                            break;
                        case "number":
                            this.element.innerText = content.toString();
                            break;
                        case "object":
                            if (isElement(content)) {
                                this.element.appendChild(content);
                            }
                            break;
                    }
                });
            }

            if (listener) {
                if (Array.isArray(listener)) {
                    listener.forEach((l) => {
                        this.createListener(l);
                    });
                } else {
                    this.createListener(listener);
                }
            }

            if (inlineStyle) {
                this.addInlineStyle(customAttr);
            }

            if (customAttr) {
                this.addCustomAttr(customAttr);
            }

            return this;
        }

        addClasses(_class, node = null) {
            _class = [_class].flat();
            _class.forEach((c) => {
                const el = node ? node : this.element;
                el.classList.add(...c.split(" "));
            });
            return this;
        }

        addStyle(styles, node = null) {
            Object.keys(styles).forEach((key) => {
                const el = node ? node : this.element;
                el.style[key] = styles[key];
            });
            return this;
        }

        addCustomAttr(customAttr, node = null) {
            customAttr = [customAttr].flat();
            customAttr.forEach((attr) => {
                const el = node ? node : this.element;
                el.setAttribute(attr.type, attr.val);
            });
            return this;
        }

        createListener(l, node = null) {
            if (!l.hasOwnProperty("args")) l.args = [];
            const el = node ? node : this.element;
            el.addEventListener(l.type, (e) => {
                e.preventDefault();
                if (l.hasOwnProperty("event") && !l.event) {
                    l.callback(...l.args);
                } else {
                    l.callback(e, ...l.args);
                }
                return false;
            });
            return this;
        }

        fill(inner, node = null) {
            const el = node ? node : this.element;
            if (isElement(inner)) {
                el.appendChild(inner);
            } else {
                const container = document.createElement("p");
                container.innerHTML = inner;
                el.appendChild(container);
            }
            return this;
        }

        done() {
            return this.element;
        }

        enclose(_nodes, _class = null, tag = "div", listener = null, customAttrIn = null) {
            this.element = document.createElement(tag);
            const nodes = [_nodes].flat();

            for (const node of nodes) {
                if (isElement(node)) {
                    this.element.appendChild(node);
                } 
            }
            if (customAttrIn) {
                nodes.forEach((node) => {
                    this.addCustomAttr(customAttrIn, node);
                });
            }
            if (_class) this.addClasses(_class);
            if (listener) {
                const listeners = [listener].flat();
                listeners.forEach((l) => {
                    this.createListener(l);
                });
            }

            return this;
        }
    }

    const dob = new DomBuilder();

    class _MaximizedPreview {
        constructor() {
            this.previewingSide = null;
            this.previewEl = null;
            this.previewStyle = {
                position: "absolute",
                boxShadow: "inset 0px 0px 0px 5px darkgrey",
            };
            this.keyFrames = {
                top: [
                    {
                        width: window.innerWidth / 1.5 + "px",
                        height: window.innerHeight / 1.5 + "px",
                        right: window.innerWidth / 2 - window.innerWidth / 1.5 / 2 + "px",
                    },
                    { right: 0, width: window.innerWidth + "px", height: window.innerHeight + "px" },
                ],
                side: [
                    {
                        width: window.innerWidth / 3 + "px",
                        height: window.innerWidth / 3 + "px",
                        top: window.innerHeight / 2 - window.innerWidth / 3 / 2 + "px",
                    },
                    { top: 0, width: window.innerWidth / 2 + "px", height: window.innerHeight + "px" },
                ],
            };
            this.timing = {
                duration: 100,
                fill: "forwards",
            };
        }

        createPreviewNode() {
            return dob.createNode("div", "win2-max-preview").addStyle(this.previewStyle).done();
        }

        preview(side, zIndex) {
            if (!side) {
                this.removePreview();
                return;
            }
            if (side === this.previewingSide) return;
            if (this.previewEl) this.removePreview();
            this.previewingSide = side;
            this.previewEl = this.createPreviewNode();
            this[`preview${side.charAt(0).toUpperCase() + side.slice(1)}`](zIndex);
        }

        previewLeft(zIndex) {
            this.previewEl.style.left = 0;
            this.previewEl.style.zIndex = zIndex - 1;
            document.body.appendChild(this.previewEl);
            this.previewEl.animate(this.keyFrames.side, this.timing);
        }

        previewRight(zIndex) {
            this.previewEl.style.right = 0;
            this.previewEl.style.zIndex = zIndex - 1;
            document.body.appendChild(this.previewEl);
            this.previewEl.animate(this.keyFrames.side, this.timing);
        }

        previewTop(zIndex) {
            this.previewEl.style.top = 0;
            this.previewEl.style.zIndex = zIndex - 1;
            document.body.appendChild(this.previewEl);
            this.previewEl.animate(this.keyFrames.top, this.timing);
        }

        removePreview() {
            if (!this.previewEl) return;
            this.previewEl.remove();
            this.previewEl = null;
            this.previewingSide = null;
        }
    }

    class Mouse {
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

    const dob$1 = new DomBuilder();

    const windowEls = (listeners, options) => {
        let entete = null;
        if (options.enteteIcon) {
            entete = dob$1
                .enclose(
                    [
                        dob$1
                            .enclose(options.enteteIcon.cloneNode(true), "win2-icon-container")
                            .addStyle({ display: "inline", position: "relative", top: "2px", left: "2px" })
                            .done(),
                        dob$1
                            .createNode("p", null, null, options.entete.toString())
                            .addStyle({ margin: "0 5px 0 7px", display: "inline" })
                            .done(),
                    ],
                    "win2-entete-container"
                )
                .done();
        } else {
            entete = dob$1
                .createNode("p", null, null, options.entete.toString())
                .addStyle({ margin: "0 5px 0 7px", display: "inline" })
                .done();
        }

        return new (function () {
            this.borderTop = (() =>
                dob$1
                    .createNode("div", "win2-border-top win2-border", null, null, listeners.borders, {
                        type: "data-resize",
                        val: "top",
                    })
                    .addStyle({
                        top: 0,
                        left: options.cornerSize,
                        width: `calc(100% - ${options.cornerSize} * 2)`,
                        height: options.borderWidth,
                        cursor: "ns-resize",
                        position: "absolute",
                        backgroundColor: "lightgrey",
                    })
                    .done())();

            this.cornerTopRight = (() => {
                return dob$1
                    .enclose(
                        [
                            dob$1
                                .createNode("div", "win2-corner-top-right win2-corner-hor")
                                .addStyle({
                                    width: options.cornerSize,
                                    height: options.borderWidth,
                                    top: 0,
                                    right: 0,
                                    position: "absolute",
                                    cursor: "nesw-resize",
                                    backgroundColor: "lightgrey",
                                })
                                .done(),
                            dob$1
                                .createNode("div", "win2-corner-top-right win2-corner-ver")
                                .addStyle({
                                    width: options.borderWidth,
                                    height: options.cornerSize,
                                    top: 0,
                                    right: 0,
                                    position: "absolute",
                                    cursor: "nesw-resize",
                                    backgroundColor: "lightgrey",
                                })
                                .done(),
                        ],
                        null,
                        "div",
                        listeners.borders,
                        { type: "data-resize", val: "top-right" }
                    )
                    .done();
            })();

            this.borderRight = (() =>
                dob$1
                    .createNode("div", "win2-border-right win2-border", null, null, listeners.borders, {
                        type: "data-resize",
                        val: "right",
                    })
                    .addStyle({
                        top: options.cornerSize,
                        right: 0,
                        width: options.borderWidth,
                        height: `calc(100% - ${options.cornerSize} * 2)`,
                        cursor: "ew-resize",
                        position: "absolute",
                        backgroundColor: "lightgrey",
                    })
                    .done())();

            this.cornerTopLeft = (() => {
                return dob$1
                    .enclose(
                        [
                            dob$1
                                .createNode("div", "win2-corner-top-left win2-corner-hor")
                                .addStyle({
                                    width: options.cornerSize,
                                    height: options.borderWidth,
                                    top: 0,
                                    left: 0,
                                    position: "absolute",
                                    cursor: "nwse-resize",
                                    backgroundColor: "lightgrey",
                                })
                                .done(),
                            dob$1
                                .createNode("div", "win2-corner-top-left win2-corner-ver")
                                .addStyle({
                                    width: options.borderWidth,
                                    height: options.cornerSize,
                                    top: 0,
                                    left: 0,
                                    position: "absolute",
                                    cursor: "nwse-resize",
                                    backgroundColor: "lightgrey",
                                })
                                .done(),
                        ],
                        null,
                        "div",
                        listeners.borders,
                        { type: "data-resize", val: "top-left" }
                    )
                    .done();
            })();

            this.borderBottom = (() =>
                dob$1
                    .createNode("div", "win2-border-bottom win2-border", null, null, listeners.borders, {
                        type: "data-resize",
                        val: "bottom",
                    })
                    .addStyle({
                        bottom: 0,
                        left: options.cornerSize,
                        width: `calc(100% - ${options.cornerSize} * 2)`,
                        height: options.borderWidth,
                        cursor: "ns-resize",
                        position: "absolute",
                        backgroundColor: "lightgrey",
                    })
                    .done())();

            this.cornerBottomRight = (() => {
                return dob$1
                    .enclose(
                        [
                            dob$1
                                .createNode("div", "win2-corner-bottom-right win2-corner-hor")
                                .addStyle({
                                    width: options.cornerSize,
                                    height: options.borderWidth,
                                    bottom: 0,
                                    right: 0,
                                    position: "absolute",
                                    cursor: "nwse-resize",
                                    backgroundColor: "lightgrey",
                                })
                                .done(),
                            dob$1
                                .createNode("div", "win2-corner-bottom-right win2-corner-ver")
                                .addStyle({
                                    width: options.borderWidth,
                                    height: options.cornerSize,
                                    bottom: 0,
                                    right: 0,
                                    position: "absolute",
                                    cursor: "nwse-resize",
                                    backgroundColor: "lightgrey",
                                })
                                .done(),
                        ],
                        null,
                        "div",
                        listeners.borders,
                        { type: "data-resize", val: "bottom-right" }
                    )
                    .done();
            })();

            this.borderLeft = (() =>
                dob$1
                    .createNode("div", "win2-border-left win2-border", null, null, listeners.borders, {
                        type: "data-resize",
                        val: "left",
                    })
                    .addStyle({
                        top: options.cornerSize,
                        left: 0,
                        width: options.borderWidth,
                        height: `calc(100% - ${options.cornerSize} * 2)`,
                        cursor: "ew-resize",
                        position: "absolute",
                        backgroundColor: "lightgrey",
                    })
                    .done())();

            this.cornerBottomLeft = (() => {
                return dob$1
                    .enclose(
                        [
                            dob$1
                                .createNode("div", "win2-corner-bottom-left win2-corner-hor")
                                .addStyle({
                                    width: options.cornerSize,
                                    height: options.borderWidth,
                                    bottom: 0,
                                    left: 0,
                                    position: "absolute",
                                    cursor: "nesw-resize",
                                    backgroundColor: "lightgrey",
                                })
                                .done(),
                            dob$1
                                .createNode("div", "win2-corner-bottom-left win2-corner-ver")
                                .addStyle({
                                    width: options.borderWidth,
                                    height: options.cornerSize,
                                    bottom: 0,
                                    left: 0,
                                    position: "absolute",
                                    cursor: "nesw-resize",
                                    backgroundColor: "lightgrey",
                                })
                                .done(),
                        ],
                        null,
                        "div",
                        listeners.borders,
                        { type: "data-resize", val: "bottom-left" }
                    )
                    .done();
            })();
            this.escapeBtn = (() =>
                dob$1
                    .createNode(
                        "button",
                        "win2-button win2-escape-btn",
                        null,
                        options.escapeBtnContent,
                        listeners.escapeBtnListener
                    )
                    .done())();
            this.minimizeBtn = (() =>
                dob$1
                    .createNode(
                        "button",
                        "win2-button win2-minimize-btn",
                        null,
                        options.minimizeBtnContent,
                        listeners.minimizeBtnListener
                    )
                    .done())();
            this.maximizeBtn = (() =>
                dob$1
                    .createNode(
                        "button",
                        "win2-button win2-maximize-btn",
                        null,
                        options.maximizeBtnContent,
                        listeners.maximizeBtnListener
                    )
                    .done())();
            this.enteteContainer = (() =>
                dob$1.createNode("div", "win2-entete", null, entete).addStyle({ cursor: "default" }).done())();
            this.body = (() =>
                dob$1
                    .createNode("div", "win2-body", null)
                    .addStyle({
                        overflow: "hidden",
                        height: `calc(100% - ${options.headerHeight === "autopx" ? "0px" : options.headerHeight})`,
                        backgroundColor: "Bisque",
                    })
                    .done())();
            this.header = (() => {
                return dob$1
                    .createNode(
                        "div",
                        "win2-header",
                        null,
                        [
                            this.enteteContainer,
                            dob$1.enclose([this.minimizeBtn, this.maximizeBtn, this.escapeBtn], "win2-btn-container").done(),
                        ],
                        [listeners.headerMouseDownListener, listeners.headerDblClickListener]
                    )
                    .addStyle({
                        display: "flex",
                        justifyContent: "space-between",
                        height: options.headerHeight,
                        backgroundColor: "BurlyWood"
                    })
                    .done();
            })();
            this.windowContent = (() =>
                dob$1
                    .createNode("div", "win2-content", null, [this.header, this.body])
                    .addStyle({
                        display: "flex",
                        flexDirection: "column",
                        position: "absolute",
                        left: options.borderWidth,
                        top: options.borderWidth,
                        width: `calc(100% - ${options.borderWidth} * 2)`,
                        height: `calc(100% - ${options.borderWidth} * 2)`,
                    })
                    .done())();
            this.windowEl = (() =>
                dob$1
                    .createNode(
                        "div",
                        "win2-container",
                        null,
                        [
                            this.windowContent,
                            this.borderTop,
                            this.cornerTopRight,
                            this.borderRight,
                            this.cornerBottomRight,
                            this.borderBottom,
                            this.cornerBottomLeft,
                            this.borderLeft,
                            this.cornerTopLeft,
                        ],
                        listeners.containerMouseDownListener
                    )
                    .addStyle({ position: "absolute" })
                    .done())();
        })();
    };

    const _mouse = new Mouse();

    class _Window {
        constructor(options = null, content = null) {
            this.postMinimizedHeight = null;
            this.selected = false;
            this.borderSelected = null;
            this.resizeStart = null;
            this.mousePosOnBorder = null;
            this.windowClickPos = { x: 0, y: 0 };
            this.winEl = null;
            this.id = "_" + Math.random().toString(36).substr(2, 16);
            this.minimized = false;
            this.maximized = false;
            this.elements = {};
            this.preResizeWidth = null;
            this.preResizeHeight = null;
            this.preMaximizedWidth = null;
            this.preMaximizedHeight = null;
            this.maximizedData = null;
            this.maximizeSides = { left: null, right: null, top: null };
            this.disablePreview = false;
            this.content = content;
            this.emitter = new Emitter();
            // user decides
            this.name = options?.name || "default";
            this.borderWidth = options?.borderWidth || 3;
            this.minWidth = options?.minWidth ? options?.minWidth + this.borderWidth * 2 : 100 + this.borderWidth * 2;
            this.headerHeight = options?.headerHeight ? options?.headerHeight + this.borderWidth : "auto";
            this.cornerSize = options?.cornerSize || 16;
            this.enableGesture = options?.gesture === true;
            this.entete = options?.entete || "";
            this.enteteIcon = options?.enteteIcon || false;
            this.width = options?.width || 200;
            this.height = options?.height || 200;
            this.x = options?.x || 100;
            this.y = options?.y || 100;
            this.maximizeTriggerArea = options?.maximizeTriggerArea || 12;
            this.nextMaximizeDelay = options?.nextMaximizeDelay || 500;
            this.minimizeBtnContent = options?.minimizeBtnContent || "";
            this.maximizeBtnContent = options?.maximizeBtnContent || "";
            this.escapeBtnContent = options?.escapeBtnContent || "";
        }

        build() {
            const listeners = {
                escapeBtnListener: { type: "click", callback: this.removeEl.bind(this) },
                minimizeBtnListener: { type: "click", callback: this.minimize.bind(this) },
                maximizeBtnListener: { type: "click", callback: this.maximizeTrigger.bind(this) },
                headerMouseDownListener: { type: "mousedown", callback: this.focus.bind(this) },
                headerDblClickListener: { type: "dblclick", callback: this.maximizeTrigger.bind(this) },
                containerMouseDownListener: { type: "mousedown", callback: this.focus.bind(this, null) },
                borders: { type: "mousedown", callback: this.borderSelect.bind(this) },
            };

            const options = {
                borderWidth: `${this.borderWidth}px`,
                cornerSize: `${this.cornerSize}px`,
                headerHeight: `${this.headerHeight}px`,
                minimizeBtnContent: this.minimizeBtnContent,
                maximizeBtnContent: this.maximizeBtnContent,
                escapeBtnContent: this.escapeBtnContent,
                entete: this.entete,
                enteteIcon: this.enteteIcon,
            };

            return windowEls(listeners, options);
        }

        create() {
            this.elements = this.build();
            if (this.content) this.elements.body.appendChild(this.content);
            this.winEl = this.elements.windowEl;
            this.updatePosAndShape();
            document.body.appendChild(this.winEl);
            if (this.headerHeight === "auto") {
                this.headerHeight = this.elements.header.offsetHeight + this.borderWidth;
            }
        }

        minimize() {
            this.minimized = !this.minimized;
            this.maximized = false;

            if (this.minimized) {
                this.postMinimizedHeight = this.height;
                this.height = this.headerHeight + this.borderWidth;
            } else {
                this.height = this.postMinimizedHeight;
            }
            this.updatePosAndShape();
            this.emitter.emit("minimizeToggle", this.minimized);
        }

        checkMaximize(evt) {
            this.resetMaximizedSides();
            if (this.disablePreview || !this.enableGesture) return;

            if (evt.clientX < this.maximizeTriggerArea) {
                this.maximizeSides.left = true;
            } else if (evt.clientX > window.innerWidth - this.maximizeTriggerArea) {
                this.maximizeSides.right = true;
            } else if (evt.clientY < this.maximizeTriggerArea) {
                this.maximizeSides.top = true;
            }
        }

        maximizeTrigger(evt) {
            if (evt.target.isSameNode(this.elements.minimizeBtn)) return;
            if (this.maximizeSides.top) {
                this.resetWin();
                return;
            }
            this.maximizeSides.top = true;
            this.maximize();
        }

        resetWin() {
            this.resetMaximizedSides();
            this.minimized = false;
            this.maximized = false;

            this.width = window.innerWidth / 2;
            this.height = window.innerHeight / 2;
            this.x = window.innerWidth / 4;
            this.y = window.innerHeight / 4;
            this.updatePosAndShape();
        }

        maximize() {
            this.minimized = false;
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
            this.emitter.emit("maximizeToggle", maxProps);
            this.updatePosAndShape();
        }

        removeEl(evt = null) {
            this.winEl.remove();
            this.emitter.emit("remove", evt);
        }

        focus(evt = null) {
            if (!evt) return;
            this.selected = true;
            this.windowClickPos = _mouse.getCursorPos(this.winEl, evt);
            this.emitter.emit("focus", evt);
        }

        release(evt) {
            this.selected = false;
            if (evt.target.tagName.toUpperCase() === "BUTTON") return;
            if (Object.values(this.maximizeSides).some((el) => el)) this.maximize();
            this.emitter.emit("release", evt);
        }

        drag(evt) {
            if (!this.selected || !this.windowClickPos) return;

            if (this.maximized && !this.minimized) {
                this.width = this.preMaximizedWidth;
                this.height = this.preMaximizedHeight;
                this.windowClickPos.x *= this.preMaximizedWidth / this.maximizedData.width; // new click is at the rario of the maximized window / by the pre maximized width

                // so that we dont hit borders when dragging maximized window
                if (this.windowClickPos.x <= this.borderWidth) {
                    this.windowClickPos.x = this.borderWidth + 1;
                } else if (this.windowClickPos.x >= this.width - this.borderWidth) {
                    this.windowClickPos.x = this.width - this.borderWidth - 1;
                }

                this.disablePreview = true;
                setTimeout(() => {
                    this.disablePreview = false;
                }, this.nextMaximizeDelay);

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
            this.emitter.emit("borderSelect", evt);
        }

        borderLeave(evt) {
            this.resizeStart = null;
            this.borderSelected = null;
            this.emitter.emit("borderRelease", evt);
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

        resetMaximizedSides() {
            for (const key in this.maximizeSides) this.maximizeSides[key] = false;
        }

        getZindex() {
            return this.winEl.style.zIndex;
        }

        setZindex(zIndex) {
            this.winEl.style.zIndex = zIndex;
        }

        getCoord() {
            return { x: this.x, y: this.y };
        }

        getWidth() {
            return this.width;
        }

        getHeight() {
            return this.height;
        }
    }

    class _WindowList {
        constructor() {
            this.list = [];
            this.focusedID = null;
            this.startingZI = 5;
            this.maxPreview = new _MaximizedPreview();
            document.addEventListener("mousemove", this.targetDrag.bind(this));
            document.addEventListener("mouseup", this.deselect.bind(this));
            this.emitter = new Emitter();
            this.eventTypes = [
                "minimizeToggle",
                "maximizeToggle",
                "remove",
                "focus",
                "drag",
                "release",
                "borderSelect",
                "borderRelease",
                "resize",
            ];
        }

        getWinByID(id) {
            return this.list.find((el) => el.getID() === id);
        }

        getAllExceptID(id) {
            return this.list.filter((el) => el.getID() !== id);
        }

        getSelectedWin() {
            return this.list.find((el) => el.isSelected());
        }

        getBorderSelectedWin() {
            return this.list.find((el) => el.isBorderSelected());
        }

        getWinByZindex(zIndex) {
            return this.list.find((el) => Number(el.getEl().style.zIndex) === zIndex);
        }

        getFrontWin() {
            return this.list.sort((a, b) => Number(b.getEl().style.zIndex) - Number(a.getEl().style.zIndex))[0];
        }

        getAllWin() {
            return this.list;
        }

        closeAllWin() {
            for (let u = this.list.length - 1; u >= 0; u--) {
                this.list[u].removeEl();
            }
        }

        add(options, content) {
            const win = new _Window(options, content);
            binder(win, "removeEl", () => this.removeOfList(win.getID()), true);
            binder(win, "focus", () => this.changeFocus(win.getID()), true);
            binder(win, "checkMaximize", () => this.maxPreview.preview(win.getMaximizeSide(), win.getZindex()), true, true);
            binder(win, "release", () => this.maxPreview.removePreview(), true);
            win.create();
            win.getEl();
            this.list.push(win);
            this.initZindex(win.getID());
            this.startListening(win);
        }

        startListening(win) {
            this.eventTypes.map((type) => {
                win.emitter.on(type, ({ detail }) => this.emitter.emit(type, { id: win.id, payload: detail }));
            });
        }

        removeOfList(id) {
            this.list.splice(this.list.map((el) => el.getID()).indexOf(id), 1);
        }

        targetDrag(evt) {
            const winSelected = this.getSelectedWin();
            const borderSelectedWin = this.getBorderSelectedWin();
            if (winSelected) {
                winSelected.drag(evt);
            } else if (borderSelectedWin) {
                borderSelectedWin.resize(evt);
            }
        }

        deselect(evt) {
            const winSelected = this.getSelectedWin();
            const borderSelectedWin = this.getBorderSelectedWin();
            if (winSelected) {
                winSelected.release(evt);
            } else if (borderSelectedWin) {
                borderSelectedWin.borderLeave(evt);
            }
        }

        // not sure tbh
        changeFocus(id) {
            if (this.focusedID === id) return;
            this.focusedID = id;

            const totalZI = this.list.length + this.startingZI;
            const win = this.getWinByID(id);
            const winToReplace = this.getFrontWin(); // currently focused win

            win.getEl().style.zIndex = totalZI; // focus the win
            winToReplace.getEl().style.zIndex = totalZI - 1; // previsously focused win gets -1

            const otherWins = this.list //get all the other wins sorted by zIndex, largest zIndex first
                .filter((el) => el.id !== id && el.id !== winToReplace.getID())
                .sort((b, a) => Number(a.getEl().style.zIndex) - Number(b.getEl().style.zIndex));

            otherWins.forEach((win, listIndex, wins) => {
                // loopy loop
                const el = win.getEl();
                const zIndex = Number(el.style.zIndex);
                if (zIndex === totalZI - 1) {
                    // look mom im high
                    for (let u = listIndex; u < wins.length - listIndex; u++) {
                        const restEl = wins[u].getEl();
                        const restZindex = Number(restEl.style.zIndex);
                        if (u > 0 && Number(wins[u - 1].getEl().style.zIndex) - restZindex > 0) break; // gap is > 0 we stop -1 the other zIndexes
                        restEl.style.zIndex = restZindex - 1; // go down >:(
                    }
                }
            });
        }

        initZindex(id) {
            const win = this.getWinByID(id);
            win.getEl().style.zIndex = this.list.length + this.startingZI;
        }
    }

    const WinJS = new _WindowList();

    exports.WinJS = WinJS;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
