import { SectionValues } from "../../SectionsMeta/baseSectionsDerived/valueMetaTypes";
import {
  ChildName,
  DbChildInfo,
} from "../../SectionsMeta/childSectionsDerived/ChildName";
import { SectionPack } from "../../SectionsMeta/childSectionsDerived/SectionPack";
import { OneRawSection } from "../../SectionsMeta/childSectionsDerived/SectionPack/RawSection";
import {
  SectionNameByType,
  sectionNameS,
} from "../../SectionsMeta/SectionNameByType";
import {
  GetterSectionBase,
  GetterSectionProps,
} from "../../StateGetters/Bases/GetterSectionBase";
import { GetterSection } from "../../StateGetters/GetterSection";
import { UpdaterSection } from "../../StateUpdaters/UpdaterSection";
import { ChildPackLoader } from "./ChildPackLoader";

interface SelfPackLoaderSectionProps<SN extends SectionNameByType>
  extends GetterSectionProps<SN> {
  sectionPack: SectionPack<SN>;
}
export class SelfPackLoader<
  SN extends SectionNameByType
> extends GetterSectionBase<SN> {
  sectionPack: SectionPack<SN>;
  constructor({ sectionPack, ...props }: SelfPackLoaderSectionProps<SN>) {
    super(props);
    this.sectionPack = sectionPack;
  }
  get get() {
    return new GetterSection(this.getterSectionProps);
  }
  get updaterSection() {
    return new UpdaterSection(this.getterSectionProps);
  }
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
  thisHasChildren(): this is SelfPackLoader<SectionNameByType<"hasChild">> {
    return sectionNameS.is(this.sectionName, "hasChild");
  }
  addSectionPackChildren() {
    if (this.thisHasChildren()) {
      const { childNames } = this.get;
      const { childDbIds } = this.headRawSection;
      for (const childName of childNames) {
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
