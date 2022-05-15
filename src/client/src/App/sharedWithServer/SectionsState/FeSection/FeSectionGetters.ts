import { cloneDeep } from "lodash";
import { GConstructor } from "../../../utils/classObjects";
import { SectionInfoGettersI } from "../../FeSections/HasSectionInfoProps";
import { FeParentInfo } from "../../SectionsMeta/Info";
import { DbNameInfo } from "../../SectionsMeta/relSections/rel/relVarbInfoTypes";
import { ParentFeInfo } from "../../SectionsMeta/relSectionTypes/ParentTypes";
import { SectionName, sectionNameS } from "../../SectionsMeta/SectionName";
import { FeSectionCore } from "./FeSectionCore";
import { FeVarbsI } from "./FeVarbs";
import { HasFeSectionProps } from "./HasFeSectionProps";

export interface FeSectionGettersI<SN extends SectionName>
  extends RequiredMixins<SN> {
  get dbId(): string;
  get dbInfo(): DbNameInfo<SN>;
  get coreClone(): FeSectionCore<SN>;
  get parentFeId(): string;
  get parentInfo(): ParentFeInfo<SN>;
  get feParentInfo(): FeParentInfo<SN>;
  get parentInfoSafe(): ParentFeInfo<SectionName<"hasParent">>;
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
    get parentInfo(): ParentFeInfo<SN> {
      return this.core.parentInfo;
    }
    get feParentInfo(): FeParentInfo<SN> {
      return {
        feId: this.core.parentInfo.id,
        sectionName: this.core.parentInfo.sectionName,
      };
    }
    get parentInfoSafe(): ParentFeInfo<SectionName<"hasParent">> {
      const { parentInfo } = this.core;
      if (
        !sectionNameS.is(this.sectionName, "hasParent") ||
        parentInfo.sectionName === "no parent"
      )
        throw new Error("This section doesn't have a parent.");
      return parentInfo as ParentFeInfo<SectionName<"hasParent">>;
    }
    get varbs(): FeVarbsI<SN> {
      return this.core.varbs;
    }
  };
}