import { pick } from "lodash";
import { OneRawSection } from "../../SectionPack/RawSection";
import { SectionPack } from "../../SectionPack/SectionPack";
import {
  ChildName,
  ChildType,
  DbChildInfo,
} from "../../SectionsMeta/relSectionTypes/ChildTypes";
import { SectionName } from "../../SectionsMeta/SectionName";
import {
  GetterSectionBase,
  GetterSectionProps,
} from "../../StateGetters/Bases/GetterSectionBase";
import { GetterSection } from "../../StateGetters/GetterSection";
import { UpdaterSection } from "../../StateUpdaters/UpdaterSection";
import { Obj } from "../../utils/Obj";

interface ChildPackLoaderProps<SN extends SectionName, CN extends ChildName<SN>>
  extends GetterSectionProps<SN> {
  sectionPack: SectionPack;
  childDbInfo: DbChildInfo<SN, CN>;
}

export class ChildPackLoader<
  SN extends SectionName,
  CN extends ChildName<SN>,
  CT extends ChildType<SN, CN> = ChildType<SN, CN>
> extends GetterSectionBase<SN> {
  sectionPack: SectionPack;
  childDbInfo: DbChildInfo<SN, CN> & { idx?: number };
  updaterSection: UpdaterSection<SN>;
  get: GetterSection<SN>;
  constructor({
    sectionPack,
    childDbInfo,
    ...props
  }: ChildPackLoaderProps<SN, CN>) {
    super(props);
    this.sectionPack = sectionPack;
    this.childDbInfo = childDbInfo;
    this.updaterSection = new UpdaterSection(props);
    this.get = new GetterSection(props);
  }
  get childName(): CN {
    return this.childDbInfo.childName;
  }
  get childType(): CT {
    return this.get.meta.childType(this.childName) as CT;
  }
  get childRawSectionList(): OneRawSection<CT>[] {
    return this.sectionPack.rawSections[this.childType] as OneRawSection<CT>[];
  }
  get childRawSection(): OneRawSection<CT> {
    const rawSection = this.childRawSectionList.find(
      ({ dbId }) => dbId === this.childDbInfo.dbId
    );
    if (rawSection) return rawSection;
    else
      throw new Error(
        `No rawSection found with childType ${this.childType} and dbId ${this.childDbInfo.dbId}`
      );
  }
  loadChild() {
    this.updaterSection.addChild(this.childName, {
      ...pick(this.childRawSection, ["dbId", "dbVarbs"]),
      idx: this.childDbInfo.idx,
    });
    const { feId } = this.get.youngestChild(this.childName);
    this.loadChildChildren(feId);
  }
  private loadChildChildren(childFeId: string) {
    const { childDbIds } = this.childRawSection;
    for (const childName of Obj.keys(childDbIds)) {
      for (const dbId of childDbIds[childName as keyof typeof childDbIds]) {
        const childPackLoader = this.childPackLoader({
          childFeId,
          childDbInfo: {
            dbId,
            childName,
          },
        });
        childPackLoader.loadChild();
      }
    }
  }
  childPackLoader({
    childFeId,
    childDbInfo,
  }: {
    childFeId: string;
    childDbInfo: {
      dbId: string;
      childName: string;
    };
  }) {
    return new ChildPackLoader({
      sectionName: this.childType,
      feId: childFeId,
      sectionsShare: this.sectionsShare,
      sectionPack: this.sectionPack,
      childDbInfo: childDbInfo as any,
    });
  }
}
