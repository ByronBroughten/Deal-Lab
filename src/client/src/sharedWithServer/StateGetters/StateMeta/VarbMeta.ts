import { cloneDeep, round } from "lodash";
import {
  getBaseVarb,
  VarbName,
} from "../../stateSchemas/fromSchema3SectionStructures/baseSectionsVarbsTypes";
import { ValueName } from "../../stateSchemas/schema1ValueNames";
import { SectionName } from "../../stateSchemas/schema2SectionNames";
import { GeneralBaseVarb } from "../../stateSchemas/schema3SectionStructures/baseVarbs";
import { valueTraits } from "../../stateSchemas/schema4ValueTraits";
import { FixedInEntity } from "../../stateSchemas/schema4ValueTraits/StateValue/stateValuesShared/entities";
import { getUpdateVarb } from "../../stateSchemas/schema5VariablesLogic";
import { GeneralUpdateVarb } from "../../stateSchemas/schema5VariablesLogic/updateVarb";
import { UpdateBasics } from "../../stateSchemas/schema5VariablesLogic/updateVarb/UpdateBasics";
import { UpdateFnProps } from "../../stateSchemas/schema5VariablesLogic/updateVarb/UpdateFnProps";
import { UpdateOverrides } from "../../stateSchemas/schema5VariablesLogic/updateVarb/UpdateOverrides";
import { UpdateOverrideSwitches } from "../../stateSchemas/schema5VariablesLogic/updateVarb/UpdateOverrideSwitch";
import { getDisplayVarb } from "../../stateSchemas/schema9VariablesLabels";
import {
  DisplayName,
  DisplaySourceFinder,
} from "../../stateSchemas/schema9VariablesLabels/displayVarb";
import { VarbNames } from "../Identifiers/VarbInfoBase";
import { SectionMeta } from "./SectionMeta";
import { sectionsMeta } from "./SectionsMeta";

type Props<SN extends SectionName> = {
  varbName: string;
  sectionName: SN;
};

export class VarbMeta<SN extends SectionName> {
  varbName: string;
  sectionName: SN;
  inSwitchUpdatePacks: InSwitchUpdatePack[];
  constructor({ sectionName, varbName }: Props<SN>) {
    this.sectionName = sectionName;
    this.varbName = varbName;
    const updateVarb = getUpdateVarb(sectionName, varbName as any);
    if (!updateVarb) {
      throw new Error(`updateVarb missing at ${sectionName}.${varbName}`);
    }
    if (!Array.isArray(updateVarb.updateOverrides)) {
      throw new Error(
        `updateOverrides of ${sectionName}.${varbName} not valid`
      );
    }
    this.inSwitchUpdatePacks = updateOverrideToInfos(
      updateVarb.updateOverrides
    );
  }
  get baseVarb(): GeneralBaseVarb {
    return getBaseVarb(
      this.sectionName,
      this.varbName as VarbName<SN>
    ) as any as GeneralBaseVarb;
  }
  get displayVarb() {
    return getDisplayVarb(this.sectionName, this.varbName as VarbName<SN>);
  }
  get updateVarb(): GeneralUpdateVarb {
    return getUpdateVarb(
      this.sectionName,
      this.varbName as VarbName<SN>
    ) as any as GeneralUpdateVarb;
  }
  validateValue(value: any): true {
    this.value.validate(value);
    return true;
  }
  isVarbValueType(value: any): boolean {
    return this.value.is(value);
  }
  get sectionMeta(): SectionMeta<any> {
    return sectionsMeta.section(this.sectionName);
  }
  get value() {
    const valueMeta = valueTraits[this.valueName];
    if (valueMeta === undefined) {
      throw new Error(`There is no valueMeta of valueName ${this.valueName}`);
    } else return valueMeta;
  }
  get updateFnProps() {
    return cloneDeep(this.updateVarb.updateFnProps);
  }
  get startAdornment() {
    return this.displayVarb.startAdornment;
  }
  get endAdornment() {
    return this.displayVarb.endAdornment;
  }
  get displayName(): DisplayName {
    return this.displayVarb.displayName;
  }
  get initValue() {
    return cloneDeep(this.updateVarb.initValue);
  }
  get displaySourceFinder(): DisplaySourceFinder {
    return this.displayVarb.displaySourceFinder;
  }
  get varbNameInfo(): VarbNames<SN> {
    return {
      sectionName: this.sectionName,
      varbName: this.varbName,
    };
  }
  get valueName(): ValueName {
    return this.baseVarb.valueName;
  }
  get calcRound(): number {
    return this.displayVarb.calculateRound;
  }
  roundForDisplay(value: number): string {
    let num = round(value, this.displayRound);
    let str = num.toLocaleString("en-US");
    if (this.baseVarb.valueUnit === "dollars" && str.includes(".")) {
      const [_beforeDecimal, afterDecimal] = str.split(".");
      if (afterDecimal.length === 1) {
        str += "0";
      }
    }
    return str;
  }
  get displayRound(): number {
    return this.displayVarb.displayRound;
  }
  get inDefaultUpdatePack(): InUpdatePack {
    const { updateFnProps, updateFnName } = this.updateVarb;
    return {
      updateFnProps,
      updateFnName,
      fixedInEntities: fnPropsToFixedInEntities(updateFnProps),
    };
  }
}

export interface InUpdatePack extends UpdateBasics {
  fixedInEntities: FixedInEntity[];
}
interface InSwitchUpdatePack extends InUpdatePack {
  switches: UpdateOverrideSwitches;
}

function updateOverrideToInfos(
  updateOverride: UpdateOverrides
): InSwitchUpdatePack[] {
  const inSwitchInfos: InSwitchUpdatePack[] = [];
  for (const prop of updateOverride) {
    const fixedInEntities = fnPropsToFixedInEntities(prop.updateFnProps);
    inSwitchInfos.push({
      ...prop,
      fixedInEntities,
    });
  }
  return inSwitchInfos;
}

function fnPropsToFixedInEntities(
  updateFnProps: UpdateFnProps
): FixedInEntity[] {
  const infos = Object.values(updateFnProps);
  let nextInfos: FixedInEntity[] = [];
  for (const info of infos) {
    if (Array.isArray(info)) nextInfos = nextInfos.concat(info);
    else nextInfos.push(info);
  }
  return nextInfos;
}
