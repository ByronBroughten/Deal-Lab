import { baseSectionVarbs } from "./baseSectionVarbs";
import { baseOptions } from "./baseUnits";
import { baseVarb, baseVarbsS } from "./baseVarbs";

const ongoingItemBase = {
  // It's a choice between making it more similar to singleTimeItem
  // or making it work like the other ones

  ...baseVarbsS.ongoingDollars("value"),
  valueEditor: baseVarb("numObj"),
  valueSourceName: baseVarb("editorValueSource"),
  ...baseVarbsS.displayNameAndEditor,
} as const;

export const baseOngoingItem = baseSectionVarbs(ongoingItemBase);
export const baseOngoingCheckmarkItem = baseSectionVarbs({
  ...ongoingItemBase,
  isActive: baseVarb("boolean"),
});

const capExItemBase = {
  ...baseVarbsS.displayNameAndEditor,
  ...baseVarbsS.ongoingDollars("value"),
  ...baseVarbsS.monthsYearsInput("lifespan"),
  costToReplace: baseVarb("numObj", baseOptions.dollars),
};

export const baseCapExItem = baseSectionVarbs(capExItemBase);
