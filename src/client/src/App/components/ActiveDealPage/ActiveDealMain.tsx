import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { View } from "react-native";
import { useSetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useSetterSection";
import { BackBtnWrapper } from "../appWide/BackBtnWrapper";
import { BackgroundContainer } from "../appWide/BackgroundContainter";
import { nativeTheme } from "./../../theme/nativeTheme";
import { SectionTitle } from "./../appWide/SectionTitle";
import { Row } from "./../general/Row";
import { OutputSection } from "./ActiveDeal/DealOutputs/OutputSection";
import { DealSubSectionClosed } from "./ActiveDeal/DealSubSectionClosed";

const dealElementProps = {
  sx: {
    marginTop: nativeTheme.s5,
  },
};
export function ActiveDealMain() {
  const main = useSetterSectionOnlyOne("main");
  const feStore = main.onlyChild("feStore");
  const outputSection = feStore.get.onlyChild("outputSection");
  const dealPage = main.onlyChild("activeDealPage");
  const calculatedVarbs = dealPage.onlyChild("calculatedVarbs");
  const completionStatus = calculatedVarbs.value("dealCompletionStatus");
  return (
    <BackBtnWrapper {...{ to: "account", label: "Deal Menu" }}>
      <BackgroundContainer>
        <Row
          style={{
            alignItems: "flex-end",
          }}
        >
          <SectionTitle sx={{ fontSize: nativeTheme.fs24 }} text="Deal" />
          <FormControl
            sx={{ marginLeft: nativeTheme.s4 }}
            className="ActiveDeal-modeSelectorControl"
            size={"small"}
            variant="filled"
          >
            <InputLabel
              sx={{
                fontSize: nativeTheme.fs20,
                color: nativeTheme.primary.main,
              }}
            >
              Mode
            </InputLabel>
            <Select
              className="ActiveDeal-modeSelector"
              labelId="ActiveDeal-modeSelector"
              id="demo-simple-select"
              value={"buyAndHold"}
              label={"Mode"}
            >
              <MenuItem value={"buyAndHold"}>Buy & Hold</MenuItem>
              <MenuItem value={"moreToCome"}>More to Come...</MenuItem>
            </Select>
          </FormControl>
        </Row>
        <View>
          <DealSubSectionClosed {...dealElementProps} sectionName="property" />
          <DealSubSectionClosed {...dealElementProps} sectionName="financing" />
          <DealSubSectionClosed {...dealElementProps} sectionName="mgmt" />
        </View>
        <OutputSection
          {...dealElementProps}
          feId={outputSection.onlyChildFeId("buyAndHoldOutputList")}
          disableOpenOutputs={completionStatus !== "allValid"}
          outputsIsOpen={dealPage.value("showOutputs")}
          openOutputs={() =>
            dealPage.updateValues({
              showOutputs: true,
            })
          }
        />
      </BackgroundContainer>
    </BackBtnWrapper>
  );
}
