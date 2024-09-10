import { Box } from "@mui/material";
import { useAction } from "../../../modules/stateHooks/useAction";
import { useGetterSectionOnlyOne } from "../../../modules/stateHooks/useGetterSection";
import { nativeTheme } from "../../../theme/nativeTheme";
import { MuiRow } from "../../general/MuiRow";
import { LoadedVarbListNext } from "../appWide/VarbLists/LoadedVarbListNext";
import { icons } from "../Icons";
import { FinishBtn } from "../Main/ActiveDealRoutes/ActiveDealStuff/FinishBtn";
import { CompareDealsEdit } from "./CompareDealsEdit";

export function CompareDealsEditBody() {
  const menu = useGetterSectionOnlyOne("dealCompareMenu");
  const comparedDealFeIds = menu.childFeIds("comparedDeal");
  const outputList = menu.onlyChild("outputList");

  const session = useGetterSectionOnlyOne("sessionStore");
  const updateValue = useAction("updateValue");
  const buildCompare = () =>
    updateValue({
      ...session.varbInfo("compareDealStatus"),
      value: "comparing",
    });

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
          onClick: buildCompare,
          btnText: "Compare",
          btnIcon: icons.compareDeals(),
          sx: { borderRadius: nativeTheme.muiBr0 },
        }}
      />
    </Box>
  );
}
