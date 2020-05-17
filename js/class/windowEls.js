import { DomBuilder } from "../utils/DomBuilder.js";
const dob = new DomBuilder();

export const windowEls = (_this, listeners, options) =>
    new (function () {
        this.borderTop = (() =>
            dob
                .createNode("div", "win2-border-top win2-border", null, null, listeners.borders, {
                    type: "data-resize",
                    val: "top",
                })
                .addInlineStyle({
                    top: 0,
                    left: options.cornerSize,
                    width: `calc(100% - ${options.cornerSize} * 2)`,
                    height: options.borderWidth,
                    cursor: "ns-resize",
                    position: "absolute",
                })
                .done())();

        this.cornerTopRight = (() => {
            return dob
                .enclose(
                    [
                        dob
                            .createNode("div", "win2-corner-hor")
                            .addInlineStyle({
                                width: options.cornerSize,
                                height: options.borderWidth,
                                top: 0,
                                right: 0,
                                position: "absolute",
                                cursor: "nesw-resize",
                            })
                            .done(),
                        dob
                            .createNode("div", "win2-corner-ver")
                            .addInlineStyle({
                                width: options.borderWidth,
                                height: options.cornerSize,
                                top: 0,
                                right: 0,
                                position: "absolute",
                                cursor: "nesw-resize",
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
            dob
                .createNode("div", "win2-border-right win2-border", null, null, listeners.borders, {
                    type: "data-resize",
                    val: "right",
                })
                .addInlineStyle({
                    top: options.cornerSize,
                    right: 0,
                    width: options.borderWidth,
                    height: `calc(100% - ${options.cornerSize} * 2)`,
                    cursor: "ew-resize",
                    position: "absolute",
                })
                .done())();

        this.cornerTopLeft = (() => {
            return dob
                .enclose(
                    [
                        dob
                            .createNode("div", "win2-corner-hor")
                            .addInlineStyle({
                                width: options.cornerSize,
                                height: options.borderWidth,
                                top: 0,
                                left: 0,
                                position: "absolute",
                                cursor: "nwse-resize",
                            })
                            .done(),
                        dob
                            .createNode("div", "win2-corner-ver")
                            .addInlineStyle({
                                width: options.borderWidth,
                                height: options.cornerSize,
                                top: 0,
                                left: 0,
                                position: "absolute",
                                cursor: "nwse-resize",
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
            dob
                .createNode("div", "win2-border-bottom win2-border", null, null, listeners.borders, {
                    type: "data-resize",
                    val: "bottom",
                })
                .addInlineStyle({
                    bottom: 0,
                    left: options.cornerSize,
                    width: `calc(100% - ${options.cornerSize} * 2)`,
                    height: options.borderWidth,
                    cursor: "ns-resize",
                    position: "absolute",
                })
                .done())();

        this.cornerBottomRight = (() => {
            return dob
                .enclose(
                    [
                        dob
                            .createNode("div", "win2-corner-hor")
                            .addInlineStyle({
                                width: options.cornerSize,
                                height: options.borderWidth,
                                bottom: 0,
                                right: 0,
                                position: "absolute",
                                cursor: "nwse-resize",
                            })
                            .done(),
                        dob
                            .createNode("div", "win2-corner-ver")
                            .addInlineStyle({
                                width: options.borderWidth,
                                height: options.cornerSize,
                                bottom: 0,
                                right: 0,
                                position: "absolute",
                                cursor: "nwse-resize",
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
            dob
                .createNode("div", "win2-border-left win2-border", null, null, listeners.borders, {
                    type: "data-resize",
                    val: "left",
                })
                .addInlineStyle({
                    top: options.cornerSize,
                    left: 0,
                    width: options.borderWidth,
                    height: `calc(100% - ${options.cornerSize} * 2)`,
                    cursor: "ew-resize",
                    position: "absolute",
                })
                .done())();

        this.cornerBottomLeft = (() => {
            return dob
                .enclose(
                    [
                        dob
                            .createNode("div", "win2-corner-hor")
                            .addInlineStyle({
                                width: options.cornerSize,
                                height: options.borderWidth,
                                bottom: 0,
                                left: 0,
                                position: "absolute",
                                cursor: "nesw-resize",
                            })
                            .done(),
                        dob
                            .createNode("div", "win2-corner-ver")
                            .addInlineStyle({
                                width: options.borderWidth,
                                height: options.cornerSize,
                                bottom: 0,
                                left: 0,
                                position: "absolute",
                                cursor: "nesw-resize",
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
            dob.createNode("button", "win-escape-btn", null, "x", listeners.escapeBtnListener).done())();
        this.minimizeBtn = (() =>
            dob.createNode("button", "win-minimize-btn", null, "v", listeners.minimizeBtnListener).done())();

        this.enteteContainer = (() => dob.createNode("div", "win-entete", null, _this.entete).done())();
        this.body = (() => dob.createNode("div", "win2-body", null).done())();
        this.header = (() => {
            return dob
                .createNode(
                    "div",
                    "win2-header",
                    null,
                    [this.enteteContainer, dob.enclose([this.escapeBtn, this.minimizeBtn], "win-btn-container").done()],
                    listeners.headerMouseDownListener
                )
                .done();
        })();
        this.windowContent = (() =>
            dob
                .createNode("div", "win2-content", null, [this.header, this.body])
                .addInlineStyle({
                    display: "grid",
                    gridTemplateRows: `${options.headerHeight} auto`,
                    position: "absolute",
                    left: options.borderWidth,
                    top: options.borderWidth,
                    width: `calc(100% - ${options.borderWidth} * 2)`,
                    height: `calc(100% - ${options.borderWidth} * 2)`,
                })
                .done())();
        this.windowEl = (() =>
            dob
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
                .done())();
    })();
