import { View } from "react-native";
import { outputListName } from "../../sharedWithServer/defaultMaker/makeDefaultOutputSection";
import { IdOfSectionToSaveProvider } from "../../sharedWithServer/stateClassHooks/useIdOfSectionToSave";
import { useGetterMain } from "../../sharedWithServer/stateClassHooks/useMain";
import { nativeTheme } from "../../theme/nativeTheme";
import { SubSectionOpen } from "../ActiveDealPage/ActiveDeal/SubSectionOpen";
import { BackBtnWrapper } from "../appWide/BackBtnWrapper";
import { PageTitle } from "../appWide/PageTitle";
import { DealModeProvider } from "../customContexts/dealModeContext";
import { ComparedDealDisplay } from "./ComparedDealDisplay";

export function CompareDealsDisplay() {
  const main = useGetterMain();

  const cache = main.onlyChild("dealCompareCache");
  const menu = main.onlyChild("feStore").onlyChild("dealCompareMenu");

  const dealMode = menu.valueNext("dealMode");
  const listName = outputListName(dealMode);
  const outputList = menu.onlyChild(listName);

  const compareValueFeIds = outputList.childFeIds("outputItem");
  const comparedDbIds = menu.childrenDbIds("comparedDeal");
  const comparedSystemFeIds = comparedDbIds.map(
    (dbId) => cache.childByDbId({ childName: "comparedDealSystem", dbId }).feId
  );

  const areCompareDeals = comparedSystemFeIds.length > 0;
  return (
    <BackBtnWrapper
      {...{ label: "Deal Menu", to: "account", sx: { maxWidth: 900 } }}
    >
      <DealModeProvider dealMode={"mixed"}>
        <IdOfSectionToSaveProvider {...{ storeId: menu.mainStoreId }}>
          <SubSectionOpen sx={{ overflow: "auto", maxWidth: 900 }}>
            <PageTitle
              text={
                "Compare Deals"
                // <LabelWithInfo
                //   {...{
                //     label: "Compare",
                //     infoTitle: "Compare",
                //     infoText: `Compare deals side-by-side. Just click the "+" button to add a deal, and choose which values to compare by adding or subtracting values at the top of the page.`,
                //   }}
                // />
              }
            />
            <View
              style={{
                flexWrap: "nowrap",
                marginTop: nativeTheme.s4,
                marginBottom: nativeTheme.s4,
                flexDirection: "row",
              }}
            >
              <View>
                <View style={{ flexDirection: "row" }}>
                  {comparedSystemFeIds.map((feId, idx) => (
                    <ComparedDealDisplay
                      {...{
                        sx: {
                          marginRight: nativeTheme.s3,
                        },
                        key: feId,
                        feId,
                      }}
                    />
                  ))}
                </View>
              </View>
            </View>
          </SubSectionOpen>
        </IdOfSectionToSaveProvider>
      </DealModeProvider>
    </BackBtnWrapper>
  );
}
