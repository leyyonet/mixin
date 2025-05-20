import {$descriptor, Arr, ClassLike} from "@leyyo/common";
import {fqnHandler, nameHandler, proxyHandler, reflectionPool} from "@leyyo/core";

let counter = 0;
export function MergeType<T1, T2>(
    clazz1: ClassLike<T1>,
    clazz2: ClassLike<T2>): ClassLike<T1 & T2> {

    const newClass = class extends (clazz1 as ClassLike) {
    }
    let pck = fqnHandler.$secure.$getPackage(clazz1);
    if (!pck) {
        pck = 'todo';
    }
    const name = `Merge$${counter}`;
    nameHandler.set(newClass, name);
    fqnHandler.clazz(newClass, pck);

    reflectionPool.registerClass(newClass);

    counter++;
    return newClass as ClassLike<T1 & T2>;
}
