import { BaseName, VarbName } from "../BaseName";
import { BaseVarbInfo } from "../baseVarbInfo";
import { relVarbInfo } from "./relVarbInfo";

export const relUpdateInfo = {
  entityEditor: {
    updateName: "entityEditor",
    updateProps: {},
  } as const,
  sumNums<NU extends BaseVarbInfo<"relId">[]>(nums: NU) {
    return {
      updateName: "sumNums",
      updateProps: { nums },
    } as const;
  },
  ongoing: {
    monthly<
      SN extends BaseName,
      YN extends VarbName<SN>,
      SWN extends VarbName<SN>
    >(sectionName: SN, yearlyName: YN, switchName: SWN) {
      return {
        switchValue: "yearly",
        switchInfo: relVarbInfo.local(sectionName, switchName),
        updateName: "yearlyToMonthly",
        updateProps: {
          num: relVarbInfo.local(sectionName, yearlyName),
        },
      } as const;
    },
    yearly<
      SN extends BaseName,
      MN extends VarbName<SN>,
      SWN extends VarbName<SN>
    >(sectionName: SN, monthlyName: MN, switchName: SWN) {
      return {
        switchValue: "monthly",
        switchInfo: relVarbInfo.local(sectionName, switchName),
        updateName: "monthlyToYearly",
        updateProps: {
          num: relVarbInfo.local(sectionName, monthlyName),
        },
      } as const;
    },
  },
};
