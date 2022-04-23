import { pick } from "lodash";
import Analyzer from "../../../Analyzer";
import { Inf } from "../../../SectionMetas/Info";
import {
  FeNameInfo,
  MultiFindByFocalInfo,
  MultiSectionInfo,
  MultiVarbInfo,
  SpecificSectionInfo,
  SpecificSectionsInfo,
  SpecificVarbInfo,
} from "../../../SectionMetas/relSections/rel/relVarbInfoTypes";
import { ChildName } from "../../../SectionMetas/relSectionTypes/ChildTypes";
import { SectionName } from "../../../SectionMetas/SectionName";
import StateSection from "../../StateSection";
import StateVarb from "../../StateSection/StateVarb";

export function findSectionByFeId<S extends SectionName>(
  this: Analyzer,
  { sectionName, id }: FeNameInfo<S>
): StateSection<S> | undefined {
  const sectionArr = this.sectionArr(sectionName);
  return sectionArr.find((section) => section.feId === id);
}
export function findSectionByDbId<S extends SectionName>(
  this: Analyzer,
  sectionName: S,
  dbId: string
): StateSection<S> | undefined {
  const sectionArr = this.sectionArr(sectionName);
  return sectionArr.find((section) => section.dbId === dbId);
}

function sectionToVarbOrUn<S extends SectionName>(
  sectionOrUn: StateSection<S> | undefined,
  varbName: string
) {
  if (!sectionOrUn) return sectionOrUn;
  const varbOrUn: StateVarb | undefined = sectionOrUn.varbs[varbName];
  return varbOrUn;
}

export function findFeInfo<I extends SpecificSectionInfo>(
  this: Analyzer,
  info: I
): FeNameInfo<I["sectionName"]> | undefined {
  switch (info.idType) {
    case "feId":
      return info;
    case "dbId": {
      const { sectionName } = info;
      const sections = this.findSections(info);
      if (sections.length > 1)
        throw new Error(
          `No two of sections with sectionName ${sectionName} should have the same dbId`
        );
      else if (sections.length === 0) return undefined;
      else return sections[0].feInfo;
    }
    case "relative": {
      return this.singleSection(info.sectionName).feInfo;
    }
  }
}
export function findSection<I extends SpecificSectionInfo>(
  this: Analyzer,
  info: I
): StateSection<I["sectionName"]> | undefined {
  const infoOrUn = this.findFeInfo(info);
  if (!infoOrUn) return infoOrUn;
  return this.findSectionByFeId(infoOrUn);
}

export function findSections<I extends SpecificSectionsInfo>(
  this: Analyzer,
  info: I
): StateSection<I["sectionName"]>[] {
  const { sectionName, id } = info;
  const sections = this.sectionArr(sectionName);
  if (info.idType === "relative") {
    if (["all", "static"].includes(id)) return sections;
    else throw new Error("This was designed for only all or static relInfos");
  }
  return sections.filter((section) => section[info.idType] === id);
}

export function findSectionByFocal<S extends SectionName>(
  this: Analyzer,
  focalInfo: SpecificSectionInfo,
  info: MultiFindByFocalInfo
): StateSection<S> | undefined {
  const feInfoOrUn = this.findFeInfoByFocal(focalInfo, info);
  if (!feInfoOrUn) return feInfoOrUn;
  return this.findSection(feInfoOrUn as FeNameInfo<S>);
}
export function findVarb(
  this: Analyzer,
  { varbName, ...info }: SpecificVarbInfo
): StateVarb | undefined {
  const sectionOrUn = this.findSection(info);
  return sectionToVarbOrUn(sectionOrUn, varbName);
}

export function findFeInfoByFocal(
  this: Analyzer,
  focalInfo: SpecificSectionInfo,
  info: MultiFindByFocalInfo
): FeNameInfo | undefined {
  if (Inf.is.specific(info)) return this.findFeInfo(info);
  switch (info.id) {
    case "local":
      return this.findFeInfo(focalInfo);
    case "parent":
      return this.findSection(focalInfo)?.parentInfoSafe;
    default:
      throw new Error("Exhausted MultiFindByFocalInfo options.");
  }
}

export function findVarbByFocal(
  this: Analyzer,
  { varbName, ...focalInfo }: SpecificVarbInfo,
  info: MultiFindByFocalInfo
): StateVarb | undefined {
  const sectionOrUn = this.findSectionByFocal(focalInfo, info);
  return sectionToVarbOrUn(sectionOrUn, varbName);
}

export function findFeInfosByFocal<I extends MultiSectionInfo>(
  this: Analyzer,
  focalInfo: SpecificSectionInfo, // this protects against focal varbInfos
  info: I
): FeNameInfo<I["sectionName"]>[] | undefined {
  focalInfo = pick(focalInfo, [
    "sectionName",
    "id",
    "idType",
  ]) as SpecificSectionInfo;

  if (Inf.is.specific(info)) {
    const feInfo = this.findFeInfo(info);
    return feInfo ? [feInfo] : feInfo;
  }
  if (Inf.is.singleMulti(info)) {
    const feInfo = this.findFeInfoByFocal(focalInfo, info);
    return feInfo ? [feInfo] : feInfo;
  }

  switch (info.id) {
    case "all":
      return this.sectionArr(info.sectionName).map((section) => section.feInfo);
    case "children": {
      const focalOrUn = this.findSection(focalInfo);
      if (!focalOrUn) return focalOrUn;
      const childFeIds = focalOrUn.childFeIds(
        info.sectionName as ChildName<I["sectionName"]>
      );
      return childFeIds.map((id) => ({
        sectionName: info.sectionName,
        id,
        idType: "feId",
      }));
    }
    default:
      throw new Error("Exhausted MultiSectionInfo options.");
  }
}
export function findVarbInfosByFocal(
  this: Analyzer,
  focalInfo: SpecificSectionInfo,
  { varbName, ...relInfo }: MultiVarbInfo
) {
  const feInfosOrUn = this.findFeInfosByFocal(focalInfo, relInfo);
  if (!feInfosOrUn) return undefined;
  return feInfosOrUn.map((feInfo) => ({ ...feInfo, varbName }));
}
export function findSectionsByFocal<I extends MultiSectionInfo>(
  this: Analyzer,
  focalInfo: SpecificSectionInfo,
  info: I
): StateSection<I["sectionName"]>[] | undefined {
  const infosOrUn = this.findFeInfosByFocal(focalInfo, info);
  if (!infosOrUn) return undefined;
  const sections: StateSection<I["sectionName"]>[] = [];
  for (const info of infosOrUn) {
    const section = this.findSection(info);
    if (!section) return undefined;
    sections.push(section);
  }
  return sections;
}
export function findVarbsByFocal(
  this: Analyzer,
  focalInfo: SpecificSectionInfo,
  { varbName, ...info }: MultiVarbInfo
): StateVarb[] | undefined {
  const sectionsOrUn = this.findSectionsByFocal(focalInfo, info);
  if (!sectionsOrUn) return undefined;
  else return sectionsOrUn.map((section) => section.varb(varbName));
}
