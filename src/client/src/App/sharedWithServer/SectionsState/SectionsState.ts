import { sectionMetas } from "../SectionMetas";
import { SimpleSectionName } from "../SectionsMeta/baseSections";
import { SectionFinder } from "../SectionsMeta/baseSectionTypes";
import {
  FeInfoByType,
  InfoS,
  VarbInfo,
  VarbValueInfo,
} from "../SectionsMeta/Info";
import {
  FeNameInfo,
  SpecificSectionInfo,
} from "../SectionsMeta/relSections/rel/relVarbInfoTypes";
import {
  ChildIdArrs,
  ChildName,
  DescendantIds,
  DescendantName,
  SelfAndDescendantIds,
} from "../SectionsMeta/relSectionTypes/ChildTypes";
import {
  ParentFeInfo,
  ParentFinder,
  ParentName,
  SectionFinderForParent,
} from "../SectionsMeta/relSectionTypes/ParentTypes";
import { SectionName, sectionNameS } from "../SectionsMeta/SectionName";
import { Obj } from "../utils/Obj";
import { FeSectionI } from "./FeSection";
import FeVarb from "./FeSection/FeVarb";
import { FeVarbsI } from "./FeSection/FeVarbs";
import { SectionList } from "./SectionList";

export type SectionsStateCore = {
  readonly [SN in SimpleSectionName]: SectionList<SN>;
};

export class FeSections {
  constructor(readonly core: SectionsStateCore) {}
  get meta() {
    return sectionMetas;
  }
  static initCore(): SectionsStateCore {
    return sectionNameS.arrs.all.reduce((core, sectionName) => {
      core[sectionName] = new SectionList({
        sectionName,
        list: [],
      }) as any;
      return core;
    }, {} as { -readonly [SN in keyof SectionsStateCore]: SectionsStateCore[SN] });
  }

  get sections(): FeSections {
    return this;
  }
  list<SN extends SimpleSectionName>(sectionName: SN): SectionList<SN> {
    return this.core[sectionName] as any;
  }
  get mainFeInfo() {
    return this.list("main").first.feInfo;
  }
  sectionNext<SN extends SimpleSectionName>({
    sectionName,
    feId,
  }: FeInfoByType<SN>): FeSectionI<SN> {
    return this.list(sectionName as SN).getByFeId(feId);
  }
  get oneNext() {
    return this.sectionNext;
  }
  section<SN extends SimpleSectionName>(
    finder: Extract<SN, SectionName<"alwaysOne">> | SpecificSectionInfo<SN>
  ): FeSectionI<SN> {
    if (sectionNameS.is(finder, "alwaysOne")) {
      return this.list(finder as SN).first;
    } else {
      const { sectionName, ...idInfo } = finder as SpecificSectionInfo<SN>;
      return this.list(sectionName as SN).getSpecific(idInfo) as FeSectionI<SN>;
    }
  }
  varbs<SN extends SimpleSectionName>(info: FeInfoByType<SN>): FeVarbsI<SN> {
    return this.sectionNext(info).varbs;
  }
  varb({ varbName, ...info }: VarbInfo): FeVarb {
    return this.varbs(info).one(varbName);
  }
  get one() {
    return this.section;
  }
  hasOne({ sectionName, feId }: FeInfoByType): boolean {
    return this.list(sectionName).has(InfoS.fe(sectionName, feId));
  }

  static init() {
    return new FeSections(FeSections.initCore());
  }

  // now, does this belong on sections or fullSection?

  // now, what about these?
  selfAndDescendantFeIds<SN extends SectionName>(
    finder: SectionFinder<SN>
  ): SelfAndDescendantIds<SN> {
    const { feId, sectionName } = this.section(finder);
    const descendantIds = this.descendantFeIds(finder);
    return {
      [sectionName]: [feId] as string[],
      ...descendantIds,
    } as SelfAndDescendantIds<SN>;
  }
  firstDescendant<SN extends SectionName, DN extends DescendantName<SN>>(
    feInfo: FeNameInfo<SN>,
    descendantName: DN
  ) {
    const feId = this.firstDescendantFeId(feInfo, descendantName);
    return this.section(InfoS.fe(descendantName, feId));
  }
  firstDescendantFeId<SN extends SectionName, DN extends DescendantName<SN>>(
    feInfo: FeNameInfo<SN>,
    descendantName: DN
  ): string {
    const descendantFeIds = this.descendantFeIds(feInfo);
    const firstId = descendantFeIds[descendantName][0];
    if (firstId) return firstId;
    else
      throw new Error(
        `No feId was found with descendantName ${descendantName} and parentName ${feInfo.sectionName}.`
      );
  }
  // this is needed in descendantAdder, ect

  // I can make something calld focalSectionGetters.
  // or I can leave these here.
  descendantFeIds<SN extends SectionName>(
    headSectionFinder: SectionFinder<SN>
  ): DescendantIds<SN> {
    const descendantIds: { [key: string]: string[] } = {};

    const queue: SectionFinder[] = [headSectionFinder];
    while (queue.length > 0) {
      const queueLength = queue.length;
      for (let i = 0; i < queueLength; i++) {
        const sectionFinder = queue.shift();
        if (!sectionFinder)
          throw new Error("There should always be an feInfo here.");

        const section = this.section(sectionFinder);
        for (const childName of section.meta.childNames) {
          if (!(childName in descendantIds)) descendantIds[childName] = [];

          section.childFeIds(childName).forEach((feId) => {
            if (!descendantIds[childName].includes(feId)) {
              descendantIds[childName].push(feId);
            }
          });
          queue.push(...section.childFeInfos(childName));
        }
      }
    }
    return descendantIds as any;
  }
  allChildDbIds<S extends SectionName>(
    finder: SectionFinder<S>
  ): ChildIdArrs<S> {
    const allChildFeIds = this.section(finder)
      .allChildFeIds as any as ChildIdArrs<S>;
    return Obj.entries(allChildFeIds).reduce(
      (childDbIds, [sectionName, idArr]) => {
        const dbIds = idArr.map(
          (id) => this.section(InfoS.fe(sectionName, id)).dbId
        );
        childDbIds[sectionName as ChildName<S>] = dbIds;
        return childDbIds;
      },
      {} as ChildIdArrs<S>
    );
  }

  parent<SN extends SectionName<"hasParent">>(
    finder: SectionFinderForParent<SN>
  ): FeSectionI<ParentName<SN>> {
    if (sectionNameS.is(finder, "hasOneParent")) {
      const parentName = this.meta.parentName(finder);
      return this.section(parentName as any) as FeSectionI<ParentName<SN>>;
    } else {
      const { parentInfo } = this.section(finder as SectionFinder<SN>);
      return this.section(parentInfo as FeNameInfo<ParentName<SN>>);
    }
  }
  parentFinderToInfo<SN extends SectionName<"hasParent">>(
    parentFinder: ParentFinder<SN>,
    _sectionName?: SN
  ): ParentFeInfo<SN> {
    if (sectionNameS.is(parentFinder, "alwaysOne")) {
      const { feInfo } = this.section(
        parentFinder as SectionFinder<ParentName<SN>>
      );
      return feInfo as ParentFeInfo<SN>;
    }
    if (typeof parentFinder !== "string") {
      return parentFinder as ParentFeInfo<SN>;
    }

    throw new Error(`invalid parentFinder: ${JSON.stringify(parentFinder)}`);
  }
  updateSection(nextSection: FeSectionI<SimpleSectionName>): FeSections {
    const { sectionName } = nextSection;
    return this.updateList(this.list(sectionName).replace(nextSection));
  }
  updateList(nextList: SectionList): FeSections {
    return this.updateLists({
      [nextList.sectionName]: nextList,
    });
  }
  updateLists(partial: Partial<SectionsStateCore>): FeSections {
    return new FeSections({
      ...this.core,
      ...partial,
    });
  }
  updateVarb(nextVarb: FeVarb): FeSections {
    return this.updateSection(
      this.sectionNext(nextVarb.info).updateVarb(nextVarb)
    );
  }
  updateValueByEditor({ value, ...varbInfo }: VarbValueInfo): FeSections {
    return this.updateVarb(this.varb(varbInfo).updateValue(value));
  }
  updateValueDirectly({ value, ...varbInfo }: VarbValueInfo): FeSections {
    const varb = this.varb(varbInfo);
    const nextVarb = varb.updateValue(value);
    return this.updateVarb(nextVarb.triggerEditorUpdate());
  }
}

function _test(feSections: FeSections) {
  const _sectionTest1 = feSections.section(
    "propertyGeneral" as SectionFinder<"propertyGeneral" | "financing">
  );
  _sectionTest1.childFeIds("property");

  const _sectionTest2 = feSections.section("propertyGeneral");
  _sectionTest2.childFeIds("property");
  const _sectionTest3 = feSections.section(
    "propertyGeneral" as any as FeNameInfo<"propertyGeneral">
  );
  _sectionTest3.childFeIds("property");
  //@ts-expect-error
  const _sectionTest4 = feSections.section("property");

  const _parentTest1 = feSections.parent(
    "property" as SectionFinderForParent<DescendantName<"propertyGeneral">>
  );
  const _parentTest2 = feSections.parent("property");
  _parentTest2.childFeIds("property");
}
