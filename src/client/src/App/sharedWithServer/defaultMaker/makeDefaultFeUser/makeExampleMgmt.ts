import {
  SectionValues,
  StateValue,
} from "../../SectionsMeta/values/StateValue";
import { stringObj } from "../../SectionsMeta/values/StateValue/StringObj";
import { PackBuilderSection } from "../../StatePackers.ts/PackBuilderSection";
import { StrictPick } from "../../utils/types";
import { makeDefaultMgmtPack } from "../makeDefaultMgmtPack";

type ExampleMgmtProps = {
  mgmt: StrictPick<SectionValues<"mgmt">, "displayName">;
  basePay: {
    valueSourceName: StateValue<"mgmtBasePayValueSource">;
  };
  vacancyLoss: {
    valueSourceName: StateValue<"vacancyLossValueSource">;
  };
};
function exampleMgmt(props: ExampleMgmtProps) {
  const mgmt = PackBuilderSection.initAsOmniChild("mgmt");
  mgmt.loadSelf(makeDefaultMgmtPack());
  mgmt.updateValues(props.mgmt);
  return mgmt.makeSectionPack();
}

export const exampleDealMgmt = exampleMgmt({
  mgmt: { displayName: stringObj("Owner managed") },
  basePay: { valueSourceName: "zero" },
  vacancyLoss: { valueSourceName: "fivePercentRent" },
});
