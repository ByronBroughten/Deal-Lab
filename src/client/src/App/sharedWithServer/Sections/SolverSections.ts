import tsort from "../Analyzer/methods/solveVarbs/tsort/tsort";
import { InfoS } from "../SectionsMeta/Info";
import {
  FeNameInfo,
  FeVarbInfo,
  LocalRelVarbInfo,
  MultiFindByFocalInfo,
  MultiFindByFocalVarbInfo,
  MultiSectionInfo,
  MultiVarbInfo,
  RelVarbInfo,
  SpecificSectionInfo,
  SpecificVarbInfo,
} from "../SectionsMeta/relSections/rel/relVarbInfoTypes";
import { SectionName } from "../SectionsMeta/SectionName";
import {
  isDefaultOutPack,
  isSwitchOutPack,
  OutUpdatePack,
} from "../SectionsMeta/VarbMeta";
import { FeSectionI } from "../SectionsState/FeSection";
import FeVarb from "../SectionsState/FeSection/FeVarb";
import { Arr } from "../utils/Arr";
import { SharedSections } from "./HasSharedSections";
import { UpdaterSections } from "./UpdaterSections";

interface SolverSharedProps extends SharedSections {
  varbFullNamesToSolveFor?: Set<string>;
}
interface SolverShared extends SolverSharedProps {
  varbFullNamesToSolveFor: Set<string>;
}

type OutVarbMap = Record<string, Set<string>>;

export class SolverSections extends UpdaterSections {
  readonly shared: SolverShared;
  constructor({
    varbFullNamesToSolveFor = new Set(),
    ...rest
  }: SolverSharedProps) {
    super(rest);
    this.shared = {
      varbFullNamesToSolveFor,
      ...rest,
    };
  }

  private resetVarbFullNamesToSolveFor() {
    this.shared.varbFullNamesToSolveFor = new Set();
  }

  get varbFullNamesToSolveFor(): Set<string> {
    return this.shared.varbFullNamesToSolveFor;
  }

  solve() {
    const orderedInfos = this.gatherAndSortInfosToSolve();
    for (const { varbName, ...info } of orderedInfos) {
      // here, make a focalVarb and have it solve itself
      this.solveAndUpdateValue(info);
    }
    this.resetVarbFullNamesToSolveFor();
  }

  private gatherAndSortInfosToSolve(): FeVarbInfo[] {
    const { edges, loneVarbs } = this.getDagEdgesAndLoneVarbs();
    let solveOrder = tsort(edges);
    solveOrder = solveOrder.concat(loneVarbs);
    return solveOrder.map((stringInfo) =>
      FeVarb.fullNameToFeVarbInfo(stringInfo)
    );
  }

  private getDagEdgesAndLoneVarbs() {
    const outVarbMap = this.getOutVarbMap();
    const edges: [string, string][] = [];
    const loneVarbs = Object.keys(outVarbMap).filter(
      (k) => outVarbMap[k].size === 0
    );
    for (const [stringInfo, outStrings] of Object.entries(outVarbMap)) {
      for (const outString of outStrings) {
        if (loneVarbs.includes(outString))
          Arr.rmFirstValueMutate(loneVarbs, outString);
        edges.push([stringInfo, outString]);
      }
    }
    return { edges, loneVarbs };
  }

  private getOutVarbMap(): OutVarbMap {
    const outVarbMap: OutVarbMap = {};
    let varbFullNamesToSolveFor = [...this.varbFullNamesToSolveFor];
    while (varbFullNamesToSolveFor.length > 0) {
      const nextVarbsToSolveFor = [] as string[];
      for (const stringInfo of [...this.varbFullNamesToSolveFor]) {
        if (!(stringInfo in outVarbMap)) outVarbMap[stringInfo] = new Set();
        const feVarbInfo = FeVarb.fullNameToFeVarbInfo(stringInfo);
        const outInfos = this.outVarbInfos(feVarbInfo);
        const outFullNames = outInfos.map((info) =>
          FeVarb.feVarbInfoToFullName(info)
        );
        outFullNames.forEach((fullName) =>
          outVarbMap[stringInfo].add(fullName)
        );
        nextVarbsToSolveFor.push(...outFullNames);
      }
      varbFullNamesToSolveFor = nextVarbsToSolveFor;
    }
    return outVarbMap;
  }
  private outVarbInfos(feVarbInfo: FeVarbInfo): FeVarbInfo[] {
    const { outEntities, outUpdatePacks } = this.varbByMixed(feVarbInfo);
    return [
      ...outEntities,
      ...outUpdatePacks.reduce((varbInfos, outUpdatePack) => {
        const { relTargetVarbInfo } = outUpdatePack;
        const targetVarbInfos = this.relativesToFeVarbInfos(
          feVarbInfo,
          relTargetVarbInfo
        );
        for (const targetVarbInfo of targetVarbInfos) {
          if (this.varbSwitchIsActive(targetVarbInfo, outUpdatePack))
            varbInfos.push(targetVarbInfo);
        }

        return varbInfos;
      }, [] as FeVarbInfo[]),
    ];
  }
  private relativesToFeVarbInfos(
    feInfo: FeNameInfo,
    relatives: RelVarbInfo | RelVarbInfo[]
  ): FeVarbInfo[] {
    if (!Array.isArray(relatives)) relatives = [relatives];
    let feVarbInfos: FeVarbInfo[] = [];
    for (const relVarbInfo of relatives) {
      const varbs = this.varbsByFocal(feInfo, relVarbInfo);
      const varbInfos = varbs.map((varb) => varb.feVarbInfo);
      feVarbInfos = feVarbInfos.concat(varbInfos);
    }
    return feVarbInfos;
  }
  private varbSwitchIsActive(
    switchFocal: FeVarbInfo,
    outUpdatePack: OutUpdatePack
  ): boolean {
    if (isSwitchOutPack(outUpdatePack)) {
      const { switchInfo, switchValue } = outUpdatePack;
      return this.switchIsActive(switchFocal, switchInfo, switchValue);
    } else if (isDefaultOutPack(outUpdatePack)) {
      const { inverseSwitches } = outUpdatePack;
      for (const { switchInfo, switchValue } of inverseSwitches) {
        if (this.switchIsActive(switchFocal, switchInfo, switchValue))
          return false;
      }
      return true;
    } else throw new Error(`Only switch and default outpacks work here.`);
  }
  private switchIsActive(
    focalInfo: SpecificVarbInfo,
    relSwitchInfo: LocalRelVarbInfo,
    switchValue: string
  ): boolean {
    return (
      switchValue === this.varbByFocal(focalInfo, relSwitchInfo).value("string")
    );
  }
  varbByFocal(
    focalInfo: SpecificSectionInfo,
    { varbName, ...feInfo }: MultiFindByFocalVarbInfo
  ): FeVarb {
    const section = this.sectionByFocal(focalInfo, feInfo);
    return section.varb(varbName);
  }
  varbsByFocal(
    focalInfo: SpecificSectionInfo,
    { varbName, ...feInfo }: MultiVarbInfo
  ): FeVarb[] {
    const sections = this.sectionsByFocal(focalInfo, feInfo);
    return sections.map((section) => section.varb(varbName));
  }
  sectionsByFocal<SN extends SectionName>(
    focalInfo: SpecificSectionInfo,
    info: MultiSectionInfo<SN>
  ): FeSectionI<SN>[] {
    if (InfoS.is.specific(info)) {
      const section = this.sectionByMixed(info);
      return [section];
    } else if (InfoS.is.singleMulti(info)) {
      const section = this.sectionByFocal(focalInfo, info);
      return [section];
    } else {
      return this.sectionsByPluralFocal(focalInfo, info as any);
    }
  }
  sectionsByPluralFocal<SN extends SectionName>(
    focalInfo: SpecificSectionInfo,
    info: MultiFindByFocalInfo<SN>
  ): FeSectionI<SN>[] {
    switch (info.id) {
      case "all": {
        return this.list(info.sectionName).core.list as FeSectionI<SN>[];
      }
      case "children": {
        const section = this.sectionByMixed(focalInfo);
        const { sectionName } = info;
        if (section.meta.isChildName(sectionName)) {
          const childFeIds = section.childFeIds(sectionName);
          return childFeIds.map((feId) =>
            this.section({ sectionName, feId })
          ) as FeSectionI<SN>[];
        } else
          throw new Error(
            "Child info does not match any of focal section's childNames."
          );
      }
      default:
        throw new Error("Exhausted MultiSectionInfo options.");
    }
  }
  sectionByFocal<SN extends SectionName>(
    focalInfo: SpecificSectionInfo,
    info: MultiFindByFocalInfo<SN>
  ): FeSectionI<SN> {
    if (InfoS.is.specific(info)) return this.sectionByMixed(info);
    const focalSection = this.sectionByMixed(focalInfo);
    switch (info.id) {
      case "local": {
        if (focalSection.sectionName === info.sectionName) {
          return focalSection as any as FeSectionI<SN>;
        } else
          throw new Error("Local section did not match the focal section.");
      }
      case "parent": {
        const { parentInfoSafe } = focalSection;
        if (parentInfoSafe.sectionName !== info.sectionName)
          throw new Error(
            "Parent section does not match the focal section's parent."
          );
        return this.section(parentInfoSafe) as any as FeSectionI<SN>;
      }
      default:
        throw new Error("Exhausted MultiFindByFocalInfo options.");
    }
  }
}
