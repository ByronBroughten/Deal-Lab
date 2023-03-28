import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { View } from "react-native";
import { BackBtnWrapper } from "../appWide/BackBtnWrapper";
import { BackgroundContainer } from "../appWide/BackgroundContainter";
import { useSetterSections } from "./../../sharedWithServer/stateClassHooks/useSetterSections";
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
  const sections = useSetterSections();
  if (sections.hasActiveDeal()) {
    return <HasActiveDeal />;
  } else {
    return <NoActiveDeal />;
  }
}

function NoActiveDeal() {
  return (
    <BackBtnWrapper {...{ to: "account", label: "Deal Menu" }}>
      <BackgroundContainer>
        <Row style={{ alignItems: "flex-end" }}>
          <SectionTitle sx={{ fontSize: nativeTheme.fs24 }} text="Deal" />
        </Row>
      </BackgroundContainer>
    </BackBtnWrapper>
  );
}

function HasActiveDeal() {
  const { deal, calcVarbs, feStore } = useActiveDealPage();
  const completionStatus = calcVarbs.value("dealCompletionStatus");
  const dealMode = deal.value("dealMode");
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
              value={dealMode}
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
          feId={feStore.onlyChildFeId("outputSection")}
          disableOpenOutputs={completionStatus !== "allValid"}
        />
      </BackgroundContainer>
    </BackBtnWrapper>
  );
}
