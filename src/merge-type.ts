import {$assert, $dev, $name, ClassLike} from "@leyyo/common";
import {fqnHandler, reflectionPool} from "@leyyo/core";

import {FQN} from "./internal";

export function MergeType<T1, T2>(
    clazz1: ClassLike<T1>,
    clazz2: ClassLike<T2>): ClassLike<T1 & T2> {

    $assert.func(clazz1, () => $dev.opt({field: 'clazz1', where: `${FQN}.MergeType`}));
    $assert.func(clazz2, () => $dev.opt({field: 'clazz2', where: `${FQN}.MergeType`}));

    const clazz = class extends (clazz1 as ClassLike) {
    }

    let {pck} = fqnHandler.$secure.$get(clazz1);
    if ( !pck) {
        let {pck: pck2} = fqnHandler.$secure.$get(clazz2);
        if ( !pck2) {
            pck = FQN;
        }
        else {
            pck = pck2;
        }
    }
    const name = $name.anonymous('Merge');
    $name.set(clazz, name);
    fqnHandler.clazz(clazz, pck);

    const classRef = reflectionPool.registerClass(clazz);

    const instanceKeys = classRef.listInstancePropertyNames();
    const staticKeys = classRef.listStaticPropertyNames();
    let childRef = reflectionPool.get(clazz2);
    if ( !childRef) {
        childRef = reflectionPool.registerClass(clazz2);
    }
    classRef.$secure.$copyInstanceProperties(childRef, 'omit', instanceKeys);
    classRef.$secure.$copyStaticProperties(childRef, 'omit', staticKeys);

    classRef.copyDecorators(reflectionPool.get(clazz2));

    return clazz as ClassLike<T1 & T2>;
}

fqnHandler.func(MergeType, FQN);
