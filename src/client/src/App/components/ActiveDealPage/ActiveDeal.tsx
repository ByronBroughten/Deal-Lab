import { FormControl, MenuItem, Select } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import { useGetterSection } from "../../sharedWithServer/stateClassHooks/useGetterSection";
import theme from "../../theme/Theme";
import { MainSectionTopRows } from "../appWide/MainSectionTopRows";
import { OuterMainSection } from "./../appWide/GeneralSection/OuterMainSection";
import { DealGeneral } from "./ActiveDeal/DealGeneral";
import Financing from "./ActiveDeal/Financing";
import { MgmtGeneral } from "./ActiveDeal/MgmtGeneral";
import { PropertyGeneral } from "./ActiveDeal/PropertyGeneral";

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
        <PropertyGeneral feId={deal.onlyChildFeId("propertyGeneral")} />
        <MgmtGeneral feId={deal.onlyChildFeId("mgmtGeneral")} />
        <Financing feId={deal.onlyChildFeId("financing")} />
      </div>
      <DealGeneral feId={feId} />
    </Styled>
  );
}

const Styled = styled(OuterMainSection)`
  .ActiveDeal-mainSectionTopRowRoot {
    margin-left: ${theme.s3};
  }
  .ActiveDeal-modeSelector {
    margin-top: ${theme.s2};
  }
  .PropertyGeneral-root {
    padding-top: ${theme.s35};
  }

  .ActiveDeal-inputSectionsWrapper {
    margin: auto;
  }
  .DealGeneral-root {
    position: sticky;
    bottom: 0;
    z-index: 3;
  }
`;
