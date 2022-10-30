import React from "react";
import { View } from "react-native";
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
      <View style={{ flex: 1 }}>
        <PropertyGeneral feId={deal.onlyChildFeId("propertyGeneral")} />
        <MgmtGeneral feId={deal.onlyChildFeId("mgmtGeneral")} />
        <Financing feId={deal.onlyChildFeId("financing")} />
      </View>
      <DealGeneral feId={feId} />
    </Styled>
  );
}

const Styled = styled(PageMainFn)`
  border: solid 3px ${theme.deal.main};
  border-top: solid 1px ${theme["gray-500"]};
  background: ${theme.loan.light};
  .DealGeneral-root {
    position: sticky;
    bottom: 0;
    z-index: 3;
  }
`;
