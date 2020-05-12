import { DomBuilder } from "../utils/DomBuilder.js";
const dob = new DomBuilder();

export const windowEls = (_this, listeners) =>
    new (function () {
        this.borderTop = (() =>
            dob.createNode("div", "win2-border-top win2-border", null, null, listeners.borders, {
                type: "data-resize",
                val: "top",
            }))();

        this.cornerTopRight = (() => {
            return dob.enclose(
                [
                    dob.createNode("div", "win2-corner-hor win2-corner-top-right"),
                    dob.createNode("div", "win2-corner-ver win2-corner-top-right"),
                ],
                null,
                "div",
                listeners.borders,
                { type: "data-resize", val: "top-right" }
            );
        })();

        this.borderRight = (() =>
            dob.createNode("div", "win2-border-right win2-border", null, null, listeners.borders, {
                type: "data-resize",
                val: "right",
            }))();

        this.cornerBottomRight = (() => {
            return dob.enclose(
                [
                    dob.createNode("div", "win2-corner-hor win2-corner-top-left"),
                    dob.createNode("div", "win2-corner-ver win2-corner-top-left"),
                ],
                null,
                "div",
                listeners.borders,
                { type: "data-resize", val: "top-left" }
            );
        })();

        this.borderBottom = (() =>
            dob.createNode("div", "win2-border-bottom win2-border", null, null, listeners.borders, {
                type: "data-resize",
                val: "bottom",
            }))();

        this.cornerBottomLeft = (() => {
            return dob.enclose(
                [
                    dob.createNode("div", "win2-corner-hor win2-corner-bottom-right"),
                    dob.createNode("div", "win2-corner-ver win2-corner-bottom-right"),
                ],
                null,
                "div",
                listeners.borders,
                { type: "data-resize", val: "bottom-right" }
            );
        })();

        this.borderLeft = (() =>
            dob.createNode("div", "win2-border-left win2-border", null, null, listeners.borders, {
                type: "data-resize",
                val: "left",
            }))();

        this.cornerTopLeft = (() => {
            return dob.enclose(
                [
                    dob.createNode("div", "win2-corner-hor win2-corner-bottom-left"),
                    dob.createNode("div", "win2-corner-ver win2-corner-bottom-left"),
                ],
                null,
                "div",
                listeners.borders,
                { type: "data-resize", val: "bottom-left" }
            );
        })();

        this.escapeBtn = (() => dob.createNode("button", "win-escape-btn", null, "x", listeners.escapeBtnListener))();
        this.minimizeBtn = (() =>
            dob.createNode("button", "win-minimize-btn", null, "v", listeners.minimizeBtnListener))();
        this.enteteContainer = (() => dob.createNode("div", "win-entete", null, _this.entete))();
        this.body = (() => dob.createNode("div", "win2-body", null))();
        this.header = (() => {
            return dob.createNode(
                "div",
                "win2-header",
                null,
                [this.enteteContainer, dob.enclose([this.escapeBtn, this.minimizeBtn], "win-btn-container")],
                [listeners.headerMouseDownListener, listeners.headerMouseUpListener]
            );
        })();
        this.windowContent = (() => dob.createNode("div", "win2-content", null, [this.header, this.body]))();
        this.windowEl = (() =>
            dob.createNode(
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
            ))();
    })();
