import {$descriptor, Arr, ClassLike} from "@leyyo/common";
import {fqnHandler, nameHandler, proxyHandler, reflectionPool} from "@leyyo/core";

let counter = 0;
export function Partial<T>(clazz: ClassLike<T>): ClassLike<Partial<T>> {

    const newClass = class extends (clazz as ClassLike) {
        constructor(...args: Arr) {
            super(...args);
        }
    }
    let pck = fqnHandler.$secure.$getPackage(clazz);
    if (!pck) {
        pck = 'todo';
    }
    const name = `Partial$${counter}`;
    nameHandler.set(newClass, name);
    fqnHandler.clazz(newClass, pck);

    reflectionPool.registerClass(newClass);

    counter++;
    return newClass as ClassLike<Partial<T>>;
}
