import { FormControl, MenuItem, Select } from "@material-ui/core";
import React from "react";
import styled, { css } from "styled-components";
import { useGetterSection } from "../../sharedWithServer/stateClassHooks/useGetterSection";
import { StrictExclude } from "../../sharedWithServer/utils/types";
import theme from "../../theme/Theme";
import { MainSectionTopRows } from "../appWide/MainSectionTopRows";
import { OuterMainSection } from "./../appWide/GeneralSection/OuterMainSection";
import { OutputSection } from "./ActiveDeal/DealOutputs/DealOutputSection";
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
  const feInfo = { sectionName: "deal", feId } as const;
  const deal = useGetterSection(feInfo);
  const [sectionView, setSectionView] = React.useState("deal" as SectionView);

  const makeSectionProps = (
    sectionName: StrictExclude<SectionView, "deal">
  ) => ({
    feId: deal.onlyChildFeId(sectionName),
    showInputs: sectionView === sectionName,
    openInputs: () => setSectionView(sectionName),
    closeInputs: () => setSectionView("deal"),
    hide: ![sectionName, "deal"].includes(sectionView),
  });

  const isDealView = sectionView === "deal";
  return (
    <Styled
      className={`ActiveDeal-root ${className ?? ""}`}
      $showDeal={isDealView}
    >
      <MainSectionTopRows
        {...{
          ...feInfo,
          className: "ActiveDeal-mainSectionTopRowRoot",
          sectionTitle: "Deal",
          loadWhat: "Deal",
          belowTitle: (
            <FormControl className="ActiveDeal-modeSelector" size={"small"}>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={"buyAndHold"}
                label="Age"
                onChange={() => {}}
              >
                <MenuItem value={"buyAndHold"}>Buy & Hold</MenuItem>
                <MenuItem value={"moreToCome"}>More to Come...</MenuItem>
              </Select>
            </FormControl>
          ),
        }}
      />
      <div className="ActiveDeal-inputSectionsWrapper">
        <Property {...makeSectionProps("property")} />
        <Financing {...makeSectionProps("financing")} />
        <Mgmt {...makeSectionProps("mgmt")} />
      </div>
      <OutputSection
        feId={feId}
        hide={!(sectionView === "deal")}
        detailsIsOpen={false}
      />
    </Styled>
  );
}

const Styled = styled(OuterMainSection)<{ $showDeal: boolean }>`
  padding-bottom: 0;
  @media (max-width: ${theme.mediaPhone}) {
    padding-left: ${theme.s15};
    padding-right: ${theme.s15};
  }

  .ActiveDeal-mainSectionTopRowRoot {
    margin-left: ${theme.s3};
    ${({ $showDeal }) =>
      !$showDeal &&
      css`
        display: none;
      `}
  }
  .ActiveDeal-modeSelector {
    margin-top: ${theme.s2};
  }

  .ActiveDeal-inputSectionsWrapper {
    /* margin: auto; */
  }

  ${({ $showDeal }) =>
    $showDeal &&
    css`
      .Property-root,
      .Financing-root,
      .Mgmt-root {
        margin-top: ${theme.dealElementSpacing};
      }
    `}

  .OutputSection-root {
    margin-top: ${theme.dealElementSpacing};
    position: sticky;
    bottom: 0;
    z-index: 3;
  }
`;
