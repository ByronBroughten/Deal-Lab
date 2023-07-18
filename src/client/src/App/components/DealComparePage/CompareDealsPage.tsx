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
  const isEditingComparedDeals = session.valueNext("isEditingComparedDeals");

  const updateValue = useAction("updateValue");
  const editComparedDeals = () =>
    updateValue({
      ...session.varbInfo("isEditingComparedDeals"),
      value: true,
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
              {!isEditingComparedDeals && (
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
            {isEditingComparedDeals && <CompareDealsEditBody />}
            {!isEditingComparedDeals && <CompareDealsDisplayBody />}
          </SubSectionOpen>
        </IdOfSectionToSaveProvider>
      </DealModeProvider>
    </BackBtnWrapper>
  );
}
