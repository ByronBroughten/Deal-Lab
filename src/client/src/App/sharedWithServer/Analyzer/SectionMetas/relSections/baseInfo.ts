import { UnionToIntersection } from "../../../utils/types";
import { BaseName } from "./BaseName";
import { BaseNameArrs } from "./baseNameArrs";
import { SectionContext } from "./baseSections";

type Relatives = {
  inVarb: "children" | "local" | "static" | "all";
  outVarb: "parent" | "local" | "static" | "all";
  focal: "static" | "local" | "parent";
  multi: "children" | "all";
  alwaysOne: "static";
  local: "local";
  children: "children";
};
type RelType = keyof Relatives;
export type Relative<T extends RelType = RelType> = Relatives[T];

export type InfoIds = {
  dbId: string;
  feId: string;
  relId: Relative;
};
export type InfoIdName = keyof InfoIds;

type Shared = {
  rel: {
    [Prop in RelType as `rel${Capitalize<string & Prop>}`]: {
      idType: "relId";
      id: Relatives[Prop];
    };
  };
  id: {
    [Prop in keyof InfoIds]: {
      idType: Prop;
      id: InfoIds[Prop];
    };
  };
};
type BaseInfoSetsShared = UnionToIntersection<Shared[keyof Shared]>;
type SectionNameProps = {
  [C in keyof BaseNameArrs]: {
    [SNT in keyof BaseNameArrs[C]]: {
      sectionName: BaseNameArrs[C][SNT][number & keyof BaseNameArrs[C][SNT]];
    };
  };
};
export type BaseInfoSets = {
  [C in keyof SectionNameProps]: BaseInfoSetsShared &
    SectionNameProps[C] & {
      snRelAlwaysOne: BaseInfoSetsShared["relAlwaysOne"] &
        SectionNameProps[C]["alwaysOne"];
    };
};
type GeneralInfo = {
  [Prop in keyof InfoIds]: { idType: Prop; id: InfoIds[Prop] };
} & { sectionName: BaseName };
export type BaseInfo<
  K extends keyof BaseInfoSets[C] = "all",
  C extends SectionContext = "fe"
> = GeneralInfo & UnionToIntersection<BaseInfoSets[C][K]>;
function _BaseInfoTest(info: BaseInfo<"snRelAlwaysOne" | "propertyGeneral">) {
  // I get an info whose idType I don't know
  if (info.idType === "relId") {
    info.id;
    if (info.sectionName === "propertyGeneral") {
      info.sectionName;
    }
  }
}
