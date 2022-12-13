import React from "react";
import styled from "styled-components";
import { useGetterSection } from "../sharedWithServer/stateClassHooks/useGetterSection";
import theme from "../theme/Theme";
import { DealGeneral } from "./ActiveDeal/DealGeneral";
import Financing from "./ActiveDeal/Financing";
import { MgmtGeneral } from "./ActiveDeal/MgmtGeneral";
import { PropertyGeneral } from "./ActiveDeal/PropertyGeneral";
import { PageMainFn } from "./general/PageMain";

type Props = {
  feId: string;
  loginSuccess?: boolean;
  className?: string;
};
export function ActiveDeal({ className, feId }: Props) {
  const deal = useGetterSection({
    sectionName: "deal",
    feId,
  });
  return (
    <Styled {...{ className: `MainSections-root ${className ?? ""}` }}>
      <div className="ActiveDeal-inputSectionsWrapper">
        <div className="ActiveDeal-inputSections" style={{ flex: 0 }}>
          <PropertyGeneral feId={deal.onlyChildFeId("propertyGeneral")} />
          <MgmtGeneral feId={deal.onlyChildFeId("mgmtGeneral")} />
          <Financing feId={deal.onlyChildFeId("financing")} />
        </div>
      </div>
      <DealGeneral feId={feId} />
    </Styled>
  );
}

const Styled = styled(PageMainFn)`
  display: flex;
  flex: 0;
  background: ${theme.mainBackground};
  .PropertyGeneral-root {
    padding-top: ${theme.s4};
    margin-top: ${theme.s1};
  }
  .ActiveDeal-inputSections {
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
