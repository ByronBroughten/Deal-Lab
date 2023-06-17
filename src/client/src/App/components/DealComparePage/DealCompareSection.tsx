import { View } from "react-native";
import { outputListName } from "../../sharedWithServer/defaultMaker/makeDefaultOutputSection";
import { useGetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useGetterSection";
import { IdOfSectionToSaveProvider } from "../../sharedWithServer/stateClassHooks/useIdOfSectionToSave";
import { nativeTheme } from "../../theme/nativeTheme";
import { SubSectionOpen } from "../ActiveDealPage/ActiveDeal/SubSectionOpen";
import { BackBtnWrapper } from "../appWide/BackBtnWrapper";
import { PageTitle } from "../appWide/PageTitle";
import { DealModeProvider } from "../customContexts/dealModeContext";
import { MuiRow } from "../general/MuiRow";
import { AddCompareDealBtn } from "./AddCompareDealBtn";
import { ComparedDeal } from "./ComparedDeal";
import { ComparedDealXBtns } from "./ComparedDealXBtns";
import { CompareDealModeSelector } from "./CompareDealModeSelector";
import { DealCompareValueMenu } from "./DealCompareValueMenu";

export function DealCompareSection() {
  const mainMenu = useGetterSectionOnlyOne("dealCompareMainMenu");
  const dealMode = mainMenu.valueNext("dealMode");
  const listName = outputListName(dealMode);
  const outputList = mainMenu.onlyChild(listName);

  const compareValueFeIds = outputList.childFeIds("outputItem");
  const comparedFeIds = mainMenu.childFeIds("comparedDealSystem");

  const areCompareDeals = comparedFeIds.length > 0;
  return (
    <BackBtnWrapper {...{ label: "Deal Menu", to: "account" }}>
      <DealModeProvider dealMode={"mixed"}>
        <IdOfSectionToSaveProvider {...{ storeId: mainMenu.mainStoreId }}>
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
                    <ComparedDealXBtns {...{ compareValueFeIds }} />
                  )}
                  {comparedFeIds.map((feId, idx) => (
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
              <AddCompareDealBtn {...{ dealCount: comparedFeIds.length }} />
            </View>
          </SubSectionOpen>
        </IdOfSectionToSaveProvider>
      </DealModeProvider>
    </BackBtnWrapper>
  );
}
