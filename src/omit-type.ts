import {$assert, $descriptor, $dev, Arr, ClassLike, Func} from "@leyyo/common";
import {DecoKind, fqnHandler, nameHandler, reflectionPool} from "@leyyo/core";
import {FQN} from "./internal";

let counter = 0;
export function OmitType<T, K extends keyof T>(
    clazz: ClassLike<T>,
    omittedKeys: readonly K[]
): ClassLike<Omit<T, (typeof omittedKeys)[number]>> {
    $assert.func(clazz, () => $dev.opt({field: 'clazz', where: `${FQN}.OmitType`}));
    $assert.textArray(omittedKeys, () => $dev.opt({field: 'omittedKeys', where: `${FQN}.OmitType`}));

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
        pck = FQN;
    }
    const name = nameHandler.anonymous('Omit', counter);
    nameHandler.set(newClass, name);
    fqnHandler.clazz(newClass, pck);

    reflectionPool.registerClass(newClass, undefined, ref => {
        Object.getOwnPropertyNames(newClass.prototype).forEach(key => {
            if (!omittedKeys.includes(key as K)) {
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
    return newClass as ClassLike<Omit<T, (typeof omittedKeys)[number]>>;
}
fqnHandler.func(OmitType, FQN);
