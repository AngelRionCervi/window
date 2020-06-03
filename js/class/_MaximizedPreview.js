import { DomBuilder } from "../utils/DomBuilder.js";
const dob = new DomBuilder();

export class _MaximizedPreview {
    constructor() {
        this.previewingSide = null;
        this.previewEl = null;
        this.previewStyle = {
            position: "absolute",
            boxShadow: "inset 0px 0px 0px 10px #f00",
        };
    }

    createPreviewNode() {
        return dob.createNode("div", "win2-max-preview").addInlineStyle(this.previewStyle).done();
    }

    preview(side, zIndex) {
        if (!side) {
            this.removePreview();
            return;
        }
        if (side === this.previewingSide) return;
        this.previewingSide = side;
        this.previewEl = this.createPreviewNode();
        this[`preview${side.charAt(0).toUpperCase() + side.slice(1)}`](zIndex);
    }

    previewLeft(zIndex) {
        this.previewEl.style.left = 0;
        this.previewEl.style.top = 0;
        this.previewEl.style.width = window.innerWidth / 2 + "px";
        this.previewEl.style.height = window.innerHeight + "px";
        this.previewEl.style.zIndex = zIndex - 1;
        document.body.appendChild(this.previewEl);
        console.log("preview left");
    }

    previewRight(zIndex) {
        this.previewEl.style.right = 0;
        this.previewEl.style.top = 0;
        this.previewEl.style.width = window.innerWidth / 2 + "px";
        this.previewEl.style.height = window.innerHeight + "px";
        this.previewEl.style.zIndex = zIndex - 1;
        document.body.appendChild(this.previewEl);
        console.log("preview right");
    }

    previewTop(zIndex) {
        this.previewEl.style.right = 0;
        this.previewEl.style.top = 0;
        this.previewEl.style.width = window.innerWidth + "px";
        this.previewEl.style.height = window.innerHeight + "px";
        this.previewEl.style.zIndex = zIndex - 1;
        document.body.appendChild(this.previewEl);
        console.log("preview top");
    }

    removePreview() {
        if (!this.previewEl) return;
        this.previewEl.remove();
        this.previewingSide = null;
    }
}
