import { Id } from "../SectionsMeta/baseSections/id";
import { ParentFeInfo } from "../SectionsMeta/relSectionTypes/ParentTypes";
import { SectionName } from "../SectionsMeta/SectionName";
import { Obj } from "../utils/Obj";
import { RawSectionFinder } from "./DbSectionInfo";
import { FeSelfOrDescendantParentStub } from "./FeSectionPacks/FeParentStub";
import {
  OneSectionNodeMaker,
  SectionNodeMaker
} from "./FeSectionPacks/FeSectionNode";
import { GeneralRawSection, RawSection, RawSections } from "./RawSection";
import { SectionPackRaw } from "./SectionPackRaw";
export type SectionPackSupplements<SN extends SectionName> = {
  parentInfo: ParentFeInfo<SN>;
  feId?: string;
  idx?: number;
};

type FeSectionPackCore<SN extends SectionName> = SectionPackRaw<SN>;
export class FeSectionPack<SN extends SectionName> {
  constructor(readonly core: FeSectionPackCore<SN>) {}
  get sectionName(): SN {
    return this.core.sectionName;
  }
  get dbId(): string {
    return this.core.dbId;
  }
  get rawSections(): RawSections<SN> {
    return this.core.rawSections;
  }
  get headSectionFinder() {
    return {
      sectionName: this.sectionName,
      dbId: this.dbId,
    } as RawSectionFinder<SN, "fe">;
  }
  rawSection({
    sectionName,
    dbId,
  }: RawSectionFinder<SN, "fe">): RawSection<SN> {
    const rawSections = this.rawSections[
      sectionName
    ] as any as GeneralRawSection[];
    const rawSection = rawSections.find(
      (rawSection) => rawSection.dbId === dbId
    );
    if (rawSection) return rawSection as any;
    else throw new Error(`No rawSection found at ${sectionName}.${dbId}`);
  }
  get headSection(): RawSection<SN> {
    return this.rawSection(this.headSectionFinder);
  }
  makeHeadNodeMaker({ feId, ...rest }: SectionPackSupplements<SN>) {
    return {
      feId: feId ?? Id.make(),
      dbId: this.dbId,
      sectionName: this.sectionName,
      ...rest,
    } as SectionNodeMaker<SN>;
  }
  makeNodeMakers({
    parentInfo,
    childDbIds,
    childFeIds,
  }: FeSelfOrDescendantParentStub<SN>): SectionNodeMaker<SN>[] {
    const sectionNodeMakers: SectionNodeMaker<SN>[] = [];
    for (const [sectionName, dbIds] of Obj.entries(childDbIds)) {
      const feIds = childFeIds[sectionName];
      for (const [idx, dbId] of Obj.entries(dbIds)) {
        sectionNodeMakers.push({
          dbId,
          feId: feIds[idx],
          sectionName,
          parentInfo,
        } as OneSectionNodeMaker<SectionName> as SectionNodeMaker<SN>);
      }
    }
    return sectionNodeMakers;
  }
}
