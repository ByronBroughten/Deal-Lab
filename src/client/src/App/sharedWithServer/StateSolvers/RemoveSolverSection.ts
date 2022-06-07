import { FeSectionInfo } from "../SectionsMeta/Info";
import { ChildName } from "../SectionsMeta/relSectionTypes/ChildTypes";
import { SectionName } from "../SectionsMeta/SectionName";
import { GetterSection } from "../StateGetters/GetterSection";
import { OutVarbGetterSection } from "../StateInOutVarbs/OutVarbGetterSection";
import { UpdaterSection } from "../StateUpdaters/UpdaterSection";
import { Arr } from "../utils/Arr";
import {
  SolverSectionBase,
  SolverSectionProps,
} from "./SolverBases/SolverSectionBase";

interface RemoveSolverSectionProps<SN extends SectionName>
  extends SolverSectionProps<SN>,
    RemoveSolveShare {}
type RemoveSolveShare = {
  removedVarbIds: Set<string>;
  outVarbIdsOfRemoved: Set<string>;
};

export class RemoveSolverSection<
  SN extends SectionName
> extends SolverSectionBase<SN> {
  private removeSolveShare: RemoveSolveShare;
  constructor({
    removedVarbIds,
    outVarbIdsOfRemoved,
    ...rest
  }: RemoveSolverSectionProps<SN>) {
    super(rest);
    this.removeSolveShare = {
      removedVarbIds,
      outVarbIdsOfRemoved,
    };
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
  static init<S extends SectionName>(
    props: SolverSectionProps<S>
  ): RemoveSolverSection<S> {
    return new RemoveSolverSection({
      ...props,
      removedVarbIds: new Set(),
      outVarbIdsOfRemoved: new Set(),
    });
  }
  removeSolverSection<S extends SectionName>(
    feInfo: FeSectionInfo<S>
  ): RemoveSolverSection<S> {
    return new RemoveSolverSection({
      ...feInfo,
      ...this.solverSectionsProps,
      ...this.removeSolveShare,
    });
  }
  removeSelfAndExtractVarbIds(): void {
    this.removeSelf();
    this.extractVarbIdsToSolveFor();
  }
  private removeSelf() {
    this.collectRelevantVarbIds();
    this.updater.removeSelf();
  }
  removeChildrenGroupsAndExtractVarbIds(childNames: ChildName<SN>[]): void {
    this.removeChildrenGroups(childNames);
    this.extractVarbIdsToSolveFor();
  }
  private removeChildrenGroups(childNames: ChildName<SN>[]): void {
    for (const sectionName of childNames) {
      const childIds = this.get.childFeIds(sectionName);
      for (const feId of childIds) {
        const child = this.removeSolverSection({
          sectionName,
          feId,
        });
        child.removeSelf();
      }
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
  collectRelevantVarbIds() {
    this.collectRemovedVarbIds();
    this.collectOutVarbIdsOfRemoved();
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
}
