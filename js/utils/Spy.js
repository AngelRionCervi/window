export function spy(obj, methods, callback) {
    const meths = [methods].flat();
    const Spy = {
        args: [],
        count: 0,
    };

    for (const meth of meths) {
        const original = obj[meth];
        obj[meth] = function () {
            let args = [].slice.apply(arguments);
            if (Spy.args.length >= 50) Spy.args.pop();
            Spy.count++;
            Spy.args.unshift(args);
            original.call(obj, ...args);
            callback(...args);
        };
    }

    return Spy;
}

export function binder(obj, methods, callbacks, callOriginal = false) {
    const meths = [methods].flat();
    const cbs = [callbacks].flat();

    for (const meth of meths) {
        const og = obj[meth];
        obj[meth] = function () {
            const args = [].slice.apply(arguments);
            cbs.forEach((cb) => cb(...args));
            if (callOriginal) og.call(obj, ...args);
        };
    }
}
