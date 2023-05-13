import { View } from "react-native";
import { isDealMode } from "../../sharedWithServer/SectionsMeta/values/StateValue/dealMode";
import { BackBtnWrapper } from "../appWide/BackBtnWrapper";
import { BackgroundContainer } from "../appWide/BackgroundContainter";
import { PageTitle } from "../appWide/PageTitle";
import { BigStringEditor } from "../inputs/BigStringEditor";
import { nativeTheme } from "./../../theme/nativeTheme";
import { Row } from "./../general/Row";
import { OutputSection } from "./ActiveDeal/DealOutputs/OutputSection";
import { DealSubSectionClosed } from "./ActiveDeal/DealSubSectionClosed";
import { useActiveDealPage } from "./ActiveDeal/useActiveDealSection";

const dealElementProps = {
  sx: {
    marginTop: nativeTheme.s5,
  },
};

export function ActiveDealMain() {
  const { deal, calcVarbs, feStore } = useActiveDealPage();
  const dealMode = deal.valueNext("dealMode");
  const completionStatus = calcVarbs.value("dealCompletionStatus");

  return (
    <BackBtnWrapper {...{ to: "account", label: "Deal Menu" }}>
      <BackgroundContainer>
        <PageTitle sx={{ marginTop: nativeTheme.s35 }} text="Deal" />
        <Row
          style={{
            alignItems: "flex-end",
            marginTop: nativeTheme.s35,
          }}
        >
          <BigStringEditor
            {...{
              label: "Title",
              feVarbInfo: deal.varbNext("displayNameEditor").feVarbInfo,
            }}
          />
        </Row>
        <View>
          <DealSubSectionClosed {...dealElementProps} sectionName="property" />
          <DealSubSectionClosed {...dealElementProps} sectionName="financing" />
          {isDealMode(dealMode, "hasMgmt") && (
            <DealSubSectionClosed {...dealElementProps} sectionName="mgmt" />
          )}
        </View>
        <OutputSection
          {...{
            ...dealElementProps,
            feId: feStore.onlyChildFeId("outputSection"),
            disableOpenOutputs: completionStatus !== "allValid",
            dealMode,
          }}
        />
      </BackgroundContainer>
    </BackBtnWrapper>
  );
}
