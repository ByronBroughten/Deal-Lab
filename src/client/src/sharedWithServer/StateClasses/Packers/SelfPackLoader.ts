import { SectionNameByType } from "../../SectionNameByType";
import { SectionPack } from "../../SectionPacks/SectionPack";
import { OneRawSection } from "../../State/RawSection";
import {
  GetterSectionBase,
  GetterSectionProps,
} from "../../StateGetters/Bases/GetterSectionBase";
import { GetterSection } from "../../StateGetters/GetterSection";
import { SectionName } from "../../sectionVarbsConfig/SectionName";

import { FeSectionInfo } from "../../SectionInfos/FeInfo";
import { UpdaterSection } from "../Updaters/UpdaterSection";

interface SelfPackLoaderSectionProps<SN extends SectionNameByType>
  extends GetterSectionProps<SN> {
  sectionPack: SectionPack<SN>;
}

interface Focal<SN extends SectionName = SectionName>
  extends FeSectionInfo<SN> {
  rawSectionName: string;
  spNum: number;
}

export class SelfPackLoader<
  SN extends SectionName
> extends GetterSectionBase<SN> {
  sectionPack: SectionPack<SN>;
  constructor({ sectionPack, ...props }: SelfPackLoaderSectionProps<SN>) {
    super(props);
    this.sectionPack = sectionPack;
  }
  get get() {
    return new GetterSection(this.getterSectionProps);
  }
  get updater() {
    return new UpdaterSection(this.getterSectionProps);
  }
  get headRawSection(): OneRawSection<SN> {
    return this.sectionPack.rawSections[this.sectionName][0];
  }
  overwriteSelfWithPack(): void {
    this.updater.resetVarbs();
    this.updater.removeAllChildren();
    this.integrateSectionPack();
  }
  integrateSectionPack(): void {
    const { spNum } = this.headRawSection;
    let focals: Focal<any>[] = [
      {
        ...this.feInfo,
        rawSectionName: this.sectionName,
        spNum,
      },
    ];
    while (focals.length > 0) {
      const nextFocals: Focal<any>[] = [];
      for (const focal of focals) {
        const section = this.updater.updaterSection(focal);
        const raw = this.rawSection({
          name: focal.sectionName,
          spNum: focal.spNum,
        });
        section.loadRawSection(raw);
        const { childNames } = section.get;
        const { childSpNums } = raw;
        for (const childName of childNames) {
          if (childSpNums[childName]) {
            const spNums = childSpNums[childName];
            const children = section.children(childName);
            for (let i = 0; i < spNums.length; i++) {
              const spNum = spNums[i];
              const { feInfo } =
                children[i] || section.addAndGetChild(childName);
              nextFocals.push({
                ...feInfo,
                rawSectionName: childName,
                spNum,
              });
            }
          }
        }
      }
      focals = nextFocals;
    }
    this.updater.finishNewSection();
  }
  private rawSection({
    spNum,
    name,
  }: {
    spNum: number;
    name: string;
  }): OneRawSection<any> {
    const rawSections = this.sectionPack.rawSections[name];
    if (!rawSections) {
      throw new Error(
        `No raw sections of name ${name} in sectionPack ${
          this.sectionPack.sectionName
        }. ${Object.keys(this.sectionPack.rawSections).join(",")}`
      );
    }

    const rawSection = rawSections.find((raw) => raw.spNum === spNum);
    if (rawSection) {
      return rawSection;
    } else {
      throw new Error(
        `No rawSection found with childName ${name} and spNum ${spNum}`
      );
    }
  }
}
