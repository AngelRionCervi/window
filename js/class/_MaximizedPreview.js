import { DomBuilder } from "../utils/DomBuilder.js";
const dob = new DomBuilder();

export default class _MaximizedPreview {
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
