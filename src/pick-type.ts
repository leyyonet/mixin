import {$assert, $descriptor, $dev, Arr, ClassLike, Func} from "@leyyo/common";
import {DecoKind, fqnHandler, nameHandler, reflectionPool} from "@leyyo/core";
import {FQN} from "./internal";

let counter = 0;
export function PickType<T, K extends keyof T>(clazz: ClassLike<T>, pickedKeys: readonly K[]): ClassLike<Pick<T, (typeof pickedKeys)[number]>> {
    $assert.func(clazz, () => $dev.opt({field: 'clazz', where: `${FQN}.PickType`}));
    $assert.textArray(pickedKeys, () => $dev.opt({field: 'pickedKeys', where: `${FQN}.PickType`}));

    const newClass = class extends (clazz as ClassLike) {
        constructor(...args: Arr) {
            super(...args);
            Object.getOwnPropertyNames(clazz.prototype).forEach(key => {
                if (!pickedKeys.includes(key as K)) {
                    const desc = $descriptor.get(newClass.prototype, key);
                    if (desc) {
                        delete this[key];
                    }
                }
            });
        }
    }
    let pck = fqnHandler.$secure.$getPackage(clazz);
    if (!pck) {
        pck = FQN;
    }
    const name = nameHandler.anonymous('Pick', counter);
    nameHandler.set(newClass, name);
    fqnHandler.clazz(newClass, pck);

    reflectionPool.registerClass(newClass, undefined, ref => {
        Object.getOwnPropertyNames(newClass.prototype).forEach(key => {
            if (pickedKeys.includes(key as K)) {
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
            }
        });

    });

    counter++;
    return newClass as ClassLike<Pick<T, (typeof pickedKeys)[number]>>;
}
fqnHandler.func(PickType, FQN);
