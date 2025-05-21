import {$assert, $descriptor, $dev, ClassLike, Func} from "@leyyo/common";
import {DecoKind, fqnHandler, nameHandler, reflectionPool} from "@leyyo/core";
import {FQN} from "./internal";

let counter = 0;
export function MergeType<T1, T2>(
    clazz1: ClassLike<T1>,
    clazz2: ClassLike<T2>): ClassLike<T1 & T2> {
    $assert.func(clazz1, () => $dev.opt({field: 'clazz1', where: `${FQN}.MergeType`}));
    $assert.func(clazz2, () => $dev.opt({field: 'clazz2', where: `${FQN}.MergeType`}));

    const newClass = class extends (clazz1 as ClassLike) {
    }
    let pck = fqnHandler.$secure.$getPackage(clazz1);
    if (!pck) {
        pck = 'todo';
    }
    const name = nameHandler.anonymous('Merge', counter);
    nameHandler.set(newClass, name);
    fqnHandler.clazz(newClass, pck);

    reflectionPool.registerClass(newClass, undefined, ref => {
        const keys = [] as Array<string>;
        Object.getOwnPropertyNames(newClass.prototype).forEach(key => {
            keys.push(key);
            const desc = $descriptor.get(newClass.prototype, key);
            if (desc) {
                let kind: DecoKind;
                let callable: Func;
                if (typeof desc.value === 'function') {
                    kind = 'method';
                    callable = desc.value;
                } else {
                    kind = 'field';
                    callable = undefined;
                }
                ref.$secure.$registerProperty(key, 'instance', kind, callable, true);
            }
        });
        Object.getOwnPropertyNames(clazz2.prototype).forEach(key => {
            if (!keys.includes(key)) {
                const desc = $descriptor.get(clazz2.prototype, key);
                if (desc) {
                    let kind: DecoKind;
                    let callable: Func;
                    if (typeof desc.value === 'function') {
                        kind = 'method';
                        callable = desc.value;
                    } else {
                        kind = 'field';
                        callable = undefined;
                    }
                    ref.$secure.$registerProperty(key, 'instance', kind, callable, true);
                }
            }
        });
    });

    counter++;
    return newClass as ClassLike<T1 & T2>;
}
fqnHandler.func(MergeType, FQN);
