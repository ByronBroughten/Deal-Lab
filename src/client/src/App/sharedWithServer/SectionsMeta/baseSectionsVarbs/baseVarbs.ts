import { Merge, merge } from "./../../utils/Obj/merge";
import { ValueName } from "./baseVarbDepreciated";
import {
  BaseOngoingVarb,
  BaseSwitchVarb,
  relSwitchVarbs,
  SwitchEndingKey,
  SwitchEndings,
  SwitchRecord,
} from "./RelSwitchVarb";

export type GeneralBaseVarb = {
  valueName: ValueName;
};
function checkBaseVarb<BV extends GeneralBaseVarb>(baseVarb: BV): BV {
  return baseVarb;
}
type DefaultBaseVarb<VN extends ValueName> = {
  valueName: VN;
};
function defaultBaseVarb<VN extends ValueName>(
  valueName: VN
): DefaultBaseVarb<VN> {
  return checkBaseVarb({ valueName });
}
type Options = Partial<Omit<GeneralBaseVarb, "valueName">>;
export type BaseVarb<VN extends ValueName, O extends Options> = Merge<
  DefaultBaseVarb<VN>,
  O
>;
export function baseVarb<VN extends ValueName, O extends Options = {}>(
  valueName: VN,
  options?: O
): BaseVarb<VN, O> {
  return merge(defaultBaseVarb(valueName), options ?? ({} as O));
}
const baseVarbS = {
  moneyMonthly<VN extends ValueName>(valueName: VN) {
    return baseVarb(valueName, {
      unitName: "dollars",
      timespanName: "monthly",
    });
  },
  moneyYearly<VN extends ValueName>(valueName: VN) {
    return baseVarb(valueName, {
      unitName: "dollars",
      timespanName: "monthly",
    });
  },
};

type BaseVarbs<VN extends ValueName, VNS extends string, O extends Options> = {
  [Prop in VNS]: BaseVarb<VN, O>;
};
export function baseVarbs<
  VN extends ValueName,
  VNS extends string,
  O extends Options = {}
>(
  valueName: VN,
  varbNames: readonly VNS[],
  options?: O
): BaseVarbs<VN, VNS, O> {
  return varbNames.reduce((varbs, varbName) => {
    varbs[varbName] = baseVarb(valueName, options ?? ({} as O));
    return varbs;
  }, {} as BaseVarbs<VN, VNS, O>);
}
export const baseVarbsS = {
  get typeUniformity() {
    return { _typeUniformity: "string" } as const;
  },
  switch<Base extends string, SWN extends SwitchEndingKey>(
    baseName: Base,
    switchName: SWN
  ): BaseSwitchVarb<Base, SwitchEndings[SWN]> {
    const { targetEndings, switchEnding } = relSwitchVarbs[switchName];
    const numObjSchemas: Partial<
      SwitchRecord<Base, SwitchEndings[SWN], BaseVarb<"numObj", {}>>
    > = {};
    for (const ending of Object.values(targetEndings)) {
      numObjSchemas[
        `${baseName}${ending}` as keyof SwitchRecord<
          Base,
          SwitchEndings[SWN],
          BaseVarb<"numObj", {}>
        >
      ] = baseVarb("numObj");
    }
    return {
      [`${baseName}${switchEnding}`]: baseVarb("string"),
      ...numObjSchemas,
    } as BaseSwitchVarb<Base, SwitchEndings[SWN]>;
  },
  ongoing<Base extends string>(baseName: Base): BaseOngoingVarb<Base> {
    return this.switch(baseName, "ongoing");
  },
  get switchableEquationEditor() {
    return {
      ...baseVarbs("string", [
        "valueSourceSwitch",
        "displayNameEditor",
      ] as const),
      ...baseVarbs("numObj", ["valueEditor"] as const),
    } as const;
  },
  get savableSection() {
    return {
      displayName: baseVarb("stringObj"),
      dateTimeFirstSaved: baseVarb("dateTime"),
      dateTimeLastSaved: baseVarb("dateTime"),
      autoSyncControl: baseVarb("string"), // autoSyncControl - default to false.
      syncStatus: baseVarb("string"),
    } as const;
  },
  get virtualVarb() {
    return baseVarbs("stringObj", [
      "displayName",
      "displayNameEnd",
      "startAdornment",
      "endAdornment",
    ] as const);
  },
  get singleValueVirtualVarb() {
    return {
      ...this.virtualVarb,
      value: baseVarb("numObj"),
    } as const;
  },
  get loadableVarb() {
    return {
      valueEntityInfo: baseVarb("inEntityInfo"),
    } as const;
  },
} as const;
