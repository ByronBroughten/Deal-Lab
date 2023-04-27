import { View } from "react-native";
import { BackBtnWrapper } from "../appWide/BackBtnWrapper";
import { BackgroundContainer } from "../appWide/BackgroundContainter";
import { MuiSelect } from "../appWide/MuiSelect";
import { BigStringEditor } from "../inputs/BigStringEditor";
import { nativeTheme } from "./../../theme/nativeTheme";
import { SectionTitle } from "./../appWide/SectionTitle";
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
  const completionStatus = calcVarbs.value("dealCompletionStatus");
  return (
    <BackBtnWrapper {...{ to: "account", label: "Deal Menu" }}>
      <BackgroundContainer>
        <SectionTitle
          sx={{ fontSize: nativeTheme.fs24, marginTop: nativeTheme.s35 }}
          text="Deal"
        />
        <Row
          style={{
            alignItems: "flex-end",
            marginTop: nativeTheme.s35,
          }}
        >
          <MuiSelect
            {...{
              feVarbInfo: {
                sectionName: "deal",
                feId: deal.feId,
                varbName: "dealMode",
              },
              unionValueName: "dealMode",
              items: [
                ["buyAndHold", "Buy & Hold"],
                ["fixAndFlip", "Fix & Flip"],
              ],
              label: "Type",
            }}
          />
          <BigStringEditor
            {...{
              label: "Title",
              // placeholder: "Title",
              feVarbInfo: deal.varbNext("displayNameEditor").feVarbInfo,
              sx: { ml: nativeTheme.s35 },
            }}
          />
        </Row>
        <View>
          <DealSubSectionClosed {...dealElementProps} sectionName="property" />
          <DealSubSectionClosed {...dealElementProps} sectionName="financing" />
          <DealSubSectionClosed {...dealElementProps} sectionName="mgmt" />
        </View>
        <OutputSection
          {...dealElementProps}
          feId={feStore.onlyChildFeId("outputSection")}
          disableOpenOutputs={completionStatus !== "allValid"}
        />
      </BackgroundContainer>
    </BackBtnWrapper>
  );
}
