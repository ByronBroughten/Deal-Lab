import { USVS, usvs } from "../updateSectionVarbs";
import { uvS } from "../updateVarb";
import { ubS } from "../updateVarb/UpdateBasics";

export function afterRepairValueUpdateVarbs(): USVS<"afterRepairValue"> {
  return usvs("afterRepairValue", {
    valueDollars: uvS.vsNumObj("arvValueSource", {
      valueDollarsEditor: ubS.loadLocal("valueDollarsEditor"),
      purchasePrice: ubS.varbPathName("purchasePrice"),
    }),
    valueDollarsEditor: uvS.input("numObj"),
    valueSourceName: uvS.input("arvValueSource"),
  });
}
