import { usvs, USVS } from "../updateSectionVarbs/updateSectionVarbs";
import { uvS } from "../updateSectionVarbs/updateVarb";
import { ubS } from "../updateSectionVarbs/updateVarb/UpdateBasics";
import { uO } from "../updateSectionVarbs/updateVarb/UpdateOverride";
import { uosS } from "../updateSectionVarbs/updateVarb/UpdateOverrides";
import { osS } from "../updateSectionVarbs/updateVarb/UpdateOverrideSwitch";

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
