import Analyzer from "../../Analyzer";
import {
  ChildIdArrs,
  ChildName,
  ParentName,
} from "../SectionMetas/relSectionTypes";
import { sectionMetas } from "../SectionMetas";
import StateSection, { StateSectionCore } from "../StateSection";
import { FeInfo, Inf } from "../SectionMetas/Info";
import {
  FeNameInfo,
  FeVarbInfo,
  MultiSectionInfo,
  MultiFindByFocalInfo,
  SpecificSectionInfo,
} from "../SectionMetas/relSections/rel/relVarbInfoTypes";
import { SectionNam, SectionName } from "../SectionMetas/SectionName";

export function sectionNotFound({ sectionName, idType, id }: MultiSectionInfo) {
  return new Error(
    `There is no section with name ${sectionName} and ${idType} ${id}`
  );
}

export function section<S extends SectionName<"alwaysOne">>(
  this: Analyzer,
  finder: S
): StateSection<S>;
export function section<I extends SpecificSectionInfo>(
  this: Analyzer,
  finder: I
): StateSection<I["sectionName"]>;
export function section<
  S extends SectionName<"alwaysOne">,
  I extends SpecificSectionInfo
>(
  this: Analyzer, // you have to specify the union overload.
  finder: S | I
): StateSection<S | I["sectionName"]>;
export function section(
  this: Analyzer,
  finder: SectionName<"alwaysOne"> | SpecificSectionInfo
) {
  if (typeof finder === "string") return this.singleSection(finder);
  const section = this.findSection(finder);
  if (section) return section;
  else {
    throw new Error(`Section not found using: ${JSON.stringify(finder)}`);
  }
}
export function singleSection<S extends SectionName<"alwaysOne">>(
  this: Analyzer,
  sectionName: S
): StateSection<S> {
  if (this.meta.get(sectionName).alwaysOne)
    return this.firstSection(sectionName);
  else throw new Error(`"${sectionName}" is not a static section.`);
}
export function firstSection<S extends SectionName>(
  this: Analyzer,
  sectionName: S
): StateSection<S> {
  const section = Object.values(
    this.sections[sectionName]
  )[0] as StateSection<S>;
  if (!section) {
    throw new Error(`Section with name '${sectionName}' has no entries.`);
  }
  return section;
}
export function lastSection(this: Analyzer, sectionName: SectionName) {
  const sectionArr = Object.values(this.sections[sectionName]);
  const section = sectionArr[sectionArr.length - 1];
  if (!section) {
    throw new Error(`Section with name '${sectionName}' has no entries.`);
  }
  return section;
}
// Do I update the infos and whatnot to require a sectionName?
// I'm leaning towards yes.
export function sectionByFocal<I extends MultiFindByFocalInfo>(
  this: Analyzer,
  focalInfo: SpecificSectionInfo,
  info: I
): StateSection<I["sectionName"]> {
  const section = this.findSectionByFocal(focalInfo, info);
  if (section) return section;
  else throw sectionNotFound(info);
}
export function sectionsByFocal<I extends MultiSectionInfo>(
  this: Analyzer,
  focalInfo: SpecificSectionInfo,
  info: I
): StateSection<I["sectionName"]>[] {
  const sections = this.findSectionsByFocal(focalInfo, info);
  if (sections) return sections;
  else throw sectionNotFound(info);
}

export function updateSection<I extends FeNameInfo>(
  this: Analyzer,
  feInfo: I,
  nextBaseProps: Partial<StateSectionCore<I["sectionName"]>>
): Analyzer {
  const section = this.section(feInfo);
  const nextSection = section.update(nextBaseProps);
  return this.replaceInSectionArr(nextSection);
}
export function hasSection(this: Analyzer, info: SpecificSectionInfo): boolean {
  return this.findSection(info) !== undefined;
}
export function sectionIsIndexSaved(
  this: Analyzer,
  feInfo: FeInfo<"hasIndexStore">
): boolean {
  const { dbId, indexStoreName } = this.section(feInfo);
  return this.hasSection(Inf.db(indexStoreName, dbId));
}
export function sectionOutFeVarbInfos(
  this: Analyzer,
  feInfo: FeNameInfo
): FeVarbInfo[] {
  let outVarbInfos: FeVarbInfo[] = [];
  for (const varbName in this.section(feInfo).varbs) {
    outVarbInfos = outVarbInfos.concat(
      this.outVarbInfos(Inf.feVarb(varbName, feInfo))
    );
  }
  return outVarbInfos;
}

export function parent<S extends SectionName<"hasOneParent">>(
  finder: S
): StateSection<ParentName<S>>;
export function parent<I extends SpecificSectionInfo<SectionName<"hasParent">>>(
  finder: I
): StateSection<ParentName<I["sectionName"]>>;
export function parent<
  S extends SectionName<"hasOneParent">,
  I extends SpecificSectionInfo<SectionName<"hasParent">>
>(finder: S | I): StateSection<S | ParentName<I["sectionName"]>>;
export function parent(
  this: Analyzer,
  finder:
    | SectionName<"hasOneParent">
    | SpecificSectionInfo<SectionName<"hasParent">>
) {
  if (SectionNam.is(finder, "hasOneParent")) {
    const parentName = sectionMetas.parentName(finder);
    return this.section(parentName);
  } else {
    const { parentInfo } = this.section(finder);
    return this.section(parentInfo);
  }
}

export function allChildFeIds<F extends SectionName<"alwaysOne">>(
  finder: F
): ChildIdArrs<F>;
export function allChildFeIds<F extends FeNameInfo>(
  finder: F
): ChildIdArrs<F["sectionName"]>;
export function allChildFeIds<F extends FeNameInfo | SectionName<"alwaysOne">>(
  this: Analyzer,
  finder: F
): any {
  const section = this.section(finder);
  return section.allChildFeIds();
}

export function childFeIds<
  I extends SpecificSectionInfo,
  S extends SectionName<"alwaysOne">
>(
  this: Analyzer,
  [finder, childName]: [I, ChildName<I["sectionName"]>] | [S, ChildName<S>]
) {
  const section = this.section(finder);
  return section.childFeIds(childName);
}
export function childFeInfos<
  I extends SpecificSectionInfo,
  S extends SectionName<"alwaysOne">
>(
  this: Analyzer,
  params: [I, ChildName<I["sectionName"]>] | [S, ChildName<S>]
): FeInfo[] {
  const [_, childName] = params;
  const childFeIds = this.childFeIds(params);

  return childFeIds.map((id) => ({
    sectionName: childName,
    id,
    idType: "feId",
  })) as FeInfo[];
}
export function children<S extends SectionName<"hasChild">>(
  this: Analyzer,
  focalInfo: FeNameInfo<S> | SectionName<"alwaysOne">,
  childName: ChildName<S>
): StateSection<ChildName<S>>[] {
  const section = this.section(focalInfo);
  const childFeIds = section.childFeIds(childName);
  return childFeIds.map((id) =>
    this.section({ id, sectionName: childName, idType: "feId" })
  );
}
