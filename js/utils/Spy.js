export function binder(obj, methods, callbacks, callOriginal = false, callOriginalFirst = false) {
    const meths = [methods].flat();
    const cbs = [callbacks].flat();
    for (const meth of meths) {
        const og = obj[meth];
        obj[meth] = function () {
            const args = [].slice.apply(arguments);
            if (callOriginal && callOriginalFirst) {
                og.call(obj, ...args);
                cbs.forEach((cb) => cb(...args));
            } else {
                cbs.forEach((cb) => cb(...args));
                if (callOriginal) og.call(obj, ...args);
            }
        };
    }
}
