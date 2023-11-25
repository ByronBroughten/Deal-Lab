import { makeDefaultMgmt } from "../defaultMaker/makeDefaultMgmt";
import { SectionValues, StateValue } from "../SectionsMeta/values/StateValue";
import { stringObj } from "../SectionsMeta/values/StateValue/StringObj";
import { PackBuilderSection } from "../StatePackers/PackBuilderSection";
import { StrictPick } from "../utils/types";

type ExampleMgmtProps = {
  mgmt: StrictPick<SectionValues<"mgmt">, "displayName">;
  basePay: {
    valueSourceName: StateValue<"mgmtBasePayValueSource">;
  };
  vacancyLoss: {
    valueSourceName: StateValue<"vacancyLossValueSource">;
  };
};

export function makeExampleMgmt(props: ExampleMgmtProps) {
  const mgmt = PackBuilderSection.initAsOmniChild("mgmt");
  mgmt.overwriteSelf(makeDefaultMgmt());
  mgmt.updateValues(props.mgmt);

  const vacancyLoss = mgmt.onlyChild("vacancyLossValue");
  vacancyLoss.updateValues(props.vacancyLoss);

  const basePay = mgmt.onlyChild("mgmtBasePayValue");
  basePay.updateValues(props.basePay);

  return mgmt.makeSectionPack();
}

export const exampleDealMgmt = makeExampleMgmt({
  mgmt: { displayName: stringObj("Owner managed") },
  basePay: { valueSourceName: "zero" },
  vacancyLoss: { valueSourceName: "fivePercentRent" },
});
