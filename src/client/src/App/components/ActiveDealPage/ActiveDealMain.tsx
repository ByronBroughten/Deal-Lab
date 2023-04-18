import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { View } from "react-native";
import { useAction } from "../../sharedWithServer/stateClassHooks/useAction";
import { BackBtnWrapper } from "../appWide/BackBtnWrapper";
import { BackgroundContainer } from "../appWide/BackgroundContainter";
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
  const dealMode = deal.valueNext("dealMode");
  const updateValue = useAction("updateValue");

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
          <FormControl size={"small"} variant="filled">
            <InputLabel
              sx={{
                fontSize: nativeTheme.fs22,
                color: nativeTheme.primary.main,
              }}
            >
              Type
            </InputLabel>
            <Select
              sx={{
                backgroundColor: nativeTheme.light,
                ...nativeTheme.subSection.borderLines,
                borderBottomWidth: 0,
              }}
              labelId="ActiveDeal-modeSelector"
              id="demo-simple-select"
              value={dealMode}
              label={"Type"}
            >
              <MenuItem value={"buyAndHold"}>Buy & Hold</MenuItem>
              <MenuItem value={"moreToCome"}>More to Come...</MenuItem>
            </Select>
          </FormControl>
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
