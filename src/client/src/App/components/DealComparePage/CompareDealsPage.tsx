import { useGetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useGetterSection";
import { IdOfSectionToSaveProvider } from "../../sharedWithServer/stateClassHooks/useIdOfSectionToSave";
import { nativeTheme } from "../../theme/nativeTheme";
import { SubSectionOpen } from "../ActiveDealPage/ActiveDeal/SubSectionOpen";
import { BackBtnWrapper } from "../appWide/BackBtnWrapper";
import { PageTitle } from "../appWide/PageTitle";
import { DealModeProvider } from "../customContexts/dealModeContext";
import { CompareDealsEditBody } from "./CompareDealsEditBody";

export function CompareDealsPage() {
  const menu = useGetterSectionOnlyOne("dealCompareMenu");
  const session = useGetterSectionOnlyOne("sessionStore");
  const isEditingComparedDeals = session.valueNext("isEditingComparedDeals");
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
            <PageTitle
              text={
                "Compare Deals"
                // <LabelWithInfo
                //   {...{
                //     labeil: "Compare",
                //     infoTitle: "Compare",
                //     infoText: `Compare deals side-by-side. Just click the "+" button to add a deal, and choose which values to compare by adding or subtracting values at the top of the page.`,
                //   }}
                // />
              }
            />
            <CompareDealsEditBody />
          </SubSectionOpen>
        </IdOfSectionToSaveProvider>
      </DealModeProvider>
    </BackBtnWrapper>
  );
}
