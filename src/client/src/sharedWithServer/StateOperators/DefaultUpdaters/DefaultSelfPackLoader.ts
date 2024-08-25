import { SectionNameByType } from "../../SectionNameByType";
import { OneRawSection } from "../../State/RawSection";
import { GetterSectionProps } from "../../StateGetters/Bases/GetterSectionBase";
import { GetterSection } from "../../StateGetters/GetterSection";
import { FeSectionInfo } from "../../StateGetters/Identifiers/FeInfo";
import { SectionName } from "../../stateSchemas/SectionName";
import { SectionPack } from "../../StateTransports/SectionPack";
import { SelfPackLoader } from "../Packers/SelfPackLoader";
import { UpdaterSection } from "../Updaters/UpdaterSection";
import { UpdaterSectionBase } from "../Updaters/UpdaterSectionBase";
import { DefaultStateLoader } from "./DefaultStateLoader";

interface SelfPackLoaderSectionProps<SN extends SectionNameByType>
  extends GetterSectionProps<SN> {
  sectionPack: SectionPack<any>;
}

interface FocalNext<SN extends SectionName = SectionName>
  extends FeSectionInfo<SN> {
  makeDefault: boolean;
  rawSectionName: string;
  spNum: number;
}

export class DefaultSelfPackLoader<
  SN extends SectionName
> extends UpdaterSectionBase<SN> {
  private sectionPack: SectionPack<SN>;
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
  getUpdater<S extends SectionName>(
    feInfo: FeSectionInfo<S>
  ): UpdaterSection<S> {
    return new UpdaterSection({
      ...this.getterSectionsProps,
      ...feInfo,
    });
  }
  defaultStateLoader<S extends SectionName>(
    feInfo: FeSectionInfo<S>
  ): DefaultStateLoader<S> {
    return new DefaultStateLoader({
      ...this.getterSectionsProps,
      ...feInfo,
    });
  }
  selfPackLoader(sectionPack: SectionPack<SN>): SelfPackLoader<SN> {
    return new SelfPackLoader({
      ...this.getterSectionProps,
      sectionPack,
    });
  }
  overwriteSelf(): void {
    this.selfPackLoader(this.sectionPack).overwriteSelfWithPack();
  }
  private get headRawSection(): OneRawSection<SN> {
    return this.sectionPack.rawSections[this.sectionName][0];
  }
  integrateSectionPack(): void {
    const { spNum } = this.headRawSection;
    let focals: FocalNext<any>[] = [
      {
        ...this.feInfo,
        rawSectionName: this.sectionName,
        makeDefault: true,
        spNum,
      },
    ];

    while (focals.length > 0) {
      const nextFocals: FocalNext<any>[] = [];
      for (const focal of focals) {
        if (focal.makeDefault) {
          const defaultStateLoader = this.defaultStateLoader(focal);
          defaultStateLoader.loadSelfDefaultState();
        }
        const updater = this.getUpdater(focal);
        const raw = this.rawSection({
          name: focal.sectionName,
          spNum: focal.spNum,
        });
        updater.loadRawSection(raw);
        const { childNames } = updater.get;
        const { childSpNums } = raw;
        for (const childName of childNames) {
          if (childSpNums[childName]) {
            const spNums = childSpNums[childName];
            const children = updater.children(childName);
            for (let i = 0; i < spNums.length; i++) {
              const spNum = spNums[i];
              nextFocals.push({
                ...getNextFocal(updater, childName, children[i]),
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

function getNextFocal(
  current: UpdaterSection<any>,
  childName: any,
  next?: UpdaterSection<any>
): FeSectionInfo<any> & { makeDefault: boolean } {
  if (next) {
    return {
      ...next.feInfo,
      makeDefault: false,
    };
  } else {
    const child = current.addAndGetChild(childName);
    return {
      ...child.feInfo,
      makeDefault: true,
    };
  }
}
