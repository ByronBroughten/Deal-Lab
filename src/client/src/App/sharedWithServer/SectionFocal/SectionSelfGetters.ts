import { GetterSections } from "../Sections/GetterSections";
import {
  HasSharedSections,
  SharedSections,
} from "../Sections/HasSharedSections";
import { FeSectionInfo } from "../SectionsMeta/Info";
import { ValueTypeName } from "../SectionsMeta/relSections/rel/valueMetaTypes";
import {
  ChildIdArrs,
  ChildName,
  DescendantIds,
  DescendantName,
  SelfAndDescendantIds,
} from "../SectionsMeta/relSectionTypes/ChildTypes";
import { ParentNameSafe } from "../SectionsMeta/relSectionTypes/ParentTypes";
import { SectionName } from "../SectionsMeta/SectionName";
import { FeSectionI } from "../SectionsState/FeSection";
import FeVarb, { ValueTypesPlusAny } from "../SectionsState/FeSection/FeVarb";
import { FeVarbsI } from "../SectionsState/FeSection/FeVarbs";
import { Obj } from "../utils/Obj";
import { FeVarbInfo } from "./../SectionsMeta/relSections/rel/relVarbInfoTypes";

export interface SectionSelfGettersProps<SN extends SectionName>
  extends FeSectionInfo<SN> {
  shared: SharedSections;
}

// Ok. So. What if I make FeSection extends SectionSelfGetters?
// I would have to change its init function
// It would need to receive the shared state in addition to everything else
// that is the only new thing it would need to get, though.

// what would I do with its updating capabilities?

export class SectionSelfGetters<
  SN extends SectionName
> extends HasSharedSections {
  private sections: GetterSections;
  readonly sectionName: SN;
  readonly feId: string;
  constructor({ shared, sectionName, feId }: SectionSelfGettersProps<SN>) {
    super(shared);
    this.sections = new GetterSections(shared);
    this.sectionName = sectionName;
    this.feId = feId;
  }
  get constructorProps(): SectionSelfGettersProps<SN> {
    return {
      shared: this.shared,
      ...this.feInfo,
    };
  }
  get meta() {
    return this.section.meta;
  }
  get dbId(): string {
    return this.section.dbId;
  }
  get feInfo(): FeSectionInfo<SN> {
    return {
      feId: this.feId,
      sectionName: this.sectionName,
    };
  }
  childSections<CN extends ChildName<SN>>(childName: CN): FeSectionI<CN>[] {
    const ids = this.section.childFeIds(childName);
    return ids.map((feId) =>
      this.sections.section({ sectionName: childName, feId })
    );
  }

  get section(): FeSectionI<SN> {
    return this.sections.one(this.feInfo);
  }
  get varbs(): FeVarbsI<SN> {
    return this.section.varbs;
  }
  varb(varbName: string): FeVarb {
    return this.varbs.one(varbName);
  }
  value<VT extends ValueTypeName | "any">(
    varbName: string,
    valueType: VT
  ): ValueTypesPlusAny[VT] {
    return this.varb(varbName).value(valueType);
  }

  get selfAndDescendantFeIds(): SelfAndDescendantIds<SN> {
    const { feId, sectionName } = this.section;
    const descendantIds = this.descendantFeIds();
    return {
      [sectionName]: [feId] as string[],
      ...descendantIds,
    } as SelfAndDescendantIds<SN>;
  }
  get selfAndDescendantSectionInfos() {
    const feIds = this.selfAndDescendantFeIds;
    return Obj.keys(feIds).reduce((feSectionInfos, sectionName) => {
      const sectionInfos = feIds[sectionName].map(
        (feId) =>
          ({
            sectionName,
            feId,
          } as FeSectionInfo)
      );
      return feSectionInfos.concat(...sectionInfos);
    }, [] as FeSectionInfo[]);
  }
  get selfAndDescendantVarbInfos() {
    const sectionInfos = this.selfAndDescendantSectionInfos;
    return sectionInfos.reduce((feVarbInfos, sectionInfo) => {
      const section = this.sections.section(sectionInfo);
      return feVarbInfos.concat(...section.varbs.infos);
    }, [] as FeVarbInfo[]);
  }
  descendantFeIds(): DescendantIds<SN> {
    const descendantIds: { [key: string]: string[] } = {};

    const queue: FeSectionInfo[] = [this.feInfo];
    while (queue.length > 0) {
      const queueLength = queue.length;
      for (let i = 0; i < queueLength; i++) {
        const feInfo = queue.shift();
        if (!feInfo) throw new Error("There should always be an feInfo here.");

        const section = this.sections.one(feInfo);
        for (const childName of section.meta.childNames) {
          if (!(childName in descendantIds)) descendantIds[childName] = [];

          section.childFeIds(childName).forEach((feId) => {
            if (!descendantIds[childName].includes(feId)) {
              descendantIds[childName].push(feId);
            }
          });
          queue.push(...section.childInfos(childName));
        }
      }
    }
    return descendantIds as any;
  }
  firstDescendantSection<DN extends DescendantName<SN>>(
    descendantName: DN
  ): FeSectionI<DN> {
    const feId = this.firstDescendantFeId(descendantName);
    return this.sections.one({ sectionName: descendantName, feId });
  }
  firstDescendantFeId<DN extends DescendantName<SN>>(
    descendantName: DN
  ): string {
    const descendantFeIds = this.descendantFeIds();
    const firstId = descendantFeIds[descendantName][0];
    if (firstId) return firstId;
    else
      throw new Error(
        `No feId was found with descendantName ${descendantName} and parentName ${this.sectionName}.`
      );
  }
  allChildDbIds(): ChildIdArrs<SN> {
    const { allChildFeIds } = this.section;
    return Obj.entries(allChildFeIds).reduce(
      (childDbIds, [sectionName, idArr]) => {
        const dbIds = idArr.map(
          (feId) => this.sections.one({ sectionName, feId }).dbId
        );
        childDbIds[sectionName] = dbIds;
        return childDbIds;
      },
      {} as ChildIdArrs<SN>
    );
  }
  parent(): FeSectionI<ParentNameSafe<SN>> {
    const { feParentInfo } = this.section;
    if (feParentInfo.sectionName === "no parent")
      throw new Error(
        `Section with sectionName ${this.sectionName} has no parent.`
      );
    return this.sections.one(feParentInfo as FeSectionInfo<ParentNameSafe<SN>>);
  }
}
