import { DbSectionInfo } from "../../SectionPack/DbSectionInfo";
import { OneRawSection } from "../../SectionPack/RawSection";
import { SectionPackRaw } from "../../SectionPack/SectionPackRaw";
import {
  ChildIdArrsWide,
  ChildName,
} from "../../SectionsMeta/relSectionTypes/ChildTypes";
import { SectionName, sectionNameS } from "../../SectionsMeta/SectionName";
import {
  GetterSectionBase,
  GetterSectionProps,
} from "../../StateGetters/Bases/GetterSectionBase";
import { StateSections } from "../../StateSections/StateSectionsNext";
import { UpdaterSection } from "../../StateUpdaters/UpdaterSection";
import { Obj } from "../../utils/Obj";
import { ChildPackLoader } from "./ChildPackLoader";

interface SelfPackLoaderSectionProps<SN extends SectionName>
  extends GetterSectionProps<SN> {
  sectionPack: SectionPackRaw<SN>;
}
export class SelfPackLoader<
  SN extends SectionName
> extends GetterSectionBase<SN> {
  sectionPack: SectionPackRaw<SN>;
  constructor({ sectionPack, ...props }: SelfPackLoaderSectionProps<SN>) {
    super(props);
    this.sectionPack = sectionPack;
  }
  private updaterSection = new UpdaterSection(this.getterSectionProps);
  get headRawSection(): OneRawSection<SN> {
    return this.sectionPack.rawSections[this.sectionName][0];
  }
  updateSelfWithSectionPack() {
    const { dbId, dbVarbs } = this.headRawSection;
    this.updaterSection.updateProps({
      dbId,
      varbs: StateSections.initRawVarbs({
        dbVarbs,
        ...this.feSectionInfo,
      }),
    });
    this.updaterSection.removeAllChildren();
    this.addSectionPackChildren();
  }
  thisHasChildren(): this is SelfPackLoader<SectionName<"hasChild">> {
    return sectionNameS.is(this.sectionName, "hasChild");
  }
  addSectionPackChildren() {
    if (this.thisHasChildren()) {
      const { childDbIds } = this.headRawSection;
      for (const childName of Obj.keys(childDbIds as ChildIdArrsWide<SN>)) {
        for (const dbId of childDbIds[childName]) {
          const childPackLoader = this.childPackLoader({
            sectionName: childName,
            dbId,
          });
          childPackLoader.loadChild();
        }
      }
    }
  }
  childPackLoader<CN extends ChildName<SN>>(
    childDbInfo: DbSectionInfo<CN>
  ): ChildPackLoader<SN, CN> {
    return new ChildPackLoader({
      ...this.getterSectionProps,
      sectionPack: this.sectionPack as any as SectionPackRaw,
      childDbInfo: childDbInfo,
    });
  }
}
