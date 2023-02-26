import { FormControl, MenuItem, Select } from "@material-ui/core";
import React from "react";
import { useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import { constants } from "../../Constants";
import { VarbName } from "../../sharedWithServer/SectionsMeta/baseSectionsDerived/baseSectionsVarbsTypes";
import {
  CompletionStatus,
  DealMode,
} from "../../sharedWithServer/SectionsMeta/values/StateValue/subStringValues";
import { useGetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useGetterSection";
import { StrictExclude } from "../../sharedWithServer/utils/types";
import theme from "../../theme/Theme";
import { FormSection } from "../appWide/FormSection";
import { MainSectionTopRows } from "../appWide/MainSectionTopRows";
import StandardLabel from "../general/StandardLabel";
import { OutputSection } from "./ActiveDeal/DealOutputs/OutputSection";
import { DealSubSectionClosed } from "./ActiveDeal/DealSubSectionClosed";
import { Financing } from "./ActiveDeal/Financing";
import { Mgmt } from "./ActiveDeal/MgmtGeneral/Mgmt";

type SectionView = "deal" | "property" | "financing" | "mgmt";

export function ActiveDealMain() {
  const dealPage = useGetterSectionOnlyOne("dealPage");
  const deal = dealPage.onlyChild("deal");
  const calculatedVarbs = dealPage.onlyChild("calculatedVarbs");
  const [sectionView, setSectionView] = React.useState("deal" as SectionView);

  const completionStatusNames: Record<
    SectionView,
    VarbName<"calculatedVarbs">
  > = {
    property: "propertyCompletionStatus",
    financing: "financingCompletionStatus",
    mgmt: "mgmtCompletionStatus",
    deal: "dealCompletionStatus",
  };

  const makeSectionProps = (
    sectionName: StrictExclude<SectionView, "deal">
  ) => {
    return {
      feId: deal.onlyChildFeId(sectionName),
      showInputs: sectionView === sectionName,
      openInputs: () => setSectionView(sectionName),
      closeInputs: () => setSectionView("deal"),
      hide: ![sectionName, "deal"].includes(sectionView),
      dealMode: deal.valueNext("dealMode") as DealMode,
      completionStatus: calculatedVarbs.valueNext(
        completionStatusNames[sectionName]
      ) as CompletionStatus,
    };
  };

  const isDealView = sectionView === "deal";
  const navigate = useNavigate();
  return (
    <Styled className={`ActiveDealMain-root`} $showDeal={isDealView}>
      <MainSectionTopRows
        {...{
          ...deal.feInfo,
          className: "ActiveDeal-mainSectionTopRowRoot",
          sectionTitle: "Deal",
          loadWhat: "Deal",
        }}
      />
      <FormSection className="ActiveDeal-modeSelectorSection">
        <FormControl className="ActiveDeal-modeSelectorControl" size={"small"}>
          <StandardLabel className="ActiveDeal-dealModeLabel">
            Mode
          </StandardLabel>
          <Select
            className="ActiveDeal-modeSelector"
            labelId="ActiveDeal-modeSelector"
            id="demo-simple-select"
            value={"buyAndHold"}
            label="Age"
            onChange={() => {}}
          >
            <MenuItem value={"buyAndHold"}>Buy & Hold</MenuItem>
            <MenuItem value={"moreToCome"}>More to Come...</MenuItem>
          </Select>
        </FormControl>
      </FormSection>
      <FormSection className="ActiveDeal-mainFormSection">
        <div className="ActiveDeal-inputSectionsWrapper">
          <DealSubSectionClosed
            {...{
              ...makeSectionProps("property"),
              openEditor: () => navigate(constants.feRoutes.activeProperty),
              sectionTitle: "Property",

              editorPath: constants.feRoutes.activeProperty,
            }}
          />
          {/* <Property {...makeSectionProps("property")} /> */}
          <Financing {...makeSectionProps("financing")} />
          <Mgmt {...makeSectionProps("mgmt")} />
        </div>
      </FormSection>
      {
        <OutputSection
          feId={deal.onlyChildFeId("dealOutputList")}
          hide={!(sectionView === "deal")}
          completionStatus={
            calculatedVarbs.valueNext(
              "dealCompletionStatus"
            ) as CompletionStatus
          }
        />
      }
    </Styled>
  );
}

const Styled = styled.div<{ $showDeal: boolean }>`
  .ActiveDeal-modeSelector {
    margin-top: 0px;
  }

  .ActiveDeal-mainFormSection {
    padding: 0px;
  }

  ${({ $showDeal }) =>
    $showDeal &&
    css`
      .MainSubSectionClosed-root,
      .Property-root,
      .Financing-root,
      .Mgmt-root {
        margin-top: ${theme.dealElementSpacing};
      }
    `}
  ${({ $showDeal }) =>
    !$showDeal &&
    css`
      .ActiveDeal-modeSelectorSection,
      .ActiveDeal-mainSectionTopRowRoot {
        display: none;
      }
    `}

  .ActiveDeal-mainSectionTopRowRoot {
  }
  .ActiveDeal-inputSectionsWrapper {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .OutputSection-root {
    margin-top: ${theme.dealElementSpacing};
    position: sticky;
    bottom: 0;
    z-index: 3;
  }
`;
