import { Box } from "@mui/material";
import { useAction } from "../../sharedWithServer/stateClassHooks/useAction";
import { useGetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useGetterSection";
import { useGetterMain } from "../../sharedWithServer/stateClassHooks/useMain";
import { nativeTheme } from "../../theme/nativeTheme";
import { FinishBtn } from "../ActiveDealPage/ActiveDeal/FinishBtn";
import { LoadedVarbListNext } from "../appWide/VarbLists/LoadedVarbListNext";
import { MuiRow } from "../general/MuiRow";
import { icons } from "../Icons";
import { CompareDealsEdit } from "./CompareDealsEdit";

export function CompareDealsEditBody() {
  const main = useGetterMain();
  const cache = main.onlyChild("dealCompareCache");
  const menu = main.onlyChild("feStore").onlyChild("dealCompareMenu");
  const outputList = menu.onlyChild("outputList");

  const comparedDbIds = menu.childrenDbIds("comparedDeal");
  const comparedSystemFeIds = comparedDbIds.map(
    (dbId) => cache.childByDbId({ childName: "comparedDealSystem", dbId }).feId
  );

  const session = useGetterSectionOnlyOne("sessionStore");
  const updateValue = useAction("updateValue");
  const showComparedDeals = () =>
    updateValue({
      ...session.varbInfo("isEditingComparedDeals"),
      value: false,
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
            dealSystemIds: comparedSystemFeIds,
            sx: {
              marginTop: nativeTheme.s4,
              marginBottom: nativeTheme.s4,
            },
          }}
        />
        <LoadedVarbListNext
          {...{
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
          onClick: showComparedDeals,
          btnText: "Compare",
          btnIcon: icons.compareDeals(),
          sx: { borderRadius: nativeTheme.muiBr0 },
        }}
      />
    </Box>
  );
}
