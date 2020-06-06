import { binder } from "../utils/Spy.js";
import _MaximizedPreview  from "./_MaximizedPreview.js";
import _Window from "./_Window.js";

class _WindowList {
    constructor() {
        this.list = [];
        this.focusedID = null;
        this.startingZI = 5;
        this.maxPreview = new _MaximizedPreview();
        document.addEventListener("mousemove", this.targetDrag.bind(this));
        document.addEventListener("mouseup", this.deselect.bind(this));
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

    add(options) {
        const win = new _Window(options);
        binder(win, "removeEl", () => this.removeOfList(win.getID()), true);
        binder(win, "focus", () => this.changeFocus(win.getID()), true);
        binder(win, "checkMaximize", () => this.maxPreview.preview(win.getMaximizeSide(), win.getZindex()), true, true);
        binder(win, "release", () => this.maxPreview.removePreview(), true);
        win.create();
        win.getEl()
        this.list.push(win);
        this.initZindex(win.getID());
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

        otherWins.forEach((win, listIndex, wins) => { // loopy loop
            const el = win.getEl();
            const zIndex = Number(el.style.zIndex);
            if (zIndex === totalZI - 1) { // look mom im high
                for (let u = listIndex; u < wins.length - listIndex; u++) {
                    const restEl = wins[u].getEl();
                    const restZindex = Number(restEl.style.zIndex);
                    if (u > 0 && Number(wins[u - 1].getEl().style.zIndex) - restZindex > 0) break; // gap is > 0 we stop -1 the other zIndexes
                    restEl.style.zIndex = restZindex - 1; // go down >:(
                }
            }
        });
        //console.log(this.list.map((el) => el.getEl().style.zIndex));
    }

    initZindex(id) {
        const win = this.getWinByID(id);
        win.getEl().style.zIndex = this.list.length + this.startingZI;
        //console.log(this.list.map((el) => el.getEl().style.zIndex));
    }

}

export default new _WindowList();
