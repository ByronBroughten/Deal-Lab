import {
  SectionValues,
  StateValue,
} from "../../SectionsMeta/values/StateValue";
import { numObj } from "../../SectionsMeta/values/StateValue/NumObj";
import { stringObj } from "../../SectionsMeta/values/StateValue/StringObj";
import { PackBuilderSection } from "../../StatePackers.ts/PackBuilderSection";
import { StrictPick } from "../../utils/types";
import { makeDefaultMgmtPack } from "../makeDefaultMgmtPack";

type ExampleMgmtProps = {
  mgmt: StrictPick<
    SectionValues<"mgmt">,
    "displayName" | "vacancyLossPercentEditor"
  >;
  basePay: {
    valueSourceName: StateValue<"mgmtBasePayValueSource">;
  };
};
function exampleMgmt(props: ExampleMgmtProps) {
  const mgmt = PackBuilderSection.initAsOmniChild("mgmt");
  mgmt.loadSelf(makeDefaultMgmtPack());
  mgmt.updateValues(props.mgmt);
  return mgmt.makeSectionPack();
}

export const exampleDealMgmt = exampleMgmt({
  mgmt: {
    displayName: stringObj("Owner managed"),
    vacancyLossPercentEditor: numObj(5),
  },
  basePay: { valueSourceName: "tenPercentRent" },
});
