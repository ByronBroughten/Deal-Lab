import Analyzer from "../../../Analyzer";
import StateSection from "../../StateSection";
import { FeInfo, Inf } from "../../SectionMetas/Info";
import {
  FeNameInfo,
  FeVarbInfo,
  MultiSectionInfo,
  MultiFindByFocalInfo,
  SpecificSectionInfo,
  SpecificSectionsInfo,
} from "../../SectionMetas/relSections/rel/relVarbInfoTypes";
import { SectionName } from "../../SectionMetas/SectionName";
import { Obj } from "../../../utils/Obj";

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
export function lastSection<SN extends SectionName>(
  this: Analyzer,
  sectionName: SN
): StateSection<SN> {
  const sectionArr = Obj.values(this.sections[sectionName]);
  const section = sectionArr[sectionArr.length - 1];

  // if (!StateSection.is(section, "hasParent")) {
  //   throw new Error(`Section with name '${sectionName}' has no entries.`);
  // }
  return section as any as StateSection<SN>;
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
export function hasSection(
  this: Analyzer,
  info: SpecificSectionsInfo
): boolean {
  return this.findSections(info).length !== 0;
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
