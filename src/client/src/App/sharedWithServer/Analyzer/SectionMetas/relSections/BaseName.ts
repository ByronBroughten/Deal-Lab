import { baseNameArrs, BaseNameArrs, BaseNameSelector } from "./baseNameArrs";
import { BaseSections, SectionContext, baseSections } from "./baseSections";
import { BaseValueName } from "./baseSections/baseValues";
import { SubType } from "../../../utils/types";

export type BaseName<
  ST extends BaseNameSelector = "all",
  SC extends SectionContext = "fe",
  NameArrs = BaseNameArrs[SC][ST]
> = NameArrs[number & keyof NameArrs];

export type VarbNameWide<
  ST extends BaseNameSelector = "hasVarb",
  T extends BaseValueName = BaseValueName,
  C extends SectionContext = "fe",
  SN = BaseName<ST, C>,
  ContextSections = BaseSections[C],
  MultiContextSections = {
    [Prop in SN & string]: ContextSections[Prop & keyof ContextSections];
  },
  SectionValueVarbName = {
    [Prop in keyof MultiContextSections]: keyof SubType<
      MultiContextSections[Prop]["varbSchemas" &
        keyof MultiContextSections[Prop]],
      {
        valueName: T;
      }
    >;
  }
> = SectionValueVarbName[SN & keyof SectionValueVarbName];

type ValueVarbSchemas<T, VN extends BaseValueName> = T extends {
  [key: string]: any;
}
  ? SubType<T, { valueName: VN }>
  : never;
export type VarbName<
  ST extends BaseNameSelector = "all",
  T extends BaseValueName = BaseValueName,
  SC extends SectionContext = "fe",
  SN = BaseName<ST, SC>,
  ContextSections = BaseSections[SC],
  MultiContextSections = ContextSections[SN & keyof ContextSections],
  VarbSchemas = MultiContextSections["varbSchemas" & keyof MultiContextSections]
> = keyof ValueVarbSchemas<VarbSchemas, T>;

function _VarbNameTest(
  stringName: VarbName<"property" | "loan", "string">,
  _general: VarbName
) {
  const _title: typeof stringName = "title";
  // @ts-expect-error
  const _price: typeof stringName = "price";
}

export type VarbValueName<
  ST extends BaseNameSelector,
  VN extends VarbName<ST, BaseValueName, C>,
  C extends SectionContext = "fe",
  SN = BaseName<ST>,
  ContextSections = BaseSections[C & SectionContext],
  ContextSection = ContextSections[SN & keyof ContextSections],
  VarbSchemas = ContextSection["varbSchemas" & keyof ContextSection],
  VarbSchema = VarbSchemas[VN & keyof VarbSchemas]
> = VarbSchema["valueName" & keyof VarbSchema];

function _VarbValueNameTest(name: VarbValueName<"property", "title">) {
  const _str: "string" = name;
  //@ts-expect-error
  const _num: "numObj" = name;
}

export function isBaseName<
  NS extends BaseNameSelector = "all",
  SC extends SectionContext = "fe"
>(value: any, type?: NS, context?: SC): value is BaseName<NS, SC> {
  const arrs = baseNameArrs[context ?? ("fe" as SC)] as Record<
    string,
    readonly string[]
  >;
  const names: readonly string[] = arrs[(type ?? "all") as string];
  return names.includes(value);
}

export function isVarbName<
  SN extends BaseName<"all", SC>,
  SC extends SectionContext = "fe"
>(sectionName: SN, value: any, context?: SC): value is VarbName<SN & BaseName> {
  const varbNames = Object.keys(
    baseSections[context ?? ("fe" as SC)][sectionName as SN & BaseName]
      .varbSchemas
  );
  return varbNames.includes(value);
}

export function listNameToStoreName(sectionName: BaseName<"allList">) {
  if (isBaseName(sectionName, "singleTimeList")) return "userSingleList";
  if (isBaseName(sectionName, "ongoingList")) return "userOngoingList";
  else if (sectionName === "userVarbList") return "userVarbList";
  else throw new Error("A list sectionName was not provided");
}
