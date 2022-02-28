import Analyzer from "../../../Analyzer";
import { SpecificVarbInfo } from "../../SectionMetas/relSections/rel/relVarbInfoTypes";
import { SectionName } from "../../SectionMetas/SectionName";

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
