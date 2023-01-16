import { FormControl, MenuItem, Select } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import { useGetterSection } from "../../sharedWithServer/stateClassHooks/useGetterSection";
import theme from "../../theme/Theme";
import { MainSectionTopRows } from "../appWide/MainSectionTopRows";
import { OuterMainSection } from "./../appWide/GeneralSection/OuterMainSection";
import { DealOutputs } from "./ActiveDeal/DealOutputs";
import { Financing } from "./ActiveDeal/Financing";
import { Mgmt } from "./ActiveDeal/MgmtGeneral/Mgmt";
import { Property } from "./ActiveDeal/PropertyGeneral/Property";

type Props = {
  feId: string;
  loginSuccess?: boolean;
  className?: string;
};
export function ActiveDeal({ className, feId }: Props) {
  const feInfo = { sectionName: "deal", feId } as const;
  const deal = useGetterSection(feInfo);
  return (
    <Styled className={`ActiveDeal-root ${className ?? ""}`}>
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
        <Property feId={deal.onlyChildFeId("property")} />
        <Financing feId={deal.feId} />
        <Mgmt feId={deal.onlyChildFeId("mgmt")} />
      </div>
      <DealOutputs feId={feId} />
    </Styled>
  );
}

const Styled = styled(OuterMainSection)`
  padding-bottom: 0;
  @media (max-width: ${theme.mediaPhone}) {
    padding-left: ${theme.s15};
    padding-right: ${theme.s15};
  }

  .ActiveDeal-mainSectionTopRowRoot {
    margin-left: ${theme.s3};
  }
  .ActiveDeal-modeSelector {
    margin-top: ${theme.s2};
  }

  .ActiveDeal-inputSectionsWrapper {
    margin: auto;
  }

  .Property-root,
  .Financing-root,
  .Mgmt-root {
    margin-top: ${theme.dealElementSpacing};
  }

  .OutputSection-root {
    margin-top: ${theme.dealElementSpacing};
    position: sticky;
    bottom: 0;
    z-index: 3;
  }
`;
