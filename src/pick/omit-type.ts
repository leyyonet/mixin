import {$descriptor, Arr, ClassLike} from "@leyyo/common";
import {fqnHandler, nameHandler, proxyHandler, reflectionPool} from "@leyyo/core";

let counter = 0;
export function OmitType<T, K extends keyof T>(
    clazz: ClassLike<T>,
    omittedKeys: readonly K[]
): ClassLike<Omit<T, (typeof omittedKeys)[number]>> {

    const newClass = class extends (clazz as ClassLike) {
        constructor(...args: Arr) {
            super(...args);
            omittedKeys.forEach(key => {
                const k = key as keyof ClassLike;
                if (this[k] !== undefined) {
                    delete this[k];
                }
            })
        }
    }
    let pck = fqnHandler.$secure.$getPackage(clazz);
    if (!pck) {
        pck = 'todo';
    }
    const name = `Omit$${counter}`;
    nameHandler.set(newClass, name);
    fqnHandler.clazz(newClass, pck);

    reflectionPool.registerClass(newClass);

    counter++;
    return newClass as ClassLike<Omit<T, (typeof omittedKeys)[number]>>;
}
