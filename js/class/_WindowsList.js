import { spy, binder } from "../utils/Spy.js";

class _WindowList {
    constructor() {
        this.list = [];
        document.addEventListener("mousemove", this.targetDrag.bind(this));
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

    add(win) {
        binder(win, "removeEl", this.removeOfList.bind(this, win.getID()), true);
        binder(win, "focus", this.changeFocus.bind(this, win.getID()), true);
        win.create();
        this.list.push(win);
    }

    removeOfList(id) {
        this.list.splice(this.list.map(el => el.getID()).indexOf(id), 1);
    }

    targetDrag(e) {
        const win = this.getSelectedWin();
        if (win) win.drag(e);
    }

    changeFocus(id) {
        const win = this.getWinByID(id);
        const otherWins = this.getAllExceptID(id);
        win.getEl().style.zIndex = 0;
        otherWins.map((w) => (w.getEl().style.zIndex -= 1));
    }
}

export default new _WindowList();
