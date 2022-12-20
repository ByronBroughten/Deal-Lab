import { pick } from "lodash";
import { ChildName } from "../../SectionsMeta/sectionChildrenDerived/ChildName";
import { ChildSectionName } from "../../SectionsMeta/sectionChildrenDerived/ChildSectionName";
import { SectionPack } from "../../SectionsMeta/sectionChildrenDerived/SectionPack";
import {
  OneRawSection,
  SpChildInfo,
} from "../../SectionsMeta/sectionChildrenDerived/SectionPack/RawSection";
import { SectionNameByType } from "../../SectionsMeta/SectionNameByType";
import {
  GetterSectionBase,
  GetterSectionProps,
} from "../../StateGetters/Bases/GetterSectionBase";
import { GetterSection } from "../../StateGetters/GetterSection";
import {
  AddChildOptions,
  UpdaterSection,
} from "../../StateUpdaters/UpdaterSection";
import { Obj } from "../../utils/Obj";

interface ChildPackLoaderProps<
  SN extends SectionNameByType,
  CN extends ChildName<SN>
> extends GetterSectionProps<SN> {
  sectionPack: SectionPack;
  spChildInfo: SpChildInfo<SN, CN>;
}

export class ChildPackLoader<
  SN extends SectionNameByType,
  CN extends ChildName<SN>,
  CT extends ChildSectionName<SN, CN> = ChildSectionName<SN, CN>
> extends GetterSectionBase<SN> {
  sectionPack: SectionPack;
  spChildInfo: SpChildInfo<SN, CN> & { idx?: number };
  updaterSection: UpdaterSection<SN>;
  get: GetterSection<SN>;
  constructor({
    sectionPack,
    spChildInfo,
    ...props
  }: ChildPackLoaderProps<SN, CN>) {
    super(props);
    this.sectionPack = sectionPack;
    this.spChildInfo = spChildInfo;
    this.updaterSection = new UpdaterSection(props);
    this.get = new GetterSection(props);
  }
  get childName(): CN {
    return this.spChildInfo.childName;
  }
  get childType(): CT {
    return this.get.meta.childType(this.childName) as CT;
  }
  get childRawSectionList(): OneRawSection<CT>[] {
    return this.sectionPack.rawSections[this.childType] as OneRawSection<CT>[];
  }
  get childRawSection(): OneRawSection<CT> {
    const rawSection = this.childRawSectionList.find(
      ({ spNum }) => spNum === this.spChildInfo.spNum
    );
    if (rawSection) return rawSection;
    else {
      throw new Error(
        `No rawSection found with childType ${this.childType} and spNum ${this.spChildInfo.spNum}`
      );
    }
  }
  loadChild() {
    const addProps = {
      ...pick(this.childRawSection, ["dbId", "dbVarbs"]),
      idx: this.spChildInfo.idx,
    };
    this.updaterSection.addChild(
      this.childName,
      addProps as AddChildOptions<any>
    );
    const { feId } = this.get.youngestChild(this.childName);
    this.loadChildChildren(feId);
  }
  private loadChildChildren(childFeId: string) {
    const child = this.getterChild(childFeId);
    const { childNames } = child;
    for (const childName of childNames) {
      const spNums = this.childChildrenSpNums(childName);
      for (const spNum of spNums) {
        const childPackLoader = this.childPackLoader({
          childFeId,
          childChildSpInfo: {
            spNum,
            childName,
          },
        });
        childPackLoader.loadChild();
      }
    }
  }
  private getterChild(
    childFeId: string
  ): GetterSection<ChildSectionName<SN, CN>> {
    return this.get.child({
      childName: this.childName,
      feId: childFeId,
    });
  }
  private childChildrenSpNums(
    childName: ChildName<ChildSectionName<SN, CN>>
  ): number[] {
    const { childSpNums } = this.childRawSection;
    const savedFeIdKeys = Obj.keys(childSpNums);
    if (savedFeIdKeys.includes(childName as any)) {
      return childSpNums[childName as keyof typeof childSpNums];
    } else {
      return [];
    }
  }
  childPackLoader({
    childFeId,
    childChildSpInfo,
  }: {
    childFeId: string;
    childChildSpInfo: SpChildInfo<any, any>;
  }) {
    return new ChildPackLoader({
      ...this.getterSectionsProps,
      sectionName: this.childType,
      feId: childFeId,
      sectionPack: this.sectionPack,
      spChildInfo: childChildSpInfo,
    });
  }
}
