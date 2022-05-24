import { GConstructor } from "../../utils/classObjects";
import { sectionMetas } from "../SectionsMeta";
import { FeIdInfo } from "../SectionsMeta/baseSections/id";
import { FeSectionInfo } from "../SectionsMeta/Info";
import { FeNameInfo } from "../SectionsMeta/relSections/rel/relVarbInfoTypes";
import { SectionMeta } from "../SectionsMeta/SectionMeta";
import { SectionName } from "../SectionsMeta/SectionName";
import { HasSectionNameProp } from "./HasSectionNameProp";

export interface SectionInfoGettersI<SN extends SectionName>
  extends HasSectionInfoProps<SN> {
  get feIdInfo(): FeIdInfo;
  get feInfo(): FeNameInfo<SN>;
  get info(): FeSectionInfo<SN>;
  get meta(): SectionMeta<"fe", SN>;
  sectionMeta<S extends SectionName>(sectionName: S): SectionMeta<"fe", S>;
}

export function ApplySectionInfoGetters<
  SN extends SectionName,
  TBase extends GConstructor<HasSectionInfoProps<SN>>
>(Base: TBase): GConstructor<SectionInfoGettersI<SN>> & TBase {
  return class SectionInfoGetters
    extends Base
    implements SectionInfoGettersI<SN>
  {
    get feIdInfo(): FeIdInfo {
      return {
        id: this.feId,
        idType: "feId",
      };
    }
    get feInfo(): FeNameInfo<SN> {
      return {
        sectionName: this.sectionName,
        ...this.feIdInfo,
      };
    }
    get info(): FeSectionInfo<SN> {
      return {
        feId: this.feId,
        sectionName: this.sectionName,
      };
    }
    get meta(): SectionMeta<"fe", SN> {
      return this.sectionMeta(this.sectionName);
    }
    sectionMeta<S extends SectionName>(sectionName: S): SectionMeta<"fe", S> {
      return sectionMetas.section(sectionName, "fe");
    }
  };
}

export class HasSectionInfoProps<
  SN extends SectionName
> extends HasSectionNameProp<SN> {
  readonly feSectionInfo: FeSectionInfo<SN>;
  constructor({ sectionName, feId }: FeSectionInfo<SN>) {
    super(sectionName);
    this.feSectionInfo = { sectionName, feId };
  }
  get feId(): string {
    return this.feSectionInfo.feId;
  }
}
