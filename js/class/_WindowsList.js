import { spy, binder } from "../utils/Spy.js";

class _WindowList {
    constructor() {
        this.list = [];
        this.focusedID = null;
        document.addEventListener("mousemove", this.targetDrag.bind(this));
        document.addEventListener("mouseup", this.stopResize.bind(this));
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

    add(win) {
        binder(win, "removeEl", this.removeOfList.bind(this, win.getID()), true);
        binder(win, "focus", this.changeFocus.bind(this, win.getID()), true);
        win.create();
        this.list.push(win);
        this.changeFocus(win.getID());
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

    stopResize() {
        this.list.map((el) => el.borderLeave());
    }

    changeFocus(id) {
        if (this.focusedID === id) return;
        this.focusedID = id;
        const win = this.getWinByID(id);
        win.getEl().style.zIndex = 0;
        this.list
            .sort((a, b) => a.getEl().style.zIndex + b.getEl().style.zIndex)
            .forEach((win, index, wins) => {
                const el = win.getEl();
                let newZI = Number(el.style.zIndex) - 1;
                if (index > 0) {
                    const lastWinEl = wins[index - 1].getEl();
                    const lastZI = Number(lastWinEl.style.zIndex);
                    if (newZI - lastZI > 1) {
                        newZI = (newZI - lastZI) * -1;
                        lastWinEl.style.zIndex = newZI - 1;
                    }
                }
                el.style.zIndex = newZI;
            });
        console.log(this.list.map((el) => el.getEl().style.zIndex));
    }
}

export default new _WindowList();
