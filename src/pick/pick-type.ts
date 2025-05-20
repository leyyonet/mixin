import {$descriptor, Arr, ClassLike} from "@leyyo/common";
import {fqnHandler, nameHandler, proxyHandler, reflectionPool} from "@leyyo/core";

let counter = 0;
export function PickType<T, K extends keyof T>(
    clazz: ClassLike<T>,
    pickedKeys: readonly K[]
): ClassLike<Pick<T, (typeof pickedKeys)[number]>> {

    const newClass = class extends (clazz as ClassLike) {
        constructor(...args: Arr) {
            super(...args);
            pickedKeys.forEach(key => {
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
    const name = `Pick$${counter}`;
    nameHandler.set(newClass, name);
    fqnHandler.clazz(newClass, pck);

    reflectionPool.registerClass(newClass);

    counter++;
    return newClass as ClassLike<Pick<T, (typeof pickedKeys)[number]>>;
}
