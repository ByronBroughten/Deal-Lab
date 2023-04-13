import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { View } from "react-native";
import { StateValue } from "../../sharedWithServer/SectionsMeta/values/StateValue";
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
  const titleSource = deal.valueNext("displayNameSource");
  const updateValue = useAction("updateValue");

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
            size={"small"}
            variant="filled"
          >
            <InputLabel
              sx={{
                fontSize: nativeTheme.fs22,
                color: nativeTheme.primary.main,
              }}
            >
              Deal type
            </InputLabel>
            <Select
              labelId="ActiveDeal-modeSelector"
              id="demo-simple-select"
              value={dealMode}
              label={"Deal type"}
            >
              <MenuItem value={"buyAndHold"}>Buy & Hold</MenuItem>
              <MenuItem value={"moreToCome"}>More to Come...</MenuItem>
            </Select>
          </FormControl>
        </Row>

        <Box sx={{ flexDirection: "row", mt: nativeTheme.s3 }}>
          <FormControl size={"small"} variant="filled">
            <InputLabel
              sx={{
                fontSize: nativeTheme.fs22,
                color: nativeTheme.primary.main,
              }}
            >
              Title
            </InputLabel>
            <Select
              onChange={(e) => {
                updateValue({
                  ...deal.varbNext("displayNameSource").feVarbInfo,
                  value: e.target.value as StateValue<"dealDisplayNameSource">,
                });
              }}
              labelId="ActiveDeal-modeSelector"
              id="demo-simple-select"
              value={titleSource}
              label={"Title"}
            >
              <MenuItem value={"defaultDisplayName"}>Default</MenuItem>
              <MenuItem value={"displayNameEditor"}>Custom</MenuItem>
            </Select>
          </FormControl>
          {titleSource === "displayNameEditor" && (
            <BigStringEditor
              {...{
                feVarbInfo: deal.varbNext("displayNameEditor").feVarbInfo,
                sx: {
                  mt: nativeTheme.s4,
                  "& .MuiInputBase-root": {
                    borderTopLeftRadius: 0,
                  },
                },
              }}
            />
          )}
        </Box>
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
