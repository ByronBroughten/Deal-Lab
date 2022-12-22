import { ChildName } from "../SectionsMeta/sectionChildrenDerived/ChildName";
import { ChildSectionName } from "../SectionsMeta/sectionChildrenDerived/ChildSectionName";
import { ChildArrPack } from "../SectionsMeta/sectionChildrenDerived/ChildSectionPack";
import { ParentNameSafe } from "../SectionsMeta/sectionChildrenDerived/ParentName";
import { FeSectionInfo } from "../SectionsMeta/SectionInfo/FeInfo";
import { SectionNameByType } from "../SectionsMeta/SectionNameByType";
import { GetterSection } from "../StateGetters/GetterSection";
import { GetterSections } from "../StateGetters/GetterSections";
import { InEntityGetterSection } from "../StateGetters/InEntityGetterSection";
import {
  ChildPackInfo,
  ChildSectionPackArrs,
  PackLoaderSection,
} from "../StatePackers.ts/PackLoaderSection";
import { DefaultFamilyAdder } from "../StateUpdaters/DefaultFamilyAdder";
import { AddChildOptions } from "../StateUpdaters/UpdaterSection";
import { Obj } from "../utils/Obj";
import {
  SolverSectionBase,
  SolverSectionProps,
} from "./SolverBases/SolverSectionBase";
import { SolverVarb } from "./SolverVarb";

type AddSolverShare = { addedVarbIds: Set<string> };
interface AddSolverSectionProps<SN extends SectionNameByType>
  extends SolverSectionProps<SN> {
  addSolveShare: AddSolverShare;
}

export class AddSolverSection<
  SN extends SectionNameByType
> extends SolverSectionBase<SN> {
  readonly addSolveShare: AddSolverShare;
  constructor({ addSolveShare, ...rest }: AddSolverSectionProps<SN>) {
    super(rest);
    this.addSolveShare = addSolveShare;
  }
  get get() {
    return new GetterSection(this.getterSectionProps);
  }
  get inEntitySection() {
    return new InEntityGetterSection(this.getterSectionProps);
  }
  get getterSections(): GetterSections {
    return new GetterSections(this.getterSectionProps);
  }
  private get loader() {
    return new PackLoaderSection(this.getterSectionProps);
  }
  static init<S extends SectionNameByType>(
    props: SolverSectionProps<S>
  ): AddSolverSection<S> {
    return new AddSolverSection({
      ...props,
      addSolveShare: { addedVarbIds: new Set() },
    });
  }
  get addedVarbIds(): Set<string> {
    return this.addSolveShare.addedVarbIds;
  }
  private get defaultAdder() {
    return new DefaultFamilyAdder(this.getterSectionProps);
  }
  addSolverSection<S extends SectionNameByType>(
    feInfo: FeSectionInfo<S>
  ): AddSolverSection<S> {
    return new AddSolverSection({
      ...this.solverSectionsProps,
      addSolveShare: this.addSolveShare,
      ...feInfo,
    });
  }
  get parent(): AddSolverSection<ParentNameSafe<SN>> {
    const { parentInfoSafe } = this.get;
    return this.addSolverSection(parentInfoSafe);
  }
  onlyChild<CN extends ChildName<SN>>(
    childName: CN
  ): AddSolverSection<ChildSectionName<SN, CN>> {
    const { feInfo } = this.get.onlyChild(childName);
    return this.addSolverSection(feInfo);
  }
  youngestChild<CN extends ChildName<SN>>(
    childName: CN
  ): AddSolverSection<ChildSectionName<SN, CN>> {
    const { feInfo } = this.get.youngestChild(childName);
    return this.addSolverSection(feInfo);
  }
  addChildAndFinalizeAllAdds<CN extends ChildName<SN>>(
    childName: CN,
    options?: AddChildOptions<SN, CN>
  ): void {
    this.addChild(childName, options);
    this.finalizeAllAdds();
  }
  addChild<CN extends ChildName<SN>>(
    childName: CN,
    options?: AddChildOptions<SN, CN>
  ): void {
    this.defaultAdder.addChild(childName, options);
    const child = this.youngestChild(childName);
    child.finalizeAddedThis();
  }
  loadChildAndFinalize<CN extends ChildName<SN>>(
    packInfo: ChildPackInfo<SN, CN>
  ): void {
    this.loadChild(packInfo);
    this.finalizeAllAdds();
  }
  loadChild<CN extends ChildName<SN>>(packInfo: ChildPackInfo<SN, CN>): void {
    this.loader.loadChildSectionPack(packInfo);
    const child = this.youngestChild(packInfo.childName);
    child.finalizeAddedThis();
  }

  loadChildrenAndFinalize<CN extends ChildName<SN>>(
    props: ChildArrPack<SN, CN>
  ): void {
    this.loadChildren(props);
    this.finalizeAllAdds();
  }
  private loadChildren<CN extends ChildName<SN>>({
    childName,
    sectionPacks,
  }: ChildArrPack<SN, CN>): void {
    for (const sectionPack of sectionPacks) {
      this.loadChild({
        childName,
        sectionPack,
      });
    }
  }
  loadChildArrsAndFinalize<CN extends ChildName<SN>>(
    packArrs: ChildSectionPackArrs<SN, CN>
  ): void {
    for (const childName of Obj.keys(packArrs)) {
      this.loadChildren({
        childName,
        sectionPacks: packArrs[childName],
      });
    }
    this.finalizeAllAdds();
  }
  private finalizeAddedThis() {
    const { selfAndDescendantVarbIds } = this.get;
    this.addToAddedVarbIds(...selfAndDescendantVarbIds);
  }
  private addToAddedVarbIds(...varbIds: string[]): void {
    this.addSolveShare.addedVarbIds = new Set([
      ...this.addedVarbIds,
      ...varbIds,
    ]);
  }
  finalizeAddedThisAndAll() {
    this.finalizeAddedThis();
    this.finalizeAllAdds();
  }
  finalizeAllAdds() {
    this.addAppWideMissingOutEntities();
    this.addVarbIdsToSolveFor(...this.addedVarbIds);
    this.addSolveShare.addedVarbIds = new Set();
  }
  private addAppWideMissingOutEntities() {
    const { appWideVarbInfosWithInEntities } = this.inEntitySection;
    for (const feVarbInfo of appWideVarbInfosWithInEntities) {
      const solverVarb = new SolverVarb({
        ...this.solverSectionsProps,
        ...feVarbInfo,
      });
      solverVarb.addOutEntitiesFromAllInEntities();
    }
  }
}
