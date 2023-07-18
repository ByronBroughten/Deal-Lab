import { MoonLoader } from "react-spinners";
import { useAction } from "../../sharedWithServer/stateClassHooks/useAction";
import { useGetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useGetterSection";
import { IdOfSectionToSaveProvider } from "../../sharedWithServer/stateClassHooks/useIdOfSectionToSave";
import { nativeTheme } from "../../theme/nativeTheme";
import { SubSectionOpen } from "../ActiveDealPage/ActiveDeal/SubSectionOpen";
import { BackBtnWrapper } from "../appWide/BackBtnWrapper";
import { StyledActionBtn } from "../appWide/GeneralSection/MainSection/StyledActionBtn";
import { PageTitle } from "../appWide/PageTitle";
import { DealModeProvider } from "../customContexts/dealModeContext";
import { MuiRow } from "../general/MuiRow";
import { icons } from "../Icons";
import { CompareDealsDisplayBody } from "./CompareDealsDisplayBody";
import { CompareDealsEditBody } from "./CompareDealsEditBody";

export function CompareDealsPage() {
  const menu = useGetterSectionOnlyOne("dealCompareMenu");
  const session = useGetterSectionOnlyOne("sessionStore");
  const status = session.valueNext("compareDealStatus");

  const updateValue = useAction("updateValue");
  const editComparedDeals = () =>
    updateValue({
      ...session.varbInfo("compareDealStatus"),
      value: "editing",
    });

  return (
    <BackBtnWrapper
      {...{ label: "Deal Menu", to: "account", sx: { maxWidth: 900 } }}
    >
      <DealModeProvider dealMode={"mixed"}>
        <IdOfSectionToSaveProvider {...{ storeId: menu.mainStoreId }}>
          <SubSectionOpen
            sx={{
              overflow: "auto",
              paddingBottom: nativeTheme.s5,
              maxWidth: 900,
            }}
          >
            <MuiRow>
              <PageTitle text={"Compare Deals"} />
              {status === "comparing" && (
                <StyledActionBtn
                  {...{
                    sx: { marginLeft: nativeTheme.s2 },
                    left: icons.edit({ size: 20 }),
                    onClick: editComparedDeals,
                    middle: "Edit",
                  }}
                />
              )}
            </MuiRow>
            {status === "editing" && <CompareDealsEditBody />}
            {status === "buildingCompare" && (
              <MuiRow
                sx={{
                  justifyContent: "center",
                  padding: nativeTheme.s45,
                }}
              >
                <MoonLoader
                  {...{
                    loading: status === "buildingCompare",
                    color: nativeTheme.primary.main,
                    size: 100,
                    speedMultiplier: 0.8,
                    cssOverride: { marginTop: nativeTheme.s3 },
                  }}
                />
              </MuiRow>
            )}
            {status === "comparing" && <CompareDealsDisplayBody />}
          </SubSectionOpen>
        </IdOfSectionToSaveProvider>
      </DealModeProvider>
    </BackBtnWrapper>
  );
}
