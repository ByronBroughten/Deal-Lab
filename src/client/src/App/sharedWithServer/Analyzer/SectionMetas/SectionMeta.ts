import { Obj } from "../../utils/Obj";
import { DbVarbs } from "../DbEntry";
import { ChildIdArrs, ChildName } from "./relNameArrs/ChildTypes";
import { SectionToParentArrs } from "./relNameArrs/ParentTypes";
import { RelSections } from "./relSections";
import {
  BaseSections,
  ContextName,
  SimpleSectionName,
} from "./relSections/baseSections";
import { VarbMetas } from "./VarbMetas";

export type SectionMetaCore<
  CN extends ContextName,
  SN extends SimpleSectionName
> = RelSections[CN][SN & keyof RelSections[CN]] &
  BaseSections[CN][SN] & {
    varbMetas: VarbMetas;
    parents: SectionToParentArrs<CN>[SN];
  };

export class NextSectionMeta<
  CN extends ContextName,
  SN extends SimpleSectionName
> {
  constructor(readonly core: SectionMetaCore<CN, SN>) {}
  get<PN extends keyof SectionMetaCore<CN, SN>>(
    propName: PN
  ): SectionMetaCore<CN, SN>[PN] {
    return this.core[propName];
  }
  get props() {
    return this.core;
  }
  emptyChildIds(): ChildIdArrs<SN, CN> {
    return (this.get("childNames") as ChildName<SN, CN>[]).reduce(
      (childIds, childName) => {
        childIds[childName] = [];
        return childIds;
      },
      {} as ChildIdArrs<SN, CN>
    );
  }
  defaultDbVarbs(): DbVarbs {
    type Test = SectionMetaCore<CN, SN>["alwaysOne"];
    const defaultDbVarbs: DbVarbs = {};
    const varbMetasCore = this.get("varbMetas").getCore();
    for (const [varbName, varbMeta] of Obj.entries(varbMetasCore)) {
      defaultDbVarbs[varbName] = varbMeta.get("dbInitValue");
    }
    return defaultDbVarbs;
  }
  depreciatingUpdateVarbMetas(nextVarbMetas: VarbMetas) {
    const nextCore = { ...this.core };
    nextCore.varbMetas = nextVarbMetas;
    return new NextSectionMeta(nextCore);
  }
}
