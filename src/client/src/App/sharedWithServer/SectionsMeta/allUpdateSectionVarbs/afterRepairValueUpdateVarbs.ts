import { USVS, usvs } from "../updateSectionVarbs/updateSectionVarbs";
import { uvS } from "../updateSectionVarbs/updateVarb";
import { ubS } from "../updateSectionVarbs/updateVarb/UpdateBasics";

export function afterRepairValueUpdateVarbs(): USVS<"afterRepairValue"> {
  return usvs("afterRepairValue", {
    valueDollars: uvS.vsNumObj("arvValueSource", {
      valueDollarsEditor: ubS.loadLocal("valueDollarsEditor"),
      purchasePrice: ubS.loadByVarbPathName("purchasePrice"),
    }),
    valueDollarsEditor: uvS.input("numObj"),
    valueSourceName: uvS.input("arvValueSource"),
  });
}
