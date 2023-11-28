import { SectionValues, StateValue } from "../SectionsMeta/values/StateValue";
import { stringObj } from "../SectionsMeta/values/StateValue/StringObj";
import { StrictPick } from "../utils/types";
import { makeExample } from "./makeExample";

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
  return makeExample("mgmt", (mgmt) => {
    mgmt.updateValues(props.mgmt);
    const vacancyLoss = mgmt.onlyChild("vacancyLossValue");
    vacancyLoss.updateValues(props.vacancyLoss);

    const basePay = mgmt.onlyChild("mgmtBasePayValue");
    basePay.updateValues(props.basePay);
  });
}

export const exampleDealMgmt = makeExampleMgmt({
  mgmt: { displayName: stringObj("Owner managed") },
  basePay: { valueSourceName: "zero" },
  vacancyLoss: { valueSourceName: "fivePercentRent" },
});
