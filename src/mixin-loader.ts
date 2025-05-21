import {Loader} from "@leyyo/injection";
import {Fqn} from "@leyyo/core";
import {MergeType} from "./merge-type";
import {OmitType} from "./omit-type";
import {PartialType} from "./partial-type";
import {PickType} from "./pick-type";
import {FQN} from "./internal";

@Loader(MergeType, OmitType, PartialType, PickType)
@Fqn(FQN)
export class MixinLoader {}
