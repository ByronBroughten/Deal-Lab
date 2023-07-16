import { useGetterMain } from "../../sharedWithServer/stateClassHooks/useMain";
import { nativeTheme } from "../../theme/nativeTheme";
import { MuiRow } from "../general/MuiRow";
import { ComparedDealDisplay } from "./ComparedDealDisplay";

export function CompareDealsDisplayBody() {
  const main = useGetterMain();

  const cache = main.onlyChild("dealCompareCache");
  const menu = main.onlyChild("feStore").onlyChild("dealCompareMenu");

  const comparedDbIds = menu.childrenDbIds("comparedDeal");
  const comparedSystemFeIds = comparedDbIds.map(
    (dbId) => cache.childByDbId({ childName: "comparedDealSystem", dbId }).feId
  );

  const areDealsToCompare = comparedSystemFeIds.length > 0;

  return (
    <MuiRow
      sx={{
        flexWrap: "nowrap",
        marginTop: nativeTheme.s4,
        marginBottom: nativeTheme.s4,
      }}
    >
      {!areDealsToCompare && (
        <MuiRow
          sx={{
            flexWrap: "nowrap",
            flex: 1,
            justifyContent: "center",
            minHeight: 200,
            fontSize: nativeTheme.fs26,
            color: nativeTheme.darkBlue.main,
          }}
        >
          No deals selected for comparison
        </MuiRow>
      )}
      {areDealsToCompare &&
        comparedSystemFeIds.map((feId) => (
          <ComparedDealDisplay
            {...{
              sx: {
                marginRight: nativeTheme.s4,
              },
              key: feId,
              feId,
            }}
          />
        ))}
    </MuiRow>
  );
}
