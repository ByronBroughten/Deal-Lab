import { GConstructor } from "../../utils/classObjects";
import { sectionMetas } from "../SectionMetas";
import { FeIdInfo } from "../SectionMetas/baseSections/id";
import { FeSectionInfo } from "../SectionMetas/Info";
import { FeNameInfo } from "../SectionMetas/relSections/rel/relVarbInfoTypes";
import { SectionMeta } from "../SectionMetas/SectionMeta";
import { SectionName } from "../SectionMetas/SectionName";

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

export class HasSectionInfoProps<SN extends SectionName> {
  readonly sectionName: SN;
  readonly feId: string;
  constructor({ sectionName, feId }: FeSectionInfo<SN>) {
    this.sectionName = sectionName as SN;
    this.feId = feId;
  }
}
export class SectionInfoGetters<
  SN extends SectionName = SectionName
> extends HasSectionInfoProps<SN> {
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
}
