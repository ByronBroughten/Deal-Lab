import { ValueName } from "./baseVarb";
import {
  BaseOngoingVarb,
  BaseSwitchVarb,
  relSwitchVarbs,
  SwitchEndingKey,
  SwitchEndings,
  SwitchRecord,
} from "./RelSwitchVarb";

export type BaseVarbSchemas = { [varbName: string]: ValueName };
type TypeRecord<T extends readonly string[], V extends ValueName> = {
  [Prop in T[number]]: V;
};

export function baseVarbs<V extends ValueName, T extends readonly string[]>(
  vt: V,
  keys: T
): TypeRecord<T, V> {
  return keys.reduce((schemas, key) => {
    schemas[key as T[number]] = vt;
    return schemas;
  }, {} as Partial<TypeRecord<T, V>>) as TypeRecord<T, V>;
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
    type NumObjEndings = Omit<SwitchEndings[SWN], "switch">;
    const numObjSchemas: Partial<
      SwitchRecord<Base, SwitchEndings[SWN], "numObj">
    > = {};
    for (const ending of Object.values(targetEndings)) {
      numObjSchemas[
        `${baseName}${ending}` as keyof SwitchRecord<
          Base,
          SwitchEndings[SWN],
          "numObj"
        >
      ] = "numObj";
    }
    return {
      [`${baseName}${switchEnding}`]: "string",
      ...numObjSchemas,
    } as BaseSwitchVarb<Base, SwitchEndings[SWN]>;
  },
  ongoing<Base extends string>(baseName: Base): BaseOngoingVarb<Base> {
    return this.switch(baseName, "ongoing");
  },
  get switchableEquationEditor() {
    return {
      ...baseVarbs("string", ["valueSwitch", "displayNameEditor"] as const),
      ...baseVarbs("numObj", ["valueEditor"] as const),
    } as const;
  },
  get savableSection() {
    return {
      displayName: "stringObj",
      dateTimeFirstSaved: "dateTime",
      dateTimeLastSaved: "dateTime",
      autoSyncControl: "string", // autoSyncControl - default to false.
      syncStatus: "string",
    } as const;
  },
  get virtualVarb() {
    return {
      displayName: "stringObj",
      displayNameEnd: "stringObj",
      startAdornment: "stringObj",
      endAdornment: "stringObj",
    } as const;
  },
  get singleValueVirtualVarb() {
    return {
      ...this.virtualVarb,
      value: "numObj",
    } as const;
  },
  get loadableVarb() {
    return {
      valueEntityInfo: "inEntityInfo",
    } as const;
  },
} as const;
