import { baseSectionVarbs } from "./baseSectionVarbs";
import { baseOptions } from "./baseUnits";
import { baseVarb, baseVarbsS } from "./baseVarbs";

export const baseOngoingItem = baseSectionVarbs({
  valueSourceName: baseVarb("editorValueSource"),
  ...baseVarbsS.periodicDollarsInput("value"),
  ...baseVarbsS.displayNameAndEditor,
});

const capExItemBase = {
  ...baseVarbsS.displayNameAndEditor,
  ...baseVarbsS.periodicDollars("value"),
  ...baseVarbsS.monthsYearsInput("lifespan"),
  costToReplace: baseVarb("numObj", baseOptions.dollars),
};

export const baseCapExItem = baseSectionVarbs(capExItemBase);
