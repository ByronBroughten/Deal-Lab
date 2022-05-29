import { pick } from "lodash";
import { SectionPackRaw } from "../../Analyzer/SectionPackRaw";
import { OneRawSection } from "../../Analyzer/SectionPackRaw/RawSection";
import { DbSectionInfo } from "../../Analyzer/SectionPackRaw/RawSectionFinder";
import {
  ChildIdArrsWide,
  ChildName,
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
  sectionPack: SectionPackRaw;
  childDbInfo: DbSectionInfo<CN>;
}

export class ChildPackLoader<
  SN extends SectionName,
  CN extends ChildName<SN>
> extends GetterSectionBase<SN> {
  sectionPack: SectionPackRaw;
  childDbInfo: DbSectionInfo<CN> & { idx?: number };
  updaterSection: UpdaterSection<SN>;
  getterSection: GetterSection<SN>;
  constructor({
    sectionPack,
    childDbInfo,
    ...props
  }: ChildPackLoaderProps<SN, CN>) {
    super(props);
    this.sectionPack = sectionPack;
    this.childDbInfo = childDbInfo;
    this.updaterSection = new UpdaterSection(props);
    this.getterSection = new GetterSection(props);
  }
  get childName() {
    return this.childDbInfo.sectionName;
  }
  get childRawSectionList(): OneRawSection<CN>[] {
    return this.sectionPack.rawSections[this.childName] as OneRawSection<CN>[];
  }
  get childRawSection(): OneRawSection<CN> {
    const rawSection = this.childRawSectionList.find(
      ({ dbId }) => dbId === this.childDbInfo.dbId
    );
    if (rawSection) return rawSection;
    else
      throw new Error(
        `No rawSection found with name ${this.childName} and dbId ${this.childDbInfo.dbId}`
      );
  }
  loadChild() {
    this.updaterSection.addChild(this.childName, {
      ...pick(this.childRawSection, ["dbId", "dbVarbs"]),
      idx: this.childDbInfo.idx,
    });
    const { feId } = this.getterSection.youngestChild(this.childName);
    this.loadChildChildren(feId);
  }
  private loadChildChildren(childFeId: string) {
    const { childDbIds } = this.childRawSection;
    for (const childName of Obj.keys(childDbIds as ChildIdArrsWide<CN>)) {
      for (const dbId of childDbIds[childName]) {
        const childPackLoader = this.childPackLoader({
          childFeId,
          childChildDbInfo: {
            dbId,
            sectionName: childName,
          },
        });
        childPackLoader.loadChild();
      }
    }
  }
  childPackLoader({
    childFeId,
    childChildDbInfo,
  }: {
    childFeId: string;
    childChildDbInfo: {
      dbId: string;
      sectionName: SectionName;
    };
  }) {
    return new ChildPackLoader({
      sectionName: this.childName,
      feId: childFeId,
      sectionsShare: this.sectionsShare,
      sectionPack: this.sectionPack,
      childDbInfo: childChildDbInfo as any,
    });
  }
}
