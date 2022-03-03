import {
  FeVarbInfo,
  FeNameInfo,
  LocalRelVarbInfo,
  RelVarbInfo,
  MultiVarbInfo,
  SpecificVarbInfo,
  SpecificSectionInfo,
  MultiFindByFocalVarbInfo,
  InRelVarbInfo,
} from "../../SectionMetas/relSections/rel/relVarbInfoTypes";
import Analyzer from "../../../Analyzer";
import StateVarb, {
  Adornments,
  InVarbInfo,
} from "../../StateSection/StateVarb";
import {
  isDefaultOutPack,
  isSwitchOutPack,
  OutUpdatePack,
} from "../../SectionMetas/VarbMeta";
import { SectionName } from "../../SectionMetas/SectionName";
import { UpdateFnName } from "../../SectionMetas/relSections/rel/valueMetaTypes";
import { UpdateFnProps } from "../../SectionMetas/relSections/rel/relVarb/UpdateInfoArr";
import { SwitchVarbNames } from "../../SectionMetas/relSections/rel/relVarbs/relVarbsSwitch";
import { switchVarbNames } from "../../SectionMetas/relSections/baseSections/baseSwitch";

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
  feInfo: SpecificSectionInfo
) {
  return this.section(feInfo).varb(varbName);
}
export function updateVarb(this: Analyzer, nextVarb: StateVarb): Analyzer {
  return this.replaceInSectionArr(
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

function switchIsActive(
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
    return switchIsActive(this, switchFocal, switchInfo, switchValue);
  } else if (isDefaultOutPack(outUpdatePack)) {
    const { inverseSwitches } = outUpdatePack;
    for (const { switchInfo, switchValue } of inverseSwitches) {
      if (switchIsActive(this, switchFocal, switchInfo, switchValue))
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

export function replaceVarb(this: Analyzer, nextVarb: StateVarb): Analyzer {
  const { feInfo } = nextVarb;
  const nextSection = this.section(feInfo).replaceVarb(nextVarb);
  return this.replaceInSectionArr(nextSection);
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
  const varbNames = switchVarbNames(varbNameBase, "ongoing");
  return this.switchedVarbName(feInfo, varbNames);
}
export function switchedOngoingVarb(
  this: Analyzer,
  feInfo: FeNameInfo,
  varbNameBase: string
): StateVarb {
  const varbNames = switchVarbNames(varbNameBase, "ongoing");
  return this.switchedVarb(feInfo, varbNames);
}
export function switchedOngoingDisplayVarb(
  this: Analyzer,
  varbNameBase: string,
  feInfo: FeNameInfo
) {
  return this.switchedOngoingVarb(feInfo, varbNameBase).displayVarb();
}
