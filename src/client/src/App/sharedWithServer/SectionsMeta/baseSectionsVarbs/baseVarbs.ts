import { ValueName } from "./baseVarbDepreciated";
import {
  BaseOngoingVarb,
  BaseSwitchVarb,
  relSwitchVarbs,
  SwitchEndingKey,
  SwitchEndings,
  SwitchRecord,
} from "./RelSwitchVarb";

type GeneralBaseVarb = {
  valueName: ValueName;
};

type BaseVarbOptions = Partial<GeneralBaseVarb>;

function defaultBaseVarb<VN extends ValueName>(
  valueName: VN
): { valueName: VN } {
  return { valueName };
}
export type BaseVarb<VN extends ValueName> = {
  valueName: VN;
};
export function baseVarb<VN extends ValueName>(valueName: VN): BaseVarb<VN> {
  return defaultBaseVarb(valueName);
}

export type GeneralBaseSectionVarbs = { [varbName: string]: GeneralBaseVarb };

type DefaultBaseVarbs<VN extends ValueName, VNS extends string> = {
  [Prop in VNS]: BaseVarb<VN>;
};

export function baseVarbs<VN extends ValueName, VNS extends string>(
  valueName: VN,
  varbNames: readonly VNS[]
): DefaultBaseVarbs<VN, VNS> {
  return varbNames.reduce((varbs, varbName) => {
    varbs[varbName] = baseVarb(valueName);
    return varbs;
  }, {} as DefaultBaseVarbs<VN, VNS>);
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
      SwitchRecord<Base, SwitchEndings[SWN], BaseVarb<"numObj">>
    > = {};
    for (const ending of Object.values(targetEndings)) {
      numObjSchemas[
        `${baseName}${ending}` as keyof SwitchRecord<
          Base,
          SwitchEndings[SWN],
          BaseVarb<"numObj">
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
