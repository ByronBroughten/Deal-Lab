import { FormControl, MenuItem, Select } from "@material-ui/core";
import React from "react";
import styled, { css } from "styled-components";
import { VarbName } from "../../sharedWithServer/SectionsMeta/baseSectionsDerived/baseSectionsVarbsTypes";
import { CompletionStatus } from "../../sharedWithServer/SectionsMeta/baseSectionsDerived/subValues";
import { useGetterSection } from "../../sharedWithServer/stateClassHooks/useGetterSection";
import { StrictExclude } from "../../sharedWithServer/utils/types";
import theme from "../../theme/Theme";
import { FormSection } from "../appWide/FormSection";
import { MainSectionTopRows } from "../appWide/MainSectionTopRows";
import StandardLabel from "../general/StandardLabel";
import { OuterMainSection } from "./../appWide/GeneralSection/OuterMainSection";
import { OutputSection } from "./ActiveDeal/DealOutputs/OutputSection";
import { Financing } from "./ActiveDeal/Financing";
import { Mgmt } from "./ActiveDeal/MgmtGeneral/Mgmt";
import { Property } from "./ActiveDeal/PropertyGeneral/Property";

type Props = {
  feId: string;
  loginSuccess?: boolean;
  className?: string;
};

type SectionView = "deal" | "property" | "financing" | "mgmt";

export function ActiveDeal({ className, feId }: Props) {
  const feInfo = { sectionName: "dealPage", feId } as const;
  const dealPage = useGetterSection(feInfo);

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
      completionStatus: calculatedVarbs.valueNext(
        completionStatusNames[sectionName]
      ) as CompletionStatus,
    };
  };

  const isDealView = sectionView === "deal";
  return (
    <Styled
      className={`ActiveDeal-root ${className ?? ""}`}
      $showDeal={isDealView}
    >
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
      <div className="ActiveDeal-inputSectionsWrapper">
        <Property {...makeSectionProps("property")} />
        <Financing {...makeSectionProps("financing")} />
        <Mgmt {...makeSectionProps("mgmt")} />
      </div>
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

const Styled = styled(OuterMainSection)<{ $showDeal: boolean }>`
  padding-bottom: 0;
  @media (max-width: ${theme.mediaPhone}) {
    padding-left: ${theme.s15};
    padding-right: ${theme.s15};
  }

  .ActiveDeal-modeSelector {
    margin-top: 0px;
  }

  ${({ $showDeal }) =>
    $showDeal &&
    css`
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
    padding-bottom: ${theme.s35};
  }

  .OutputSection-root {
    margin-top: ${theme.dealElementSpacing};
    position: sticky;
    bottom: 0;
    z-index: 3;
  }

  .ActiveDeal-inputSectionsWrapper {
    /* margin: auto; */
  }
`;
