import { View } from "react-native";
import { outputListName } from "../../sharedWithServer/defaultMaker/makeDefaultOutputSection";
import { IdOfSectionToSaveProvider } from "../../sharedWithServer/stateClassHooks/useIdOfSectionToSave";
import { useGetterMain } from "../../sharedWithServer/stateClassHooks/useMain";
import { nativeTheme } from "../../theme/nativeTheme";
import { SubSectionOpen } from "../ActiveDealPage/ActiveDeal/SubSectionOpen";
import { BackBtnWrapper } from "../appWide/BackBtnWrapper";
import { PageTitle } from "../appWide/PageTitle";
import { DealModeProvider } from "../customContexts/dealModeContext";
import { MuiRow } from "../general/MuiRow";
import { AddCompareDealBtn } from "./AddCompareDealBtn";
import { ComparedDeal } from "./ComparedDeal";
import { ComparedDealRmValueBtns } from "./ComparedDealRmValueBtns";
import { CompareDealModeSelector } from "./CompareDealModeSelector";
import { DealCompareValueMenu } from "./DealCompareValueMenu";

export function DealCompareSection() {
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
    <BackBtnWrapper {...{ label: "Deal Menu", to: "account" }}>
      <DealModeProvider dealMode={"mixed"}>
        <IdOfSectionToSaveProvider {...{ storeId: menu.mainStoreId }}>
          <SubSectionOpen>
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
            <MuiRow sx={{ pt: nativeTheme.s2, pl: "20px" }}>
              {areCompareDeals && <CompareDealModeSelector />}
            </MuiRow>
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
                  {areCompareDeals && (
                    <ComparedDealRmValueBtns {...{ compareValueFeIds }} />
                  )}
                  {comparedSystemFeIds.map((feId, idx) => (
                    <ComparedDeal
                      {...{
                        style: {
                          ...(idx === 0 && {
                            borderTopLeftRadius: nativeTheme.br0,
                          }),
                        },
                        key: feId,
                        feId,
                      }}
                    />
                  ))}
                </View>
                {areCompareDeals && <DealCompareValueMenu />}
              </View>
              <AddCompareDealBtn
                {...{ dealCount: comparedSystemFeIds.length }}
              />
            </View>
          </SubSectionOpen>
        </IdOfSectionToSaveProvider>
      </DealModeProvider>
    </BackBtnWrapper>
  );
}
