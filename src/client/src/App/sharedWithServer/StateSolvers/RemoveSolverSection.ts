import {
  ChildName,
  ChildType,
  FeChildInfo,
} from "../SectionsMeta/childSectionsDerived/ChildTypes";
import { FeSectionInfo, VarbInfo } from "../SectionsMeta/Info";
import { SectionName } from "../SectionsMeta/SectionName";
import { GetterSection } from "../StateGetters/GetterSection";
import { OutVarbGetterSection } from "../StateInOutVarbs/OutVarbGetterSection";
import { UpdaterSection } from "../StateUpdaters/UpdaterSection";
import { Arr } from "../utils/Arr";
import {
  SolverSectionBase,
  SolverSectionProps,
} from "./SolverBases/SolverSectionBase";
import { SolverVarb } from "./SolverVarb";

type RemoveSolveShare = {
  removedVarbIds: Set<string>;
  outVarbIdsOfRemoved: Set<string>;
};

interface RemoveSolverSectionProps<SN extends SectionName>
  extends SolverSectionProps<SN> {
  removeSolveShare: RemoveSolveShare;
}

export class RemoveSolverSection<
  SN extends SectionName
> extends SolverSectionBase<SN> {
  readonly removeSolveShare: RemoveSolveShare;
  constructor({ removeSolveShare, ...rest }: RemoveSolverSectionProps<SN>) {
    super(rest);
    this.removeSolveShare = removeSolveShare;
  }
  static init<S extends SectionName>(
    props: SolverSectionProps<S>
  ): RemoveSolverSection<S> {
    return new RemoveSolverSection({
      ...props,
      removeSolveShare: {
        removedVarbIds: new Set(),
        outVarbIdsOfRemoved: new Set(),
      },
    });
  }
  get = new GetterSection(this.getterSectionProps);
  private updater = new UpdaterSection(this.getterSectionProps);
  get removedVarbIds() {
    return this.removeSolveShare.removedVarbIds;
  }
  get outVarbIdsOfRemoved() {
    return this.removeSolveShare.outVarbIdsOfRemoved;
  }
  inOut = new OutVarbGetterSection(this.getterSectionProps);
  solverVarb(varbInfo: VarbInfo): SolverVarb {
    return new SolverVarb({
      ...this.solverSectionsProps,
      ...varbInfo,
    });
  }
  removeSolverSection<S extends SectionName>(
    feInfo: FeSectionInfo<S>
  ): RemoveSolverSection<S> {
    return new RemoveSolverSection({
      ...feInfo,
      ...this.solverSectionsProps,
      removeSolveShare: this.removeSolveShare,
    });
  }
  prepForRemove() {
    this.collectRemovedVarbIds();
    this.collectOutVarbIdsOfRemoved();
    this.removeOutEntitiesOfInEntities();
  }
  private removeOutEntitiesOfInEntities() {
    const { selfAndDescendantVarbInfos } = this.get;
    for (const varbInfo of selfAndDescendantVarbInfos) {
      const solverVarb = this.solverVarb(varbInfo);
      solverVarb.removeOutEntitiesOfInEntities();
    }
  }
  private collectRemovedVarbIds() {
    const { selfAndDescendantVarbIds } = this.get;
    this.removeSolveShare.removedVarbIds = new Set([
      ...this.removedVarbIds,
      ...selfAndDescendantVarbIds,
    ]);
  }
  private collectOutVarbIdsOfRemoved() {
    const { selfAndDescendantOutVarbIds } = this.inOut;
    this.removeSolveShare.outVarbIdsOfRemoved = new Set([
      ...this.outVarbIdsOfRemoved,
      ...selfAndDescendantOutVarbIds,
    ]);
  }
  prepForRemoveAndExtractVarbIds() {
    this.prepForRemove();
    this.extractVarbIdsToSolveFor();
  }
  removeSelfAndExtractVarbIds(): void {
    this.prepAndRemoveSelf();
    this.extractVarbIdsToSolveFor();
  }
  private prepAndRemoveSelf() {
    this.prepForRemove();
    this.updater.removeSelf();
  }
  removeChildrenGroupsAndExtractVarbIds(childNames: ChildName<SN>[]): void {
    this.removeChildrenGroupsAndHandleVarbIdsAndEntities(childNames);
    this.extractVarbIdsToSolveFor();
  }
  removeChildrenGroupsAndHandleVarbIdsAndEntities(
    childNames: ChildName<SN>[]
  ): void {
    for (const childName of childNames) {
      this.prepAndRemoveChildren(childName);
    }
  }
  removeAllChildrenAndExtractVarbIds(): void {
    const { childNames } = this.get.meta;
    for (const childName of childNames) {
      this.prepAndRemoveChildren(childName);
    }
    this.extractVarbIdsToSolveFor();
  }
  removeChildrenAndExtractVarbIds(childName: ChildName<SN>): void {
    this.prepAndRemoveChildren(childName);
    this.extractVarbIdsToSolveFor();
  }
  child(childInfo: FeChildInfo<SN>): RemoveSolverSection<ChildType<SN>> {
    const feInfo = this.get.childInfoToFe(childInfo);
    return this.removeSolverSection(feInfo);
  }
  private prepAndRemoveChildren(childName: ChildName<SN>): void {
    const childIds = this.get.childFeIds(childName);
    for (const feId of childIds) {
      const child = this.child({
        childName,
        feId,
      });
      child.prepAndRemoveSelf();
    }
  }
  extractVarbIdsToSolveFor() {
    const varbIdsToSolveFor = Arr.exclude(
      [...this.outVarbIdsOfRemoved],
      [...this.removedVarbIds]
    );
    this.addVarbIdsToSolveFor(...varbIdsToSolveFor);
    this.removeSolveShare.outVarbIdsOfRemoved = new Set();
    this.removeSolveShare.removedVarbIds = new Set();
  }
}
