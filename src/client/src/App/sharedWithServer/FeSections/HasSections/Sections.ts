import { sectionMetas } from "../../SectionMetas";
import { SimpleSectionName } from "../../SectionMetas/baseSections";
import { SectionFinder } from "../../SectionMetas/baseSectionTypes";
import { InfoS } from "../../SectionMetas/Info";
import {
  FeNameInfo,
  SpecificSectionInfo,
} from "../../SectionMetas/relSections/rel/relVarbInfoTypes";
import {
  ChildIdArrs,
  ChildName,
  DescendantIds,
  DescendantName,
  SelfAndDescendantIds,
} from "../../SectionMetas/relSectionTypes/ChildTypes";
import {
  FeParentInfo,
  ParentFinder,
  ParentName,
  SectionFinderForParent,
} from "../../SectionMetas/relSectionTypes/ParentTypes";
import { SectionName, sectionNameS } from "../../SectionMetas/SectionName";
import { Obj } from "../../utils/Obj";
import FeSection from "../FeSection";
import { SectionList } from "../SectionList";

export type HasSections = {
  sections: FeSections;
};

export class HasSharableSections {
  constructor(readonly core: HasSections = { sections: FeSections.init() }) {}
  get sections() {
    return this.core.sections;
  }
  set sections(sections: FeSections) {
    this.core.sections = sections;
  }
}

type Core = {
  [SN in SimpleSectionName]: SectionList<SN>;
};

export class FeSections {
  constructor(readonly core: Core) {}
  static initCore(): Core {
    return sectionNameS.arrs.all.reduce((core, sectionName) => {
      core[sectionName] = new SectionList({
        sectionName,
        list: [],
      }) as any;
      return core;
    }, {} as Core);
  }
  static init() {
    return new FeSections(FeSections.initCore());
  }
  get meta() {
    return sectionMetas;
  }
  list<SN extends SimpleSectionName>(sectionName: SN): SectionList<SN> {
    return this.core[sectionName] as any;
  }
  get mainFeInfo() {
    return this.list("main").first.feInfo;
  }
  section<SN extends SimpleSectionName>(
    finder: Extract<SN, SectionName<"alwaysOne">> | SpecificSectionInfo<SN>
  ): FeSection<SN> {
    if (sectionNameS.is(finder, "alwaysOne")) {
      return this.list(finder as SN).first;
    } else {
      const { sectionName, ...idInfo } = finder as SpecificSectionInfo<SN>;
      return this.list(sectionName as SN).getSpecific(idInfo) as FeSection<SN>;
    }
  }
  get one() {
    return this.section;
  }
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
        for (const childName of section.childNames) {
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
  ): FeSection<ParentName<SN>> {
    if (sectionNameS.is(finder, "hasOneParent")) {
      const parentName = this.meta.parentName(finder);
      return this.section(parentName as any) as FeSection<ParentName<SN>>;
    } else {
      const { parentInfo } = this.section(finder as SectionFinder<SN>);
      return this.section(parentInfo as FeNameInfo<ParentName<SN>>);
    }
  }
  parentFinderToInfo<SN extends SectionName<"hasParent">>(
    parentFinder: ParentFinder<SN>,
    _sectionName?: SN
  ): FeParentInfo<SN> {
    if (sectionNameS.is(parentFinder, "alwaysOne")) {
      const { feInfo } = this.section(
        parentFinder as SectionFinder<ParentName<SN>>
      );
      return feInfo as FeParentInfo<SN>;
    }
    if (typeof parentFinder !== "string") {
      return parentFinder as FeParentInfo<SN>;
    }

    throw new Error(`invalid parentFinder: ${JSON.stringify(parentFinder)}`);
  }
  updateSection(nextSection: FeSection<SimpleSectionName>): FeSections {
    const { sectionName } = nextSection;
    return this.updateList(this.list(sectionName).replace(nextSection));
  }
  updateList(nextList: SectionList): FeSections {
    return this.updateLists({
      [nextList.sectionName]: nextList,
    });
  }
  updateLists(partial: Partial<Core>): FeSections {
    return new FeSections({
      ...this.core,
      ...partial,
    });
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
