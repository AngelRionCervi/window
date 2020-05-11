export class DomBuilder {
    createNode(type, _class = null, id = null, inner = null, listener = null, customAttr = null) {
        let el = document.createElement(type);

        if (_class) {
            this.addClasses(el, _class);
        }

        if (id) {
            el.id = id;
        }

        if (inner) {
            inner = [inner].flat();
            inner.forEach((content) => {
                switch (typeof content) {
                    case "string":
                        el.innerText = content;
                        break;
                    case "number":
                        el.innerText = content.toString();
                        break;
                    case "object":
                        el.appendChild(content);
                        break;
                }
            });
        }

        if (listener) {
            if (Array.isArray(listener)) {
                listener.forEach((l) => {
                    this.createListener(el, l);
                });
            } else {
                this.createListener(el, listener);
            }
        }

        if (customAttr) {
            this.addCustomAttr(el, customAttr);
        }

        return el;
    }

    addClasses(el, _class) {
        _class = [_class].flat();
        _class.forEach((c) => {
            el.classList.add(...c.split(" "));
        });
    }

    addCustomAttr(el, customAttr) {
        customAttr = [customAttr].flat();
        customAttr.forEach((attr) => {
            el.setAttribute(attr.type, attr.val);
        });
    }

    createListener(el, l) {
        if (!l.hasOwnProperty("args")) l.args = [];
        el.addEventListener(l.type, (e) => {
            e.preventDefault();
            if (l.hasOwnProperty("event") && !l.event) {
                l.callback(...l.args);
            } else {
                l.callback(e, ...l.args);
            }
            return false;
        });
    }

    enclose(nodes, _class = null, tag = "div", listener = null, customAttrIn = null) {
        const container = document.createElement(tag);
        if (customAttrIn) {
            nodes.forEach((node) => {
                this.addCustomAttr(node, customAttrIn);
            })
        }
        for (const node of nodes) container.appendChild(node);
        if (_class) this.addClasses(container, _class);
        if (listener) {
            const listeners = [listener].flat();
            listeners.forEach((l) => {
                this.createListener(container, l);
            });
        }
        
        return container;
    }
}
