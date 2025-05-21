import {$assert, $descriptor, $dev, Arr, ClassLike, Func} from "@leyyo/common";
import {DecoKind, fqnHandler, nameHandler, reflectionPool} from "@leyyo/core";
import {FQN} from "./internal";

let counter = 0;
export function PartialType<T>(clazz: ClassLike<T>): ClassLike<Partial<T>> {
    $assert.func(clazz, () => $dev.opt({field: 'clazz', where: `${FQN}.PartialType`}));

    const newClass = class extends (clazz as ClassLike) {
    }
    let pck = fqnHandler.$secure.$getPackage(clazz);
    if (!pck) {
        pck = FQN;
    }
    const name = nameHandler.anonymous('Partial', counter);
    nameHandler.set(newClass, name);
    fqnHandler.clazz(newClass, pck);

    reflectionPool.registerClass(newClass, undefined, ref => {
        Object.getOwnPropertyNames(newClass.prototype).forEach(key => {
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
    });

    counter++;
    return newClass as ClassLike<Partial<T>>;
}
fqnHandler.func(PartialType, FQN)
