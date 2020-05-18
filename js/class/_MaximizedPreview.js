import { DomBuilder } from "../utils/DomBuilder.js";
const dob = new DomBuilder();

export class _MaximizedPreview {
    constructor() {
        this.previewEl = this.createPreviewNode();
    }

    createPreviewNode() {
        return dob.createNode("div", "win2-max-preview").done();
    }

    preview(side = "left") {
        this[`preview${side.charAt(0).toUpperCase() + side.slice(1)}`]();
    }

    previewLeft() {
        console.log("preview left")
    }

    previewRight() {
        console.log("preview right")
    }

    previewTop() {
        console.log("preview top")
    }
}