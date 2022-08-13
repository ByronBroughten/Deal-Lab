import { SectionValues } from "../../SectionsMeta/baseSectionsDerived/valueMetaTypes";
import {
  ChildIdArrsWide,
  ChildName,
  DbChildInfo,
} from "../../SectionsMeta/childSectionsDerived/ChildName";
import { SectionPack } from "../../SectionsMeta/childSectionsDerived/SectionPack";
import { OneRawSection } from "../../SectionsMeta/childSectionsDerived/SectionPack/RawSection";
import { SectionName, sectionNameS } from "../../SectionsMeta/SectionName";
import {
  GetterSectionBase,
  GetterSectionProps,
} from "../../StateGetters/Bases/GetterSectionBase";
import { UpdaterSection } from "../../StateUpdaters/UpdaterSection";
import { Obj } from "../../utils/Obj";
import { ChildPackLoader } from "./ChildPackLoader";

interface SelfPackLoaderSectionProps<SN extends SectionName>
  extends GetterSectionProps<SN> {
  sectionPack: SectionPack<SN>;
}
export class SelfPackLoader<
  SN extends SectionName
> extends GetterSectionBase<SN> {
  sectionPack: SectionPack<SN>;
  constructor({ sectionPack, ...props }: SelfPackLoaderSectionProps<SN>) {
    super(props);
    this.sectionPack = sectionPack;
  }
  private updaterSection = new UpdaterSection(this.getterSectionProps);
  get headRawSection(): OneRawSection<SN> {
    return this.sectionPack.rawSections[this.sectionName][0];
  }
  loadSelfSectionPack(): void {
    const { dbId, dbVarbs } = this.headRawSection;
    this.updaterSection.updateDbId(dbId);
    this.updaterSection.resetVarbs(dbVarbs as Partial<SectionValues<SN>>);
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
            childName,
            dbId,
          });
          childPackLoader.loadChild();
        }
      }
    }
  }
  childPackLoader<CN extends ChildName<SN>>(
    childDbInfo: DbChildInfo<SN, CN>
  ): ChildPackLoader<SN, CN> {
    return new ChildPackLoader({
      ...this.getterSectionProps,
      sectionPack: this.sectionPack as any as SectionPack,
      childDbInfo,
    });
  }
}
