import {$assert, $dev, $name, Arr, ClassLike} from "@leyyo/common";
import {fqnHandler, reflectionPool} from "@leyyo/core";

import {FQN} from "./internal";

export function OmitType<T, K extends keyof T>(
    source: ClassLike<T>,
    omittedKeys: readonly K[]
): ClassLike<Omit<T, (typeof omittedKeys)[number]>> {
    $assert.func(source, () => $dev.opt({field: 'source', where: `${FQN}.OmitType`}));
    $assert.textArray(omittedKeys, () => $dev.opt({field: 'omittedKeys', where: `${FQN}.OmitType`}));

    const clazz = class extends (source as ClassLike) {
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
    let {pck} = fqnHandler.$secure.$get(source);
    if (!pck) {
        pck = FQN;
    }
    const name = $name.anonymous(source.name);
    $name.set(clazz, name);
    fqnHandler.clazz(clazz, pck);


    const classRef = reflectionPool.registerClass(clazz);

    classRef.listInstancePropertyNames().forEach(key => {
        if ( omittedKeys.includes(key as K)) {
            classRef.$secure.$deleteProperty(key, 'instance');
        }
    });

    return clazz as ClassLike<Omit<T, (typeof omittedKeys)[number]>>;
}
fqnHandler.func(OmitType, FQN);
