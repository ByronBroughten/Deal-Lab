import React from "react";
import { View } from "react-native";
import styled from "styled-components";
import { useGetterSection } from "../sharedWithServer/StateHooks/useGetterSection";
import theme from "../theme/Theme";
import DealStats from "./AnalyzerMain/DealStats";
import Financing from "./AnalyzerMain/Financing";
import { MgmtGeneral } from "./AnalyzerMain/MgmtGeneral";
import { PropertyGeneral } from "./AnalyzerMain/PropertyGeneral";

type Props = {
  feId: string;
  className?: string;
};
export function DealMain({ className, feId }: Props) {
  const analysis = useGetterSection({
    sectionName: "analysis",
    feId,
  });
  return (
    <>
      <Styled {...{ className: `MainSections-root ${className ?? ""}` }}>
        <View style={{ flex: 1 }}>
          <PropertyGeneral feId={analysis.onlyChildFeId("propertyGeneral")} />
          <MgmtGeneral feId={analysis.onlyChildFeId("mgmtGeneral")} />
          <Financing feId={analysis.onlyChildFeId("financing")} />
        </View>
      </Styled>
      <DealStats className="Footer-root" feId={feId} />
    </>
  );
}

const Styled = styled.div`
  background: ${theme.plus.light};
  display: flex;
  flex: 1;

  .Financing-root {
    display: flex;
    flex: 1;
  }
`;
