import React from "react";
import styled from "styled-components";
import { useGetterSection } from "../../sharedWithServer/stateClassHooks/useGetterSection";
import theme from "../../theme/Theme";
import { useSaveStatus } from "../appWide/GeneralSection/MainSection/useSaveStatus";
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
  const saveStatus = useSaveStatus(feInfo);
  return (
    <Styled className={`ActiveDeal-root ${className ?? ""}`}>
      <MainSectionTopRows
        {...{
          ...feInfo,
          sectionTitle: "Deal",
          loadWhat: "Deal"
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
