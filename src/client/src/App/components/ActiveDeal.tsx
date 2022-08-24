import React from "react";
import { View } from "react-native";
import styled from "styled-components";
import { useGetterSection } from "../sharedWithServer/stateClassHooks/useGetterSection";
import theme from "../theme/Theme";
import DealStats from "./ActiveDeal/DealStats";
import Financing from "./ActiveDeal/Financing";
import { MgmtGeneral } from "./ActiveDeal/MgmtGeneral";
import { PropertyGeneral } from "./ActiveDeal/PropertyGeneral";
import { PageMain } from "./general/PageMain";

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
        <Financing feId={deal.onlyChildFeId("financing")} />
        <MgmtGeneral feId={deal.onlyChildFeId("mgmtGeneral")} />
      </View>
      <DealStats feId={feId} />
    </Styled>
  );
}

const Styled = styled(PageMain)`
  background: ${theme.mgmt.light};
  .DealStats-root {
    position: sticky;
    bottom: 0;
    z-index: 3;
  }
`;
