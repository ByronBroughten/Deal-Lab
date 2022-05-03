import { relNameArrs } from "../relNameArrs";
import { RelSections } from "../relSections";

type HasDefaultStoreName = typeof relNameArrs.fe.hasDefaultStore[number];

export type DefaultStoreName<
  S extends HasDefaultStoreName = HasDefaultStoreName
> = RelSections["fe"][S]["defaultStoreName"];
