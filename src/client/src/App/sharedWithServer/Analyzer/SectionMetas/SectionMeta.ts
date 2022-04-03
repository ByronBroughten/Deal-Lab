import { Obj } from "../../utils/Obj";
import { DbVarbs } from "../SectionPack/RawSection";
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
  get<PN extends keyof SectionMetaCore<CN, SN>>(propName: PN) {
    return this.core[propName];
  }
  defaultDbVarbs(): DbVarbs {
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
