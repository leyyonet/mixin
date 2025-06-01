import {$assert, $dev, $name, ClassLike} from "@leyyo/common";
import {fqnHandler, reflectionPool} from "@leyyo/core";

import {FQN} from "./internal";

export function PartialType<T>(source: ClassLike<T>): ClassLike<Partial<T>> {
    $assert.func(source, () => $dev.opt({field: 'source', where: `${FQN}.PartialType`}));

    const clazz = class extends (source as ClassLike) {
    }
    let {pck} = fqnHandler.$secure.$get(clazz);
    if ( !pck) {
        pck = FQN;
    }
    const name = $name.anonymous(source.name);
    $name.set(clazz, name);
    fqnHandler.clazz(clazz, pck);

    reflectionPool.registerClass(clazz);

    return clazz as ClassLike<Partial<T>>;
}

fqnHandler.func(PartialType, FQN)
