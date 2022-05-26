import { pick } from "lodash";
import { GConstructor } from "../../utils/classObjects";
import {
  FeSectionPackNext,
  SectionPackContext,
} from "../Analyzer/FeSectionPackNext";
import { AddSectionPropsNext } from "../Analyzer/methods/internal/addSections/addSectionsTypes";
import { SectionArrPack, SectionPackRaw } from "../Analyzer/SectionPackRaw";
import { OneRawSection } from "../Analyzer/SectionPackRaw/RawSection";
import { DbSectionInfo } from "../Analyzer/SectionPackRaw/RawSectionFinder";
import { FeParentInfo } from "../SectionsMeta/Info";
import {
  ChildIdArrs,
  ChildName,
} from "../SectionsMeta/relSectionTypes/ChildTypes";
import { SectionName, sectionNameS } from "../SectionsMeta/SectionName";
import { initFeVarbs } from "../SectionsState/FeSection/FeVarbs";
import {
  GetterSection,
  GetterSectionBase,
  GetterSectionProps,
} from "../StateGetters/GetterSection";
import { Obj } from "../utils/Obj";
import { UpdaterSection } from "./../StateUpdaters/UpdaterSection";
import { DescendantAdder, DescendantAdderI } from "./DescendantAdder";
import { FocalSectionBase } from "./FocalSectionBase";
import {
  SelfAndChildRemover,
  SelfAndChildRemoverI,
} from "./SelfAndChildRemover";

type ChildSectionPackArrs<SN extends SectionName> = {
  [CN in ChildName<SN>]: SectionPackRaw<CN>[];
};

export interface SectionPackLoaderI<SN extends SectionName>
  extends FocalSectionBase<SN> {
  loadChildSectionPackArrs(childPackArrs: ChildSectionPackArrs<SN>): void;
  loadChildSectionPackArr<CN extends ChildName<SN>>(
    childArrPack: SectionArrPack<CN>
  ): void;
  loadChildSectionPack<CN extends ChildName<SN>>(
    sectionPack: SectionPackRaw<CN>,
    options?: { feId?: string; idx?: number }
  ): void;
  loadSelfSectionPack(sectionPack: SectionPackRaw<SN>): void;
}

export function ApplySectionPackLoader<
  SN extends SectionName,
  TBase extends GConstructor<FocalSectionBase<SN>>
>(Base: TBase): GConstructor<SectionPackLoaderI<SN>> & TBase {
  return class SectionPackLoaderNext
    extends Base
    implements SectionPackLoaderI<SN>
  {
    private adder = new DescendantAdder(
      this.self.constructorProps
    ) as DescendantAdderI<SN>;
    private remover = new SelfAndChildRemover(
      this.self.constructorProps
    ) as SelfAndChildRemoverI<SN>;
    loadChildSectionPackArrs(childPackArrs: ChildSectionPackArrs<SN>): void {
      for (const [sectionName, sectionPacks] of Obj.entries(childPackArrs)) {
        this.loadChildSectionPackArr({
          sectionName,
          sectionPacks: sectionPacks as SectionPackRaw<typeof sectionName>[],
        });
      }
    }
    loadChildSectionPackArr<CN extends ChildName<SN>>(
      childArrPack: SectionArrPack<CN>
    ): void {
      this.remover.wipeChildren(childArrPack.sectionName);
      const addSectionsProps = this.sectionArrPackToAddSectionProps(
        childArrPack.sectionPacks,
        this.self.feInfo as any as FeParentInfo<CN>
      );
      this.adder.addSections(addSectionsProps);
    }
    loadChildSectionPack<CN extends ChildName<SN>>(
      sectionPack: SectionPackRaw<CN>,
      options: { feId?: string; idx?: number } = {}
    ): void {
      this.loadSectionPack(sectionPack, {
        ...options,
        parentInfo: this.self.feInfo as any as FeParentInfo<CN>,
      });
    }
    loadSelfSectionPack(sectionPack: SectionPackRaw<SN>): void {
      const { feId, idx, parentInfo } = this.self;
      this.remover.removeSelf();
      this.loadSectionPack(sectionPack, {
        feId,
        idx,
        parentInfo,
      });
    }
    // protected loadSectionPackChildren<
    //   S extends SectionName,
    //   CN extends ChildName<S>
    // >(feInfo: FeInfo<S>, childArrPack: SectionArrPack<CN>) {
    //   this.wipeSectionChildren(feInfo, childArrPack.sectionName);
    //   const addSectionsProps = this.sectionArrPackToAddSectionProps(
    //     childArrPack.sectionPacks,
    //     feInfo as ParentFeInfo<CN>
    //   );
    //   this.addSections(addSectionsProps);
    // }
    private loadSectionPack<S extends SectionName>(
      sectionPack: SectionPackRaw<S>,
      sectionPackContext: SectionPackContext<S>
    ): void {
      const sectionNodes = FeSectionPackNext.makeOrderedPreSections({
        sectionPack,
        sectionPackContext,
      });
      return this.adder.addSections(sectionNodes as AddSectionPropsNext[]);
    }
    private sectionArrPackToAddSectionProps<SN extends SectionName>(
      sectionPackArr: SectionPackRaw<SN>[],
      parentInfo: FeParentInfo<SN>
    ) {
      const addSectionsProps: AddSectionPropsNext[] = [];
      for (const sectionPack of sectionPackArr) {
        const sectionNodes = FeSectionPackNext.makeOrderedPreSections({
          sectionPack,
          sectionPackContext: { parentInfo },
        });
        addSectionsProps.push(...(sectionNodes as AddSectionPropsNext[]));
      }
      return addSectionsProps;
    }
  };
}

export const SectionPackLoader = ApplySectionPackLoader(FocalSectionBase);

export class PackLoaderSection<
  SN extends SectionName
> extends GetterSectionBase<SN> {
  updaterSection: UpdaterSection<SN>;
  constructor(props: GetterSectionProps<SN>) {
    super(props);
    this.updaterSection = new UpdaterSection(props);
  }
  updateSelfWithSectionPack(sectionPack: SectionPackRaw<SN>): void {
    const selfPackLoader = new SelfPackLoader({
      ...this.getterSectionProps,
      sectionPack,
    });
    selfPackLoader.updateSelfWithSectionPack();
  }
  loadMultipleSectionPackChildren(
    childPackArrs: ChildSectionPackArrs<SN>
  ): void {
    for (const [sectionName, sectionPacks] of Obj.entries(childPackArrs)) {
      this.loadSectionPackChildren({
        sectionName,
        sectionPacks: sectionPacks as SectionPackRaw<typeof sectionName>[],
      });
    }
  }
  loadSectionPackChildren<CN extends ChildName<SN>>({
    sectionName,
    sectionPacks,
  }: SectionArrPack<CN>): void {
    this.updaterSection.removeChildren(sectionName);
    for (const childPack of sectionPacks) {
      this.loadChildSectionPack(childPack);
    }
  }
  loadChildSectionPack<CN extends ChildName<SN>>(
    sectionPack: SectionPackRaw<CN>,
    options: { idx?: number } = {}
  ): void {
    const childPackLoader = new ChildPackLoader({
      ...this.getterSectionProps,
      sectionPack: sectionPack as any as SectionPackRaw,
      childDbInfo: {
        ...pick(sectionPack, ["sectionName", "dbId"]),
        ...options,
      },
    });
    childPackLoader.loadChild();
  }
}

interface SelfPackLoaderSectionProps<SN extends SectionName>
  extends GetterSectionProps<SN> {
  sectionPack: SectionPackRaw<SN>;
}
class SelfPackLoader<SN extends SectionName> extends GetterSectionBase<SN> {
  sectionPack: SectionPackRaw<SN>;
  updaterSection: UpdaterSection<SN>;
  getterSection: GetterSection<SN>;
  constructor({ sectionPack, ...props }: SelfPackLoaderSectionProps<SN>) {
    super(props);
    this.sectionPack = sectionPack;
    this.updaterSection = new UpdaterSection(props);
    this.getterSection = new GetterSection(props);
  }
  get headRawSection(): OneRawSection<SN> {
    return this.sectionPack.rawSections[this.sectionName][0];
  }
  updateSelfWithSectionPack() {
    const { dbId, dbVarbs } = this.headRawSection;
    this.updaterSection.updateProps({
      dbId,
      varbs: initFeVarbs({
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
      for (const childName of Obj.keys(childDbIds as ChildIdArrs<SN>)) {
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

interface ChildPackLoaderProps<SN extends SectionName, CN extends ChildName<SN>>
  extends GetterSectionProps<SN> {
  sectionPack: SectionPackRaw;
  childDbInfo: DbSectionInfo<CN>;
}

class ChildPackLoader<
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
    for (const childName of Obj.keys(childDbIds as ChildIdArrs<CN>)) {
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
      shared: this.shared,
      sectionPack: this.sectionPack,
      childDbInfo: childChildDbInfo as any,
    });
  }
}
