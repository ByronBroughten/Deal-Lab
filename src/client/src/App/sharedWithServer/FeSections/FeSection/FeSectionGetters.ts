import { cloneDeep } from "lodash";
import { GConstructor } from "../../../utils/classObjects";
import { DbNameInfo } from "../../SectionMetas/relSections/rel/relVarbInfoTypes";
import { FeParentInfo } from "../../SectionMetas/relSectionTypes/ParentTypes";
import { SectionName, sectionNameS } from "../../SectionMetas/SectionName";
import { SectionInfoGettersI } from "../HasSectionInfoProps";
import { FeSectionCore } from "./FeSectionCore";
import { FeVarbsI } from "./FeVarbs";
import { HasFeSectionProps } from "./HasFeSectionProps";

export interface FeSectionGettersI<SN extends SectionName>
  extends RequiredMixins<SN> {
  get dbId(): string;
  get dbInfo(): DbNameInfo<SN>;
  get coreClone(): FeSectionCore<SN>;
  get parentFeId(): string;
  get parentInfo(): FeParentInfo<SN>;
  get parentInfoSafe(): FeParentInfo<SectionName<"hasParent">>;
  get varbs(): FeVarbsI<SN>;
}

interface RequiredMixins<SN extends SectionName>
  extends HasFeSectionProps<SN>,
    SectionInfoGettersI<SN> {}

export function ApplySectionGetters<
  SN extends SectionName,
  TBase extends GConstructor<RequiredMixins<SN>>
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
      return this.core.parentInfo.id;
    }
    get parentInfo(): FeParentInfo<SN> {
      return this.core.parentInfo;
    }
    get parentInfoSafe(): FeParentInfo<SectionName<"hasParent">> {
      const { parentInfo } = this.core;
      if (
        !sectionNameS.is(this.sectionName, "hasParent") ||
        parentInfo.sectionName === "no parent"
      )
        throw new Error("This section doesn't have a parent.");
      return parentInfo as FeParentInfo<SectionName<"hasParent">>;
    }
    get varbs(): FeVarbsI<SN> {
      return this.core.varbs;
    }
  };
}
