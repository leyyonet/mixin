import {$assert, $descriptor, $dev, $name, Arr, ClassLike} from "@leyyo/common";
import {fqnHandler, reflectionPool} from "@leyyo/core";

import {FQN} from "./internal";

export function PickType<T, K extends keyof T>(source: ClassLike<T>, pickedKeys: readonly K[]): ClassLike<Pick<T, (typeof pickedKeys)[number]>> {
    $assert.func(source, () => $dev.opt({field: 'source', where: `${FQN}.PickType`}));
    $assert.textArray(pickedKeys, () => $dev.opt({field: 'pickedKeys', where: `${FQN}.PickType`}));

    const clazz = class extends (source as ClassLike) {
        constructor(...args: Arr) {
            super(...args);
            Object.getOwnPropertyNames(source.prototype).forEach(key => {
                if ( !pickedKeys.includes(key as K)) {
                    const desc = $descriptor.get(clazz.prototype, key);
                    if (desc) {
                        delete this[key];
                    }
                }
            });
        }
    }
    let {pck} = fqnHandler.$secure.$get(source);
    if ( !pck) {
        pck = FQN;
    }
    const name = $name.anonymous(source.name);
    $name.set(clazz, name);
    fqnHandler.clazz(clazz, pck);
    const classRef = reflectionPool.registerClass(clazz);

    classRef.listInstancePropertyNames().forEach(key => {
        if ( !pickedKeys.includes(key as K)) {
            classRef.$secure.$deleteProperty(key, 'instance');
        }
    });

    return clazz as ClassLike<Pick<T, (typeof pickedKeys)[number]>>;
}

fqnHandler.func(PickType, FQN);
