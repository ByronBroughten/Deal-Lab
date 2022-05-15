import Analyzer from "../../../Analyzer";
import { switchNames } from "../../../SectionsMeta/baseSections/switchNames";
import { SectionFinder } from "../../../SectionsMeta/baseSectionTypes";
import {
  FeNameInfo,
  FeVarbInfo,
  InRelVarbInfo,
  LocalRelVarbInfo,
  MultiFindByFocalVarbInfo,
  MultiVarbInfo,
  RelVarbInfo,
  SpecificSectionInfo,
  SpecificVarbInfo,
} from "../../../SectionsMeta/relSections/rel/relVarbInfoTypes";
import { SwitchVarbNames } from "../../../SectionsMeta/relSections/rel/relVarbs/preSwitchVarbs";
import { UpdateFnProps } from "../../../SectionsMeta/relSections/rel/relVarbTypes";
import { UpdateFnName } from "../../../SectionsMeta/relSections/rel/valueMetaTypes";
import { SectionName } from "../../../SectionsMeta/SectionName";
import {
  isDefaultOutPack,
  isSwitchOutPack,
  OutUpdatePack,
} from "../../../SectionsMeta/VarbMeta";
import StateVarb, {
  Adornments,
  InVarbInfo,
} from "../../StateSection/StateVarb";

export function varb(
  this: Analyzer,
  { varbName, ...feInfo }: SpecificVarbInfo
): StateVarb {
  return this.section(feInfo).varb(varbName);
}
export function staticVarb(
  this: Analyzer,
  sectionName: SectionName<"alwaysOne">,
  varbName: string
) {
  return this.singleSection(sectionName).varb(varbName);
}
export function feVarb(
  this: Analyzer,
  varbName: string,
  feInfo: SectionFinder
) {
  return this.section(feInfo).varb(varbName);
}
export function updateVarb(this: Analyzer, nextVarb: StateVarb): Analyzer {
  return this.updateSection(
    this.section(nextVarb.feInfo).replaceVarb(nextVarb)
  );
}
export function displayVarb(
  this: Analyzer,
  varbName: string,
  feInfo: SpecificSectionInfo,
  adornments?: Partial<Adornments>
): string {
  return this.section(feInfo).varb(varbName).displayVarb(adornments);
}

export function varbByFocal(
  this: Analyzer,
  focalInfo: SpecificSectionInfo,
  { varbName, ...feInfo }: MultiFindByFocalVarbInfo
): StateVarb {
  const section = this.sectionByFocal(focalInfo, feInfo);
  return section.varb(varbName);
}
export function varbsByFocal(
  this: Analyzer,
  focalInfo: SpecificSectionInfo,
  { varbName, ...feInfo }: MultiVarbInfo
): StateVarb[] {
  const sections = this.sectionsByFocal(focalInfo, feInfo);
  return sections.map((section) => section.varb(varbName));
}

export function switchIsActive(
  this: Analyzer,
  focalInfo: SpecificVarbInfo,
  relSwitchInfo: LocalRelVarbInfo,
  switchValue: string
): boolean {
  return (
    switchValue === this.varbByFocal(focalInfo, relSwitchInfo).value("string")
  );
}
export function varbSwitchIsActive(
  this: Analyzer,
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
type InUpdatePack = {
  // it would be nice to standardize updateFnProps for this.
  updateFnName: UpdateFnName;
  updateFnProps: UpdateFnProps;
  inVarbInfos: InRelVarbInfo[];
};
export function inUpdatePack(
  this: Analyzer,
  feVarbInfo: SpecificVarbInfo
): InUpdatePack {
  // do I get the inSwitchUpdateFnProps, too?
  // I guess so. I think this is the place to do it.
  const varb = this.varb(feVarbInfo);
  const {
    inSwitchUpdatePacks,
    defaultUpdateFnName,
    defaultInUpdateFnInfos,
    defaultUpdateFnProps,
  } = varb.meta;
  for (const pack of inSwitchUpdatePacks) {
    const {
      switchInfo,
      switchValue,
      updateFnName,
      inUpdateInfos,
      updateFnProps,
    } = pack;
    if (this.switchIsActive(feVarbInfo, switchInfo, switchValue))
      return { updateFnName, updateFnProps, inVarbInfos: inUpdateInfos };
  }
  return {
    updateFnName: defaultUpdateFnName,
    updateFnProps: defaultUpdateFnProps,
    inVarbInfos: defaultInUpdateFnInfos,
  };
}
export function updateFnProps(
  this: Analyzer,
  feVarbInfo: FeVarbInfo
): UpdateFnProps {
  return this.inUpdatePack(feVarbInfo).updateFnProps;
}
export function updateFnName(
  this: Analyzer,
  feVarbInfo: FeVarbInfo
): UpdateFnName {
  return this.inUpdatePack(feVarbInfo).updateFnName;
}
export function relativeInVarbInfos(
  this: Analyzer,
  feVarbInfo: SpecificVarbInfo
): RelVarbInfo[] {
  return this.inUpdatePack(feVarbInfo).inVarbInfos;
}
export function inVarbInfos<
  S extends SectionName<"hasVarb"> = SectionName<"hasVarb">
>(this: Analyzer, feVarbInfo: SpecificVarbInfo<S>): InVarbInfo[] {
  const statics = this.relativeInVarbInfos(feVarbInfo);
  let inVarbInfos = statics.reduce((feInfos, relInfo) => {
    const { varbName, ...feInfo } = feVarbInfo;
    const test = feInfo.sectionName;
    return feInfos.concat(this.varbInfosByFocal(feInfo, relInfo));
  }, [] as InVarbInfo[]);
  const inEntities = this.varb(feVarbInfo).inEntities;
  return inVarbInfos.concat(inEntities);
}
export function outVarbInfos(
  this: Analyzer,
  feVarbInfo: FeVarbInfo
): FeVarbInfo[] {
  const { outEntities, outUpdatePacks } = this.varb(feVarbInfo);
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
export function replaceVarb(this: Analyzer, nextVarb: StateVarb): Analyzer {
  const { feInfo } = nextVarb;
  const nextSection = this.section(feInfo).replaceVarb(nextVarb);
  return this.updateSection(nextSection);
}

export function switchedVarbName(
  this: Analyzer,
  feInfo: FeNameInfo,
  varbNames: SwitchVarbNames
): string {
  const switchValue = this.feValue(varbNames.switch, feInfo, "string");
  return varbNames[switchValue];
}
export function switchedVarb(
  this: Analyzer,
  feInfo: FeNameInfo,
  varbNames: SwitchVarbNames
): StateVarb {
  const switchedVarbName = this.switchedVarbName(feInfo, varbNames);
  return this.section(feInfo).varb(switchedVarbName);
}
export function switchedOngoingVarbName(
  this: Analyzer,
  feInfo: FeNameInfo,
  varbNameBase: string
): string {
  const varbNames = switchNames(varbNameBase, "ongoing");
  return this.switchedVarbName(feInfo, varbNames);
}
export function switchedOngoingVarb(
  this: Analyzer,
  varbNameBase: string,
  feInfo: FeNameInfo
): StateVarb {
  const varbNames = switchNames(varbNameBase, "ongoing");
  return this.switchedVarb(feInfo, varbNames);
}
export function switchedOngoingDisplayVarb(
  this: Analyzer,
  varbNameBase: string,
  feInfo: FeNameInfo
) {
  return this.switchedOngoingVarb(varbNameBase, feInfo).displayVarb();
}
