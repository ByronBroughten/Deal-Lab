import { dealModeLabels } from "../../sharedWithServer/SectionsMeta/values/StateValue/unionValues";
import { useGetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useGetterSection";
import { nativeTheme } from "../../theme/nativeTheme";
import { MuiSelect } from "../appWide/MuiSelect";

export function CompareDealModeSelector() {
  const menu = useGetterSectionOnlyOne("dealCompareMenu");
  return (
    <MuiSelect
      {...{
        sx: { mt: nativeTheme.s3 },
        selectProps: { sx: { minWidth: 120 } },
        label: `Deal Type`,
        unionValueName: "dealModePlusMixed",
        feVarbInfo: {
          ...menu.feInfo,
          varbName: "dealMode",
        },
        items: [
          ["homeBuyer", dealModeLabels.homeBuyer],
          ["buyAndHold", dealModeLabels.buyAndHold],
          ["fixAndFlip", dealModeLabels.fixAndFlip],
          ["brrrr", dealModeLabels.brrrr],
          ["mixed", "Mixed"],
        ],
      }}
    />
  );
}
