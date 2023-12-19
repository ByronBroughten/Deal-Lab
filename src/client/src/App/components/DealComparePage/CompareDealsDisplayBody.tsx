import React, { useRef } from "react";
import { MoonLoader } from "react-spinners";
import { timeS } from "../../../sharedWithServer/utils/timeS";
import { useAction } from "../../stateClassHooks/useAction";
import { useGetterMain } from "../../stateClassHooks/useMain";
import { nativeTheme } from "../../theme/nativeTheme";
import { MuiRow } from "../general/MuiRow";
import { ComparedDealDisplay } from "./ComparedDealDisplay";

export function CompareDealsDisplayBody() {
  const main = useGetterMain();
  const session = main.onlyChild("sessionStore");
  const compareDealTimeReady = session.valueNext("compareDealTimeReady");

  const doDealCompare = useAction("doDealCompare");

  const menu = main.onlyChild("feStore").onlyChild("dealCompareMenu");
  const comparedDbIds = menu.childrenDbIds("comparedDeal");

  const areDealsToCompare = comparedDbIds.length > 0;

  const initTimeRef = useRef(timeS.now());
  React.useEffect(() => {
    if (areDealsToCompare) {
      doDealCompare({});
    }
  }, []);

  const dealsPrepped = compareDealTimeReady > initTimeRef.current;
  const showPrepped = areDealsToCompare && dealsPrepped;
  const showLoading = areDealsToCompare && !dealsPrepped;

  return (
    <MuiRow
      sx={{
        marginTop: nativeTheme.s4,
        marginBottom: nativeTheme.s4,
        justifyContent: "center",
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
      {showLoading && (
        <MuiRow
          sx={{
            justifyContent: "center",
            padding: nativeTheme.s45,
          }}
        >
          <MoonLoader
            {...{
              loading: true,
              color: nativeTheme.primary.main,
              size: 100,
              speedMultiplier: 0.8,
              cssOverride: { marginTop: nativeTheme.s3 },
            }}
          />
        </MuiRow>
      )}
      {showPrepped && <ComparedDeals />}
    </MuiRow>
  );
}

function ComparedDeals() {
  const main = useGetterMain();
  const cache = main.onlyChild("dealCompareCache");
  const menu = main.onlyChild("feStore").onlyChild("dealCompareMenu");
  const comparedDbIds = menu.childrenDbIds("comparedDeal");
  const comparedSystemFeIds = comparedDbIds.map(
    (dbId) => cache.childByDbId({ childName: "comparedDealSystem", dbId }).feId
  );
  return (
    <MuiRow className="ComparedDeals-root" sx={{ flexWrap: "nowrap" }}>
      {comparedSystemFeIds.map((feId) => (
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
