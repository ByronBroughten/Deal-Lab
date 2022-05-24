import { cloneDeep } from "lodash";
import { GConstructor } from "../../../utils/classObjects";
import { SectionInfoGettersI } from "../../HasInfoProps/HasSectionInfoProps";
import { FeParentInfo } from "../../SectionsMeta/Info";
import { DbNameInfo } from "../../SectionsMeta/relSections/rel/relVarbInfoTypes";
import { SectionName, sectionNameS } from "../../SectionsMeta/SectionName";
import { FeSectionCore } from "./FeSectionCore";
import FeVarb from "./FeVarb";
import { FeVarbsI } from "./FeVarbs";
import { HasFeSectionProps } from "./HasFeSectionProps";

export interface FeSectionGettersI<SN extends SectionName>
  extends FeSectionGettersMixins<SN> {
  get dbId(): string;
  get dbInfo(): DbNameInfo<SN>;
  get coreClone(): FeSectionCore<SN>;
  get parentFeId(): string;
  get parentInfo(): FeParentInfo<SN>;
  get feParentInfo(): FeParentInfo<SN>;
  get parentInfoSafe(): FeParentInfo<SN & SectionName<"hasParent">>;
  get varbs(): FeVarbsI<SN>;
  varb(varbName: string): FeVarb<SN & SectionName<"hasVarb">>;
}

interface FeSectionGettersMixins<SN extends SectionName>
  extends HasFeSectionProps<SN>,
    SectionInfoGettersI<SN> {}

export function ApplySectionGetters<
  SN extends SectionName,
  TBase extends GConstructor<FeSectionGettersMixins<SN>>
>(Base: TBase) {
  return class FeSectionGetters extends Base implements FeSectionGettersI<SN> {
    get dbId(): string {
      return this.core.dbId;
    }
    get dbInfo(): DbNameInfo<SN> {
      return {
        sectionName: this.sectionName,
        id: this.dbId,
        idType: "dbId",
      };
    }
    get coreClone() {
      return cloneDeep(this.core);
    }
    get parentFeId(): string {
      return this.core.parentInfo.feId;
    }
    get parentInfo(): FeParentInfo<SN> {
      return this.core.parentInfo;
    }
    get feParentInfo(): FeParentInfo<SN> {
      return {
        feId: this.core.parentInfo.feId,
        sectionName: this.core.parentInfo.sectionName,
      };
    }
    get parentInfoSafe(): FeParentInfo<SN & SectionName<"hasParent">> {
      const { parentInfo } = this.core;
      if (
        !sectionNameS.is(this.sectionName, "hasParent") ||
        parentInfo.sectionName === "no parent"
      )
        throw new Error("This section doesn't have a parent.");
      return parentInfo as FeParentInfo<SN & SectionName<"hasParent">>;
    }

    get varbs(): FeVarbsI<SN> {
      return this.core.varbs;
    }
    varb(varbName: string): FeVarb<SN & SectionName<"hasVarb">> {
      return this.varbs.one(varbName);
    }
  };
}
