import { usvs, USVS } from "../updateSectionVarbs";
import { uvS } from "../updateVarb";
import { ubS } from "../updateVarb/UpdateBasics";
import { uO } from "../updateVarb/UpdateOverride";
import { uosS } from "../updateVarb/UpdateOverrides";
import { osS } from "../updateVarb/UpdateOverrideSwitch";

export function loanBaseExtraUpdateVarbs(): USVS<"loanBaseExtra"> {
  return usvs("loanBaseExtra", {
    hasLoanExtra: uvS.input("boolean", { initValue: false }),
    valueSourceName: uvS.input("dollarsListOrZero", {
      initValue: "valueDollarsEditor",
    }),
    valueDollarsEditor: uvS.input("numObj"),
    valueDollars: uvS.numObjO([
      uO([osS.isFalse("hasLoanExtra")], ubS.zero),
      ...uosS.valueSource(
        "dollarsOrList",
        {
          valueDollarsEditor: ubS.loadLocal("valueDollarsEditor"),
          listTotal: ubS.loadChild("onetimeList", "total"),
        },
        {
          sharedSwitches: [osS.isTrue("hasLoanExtra")],
        }
      ),
    ]),
  });
}
