import { Box } from "@mui/material";
import { useAction } from "../../sharedWithServer/stateClassHooks/useAction";
import { useGetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useGetterSection";
import { nativeTheme } from "../../theme/nativeTheme";
import { FinishBtn } from "../ActiveDealPage/ActiveDeal/FinishBtn";
import { LoadedVarbListNext } from "../appWide/VarbLists/LoadedVarbListNext";
import { MuiRow } from "../general/MuiRow";
import { icons } from "../Icons";
import { CompareDealsEdit } from "./CompareDealsEdit";

export function CompareDealsEditBody() {
  const menu = useGetterSectionOnlyOne("dealCompareMenu");
  const comparedDealFeIds = menu.childFeIds("comparedDeal");
  const outputList = menu.onlyChild("outputList");

  const session = useGetterSectionOnlyOne("sessionStore");
  const doDealCompare = useAction("doDealCompare");

  return (
    <Box>
      <MuiRow
        sx={{
          marginBottom: nativeTheme.s4,
          alignItems: "flex-start",
        }}
      >
        <CompareDealsEdit
          {...{
            comparedDealFeIds,
            sx: {
              marginTop: nativeTheme.s4,
              marginBottom: nativeTheme.s4,
            },
          }}
        />
        <LoadedVarbListNext
          {...{
            title: "Values to Compare By",
            feId: outputList.feId,
            sx: {
              marginTop: nativeTheme.s4,
              marginBottom: nativeTheme.s4,
            },
          }}
        />
      </MuiRow>
      <FinishBtn
        {...{
          onClick: () => doDealCompare({}),
          btnText: "Compare",
          btnIcon: icons.compareDeals(),
          sx: { borderRadius: nativeTheme.muiBr0 },
        }}
      />
    </Box>
  );
}
