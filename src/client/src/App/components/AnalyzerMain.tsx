import React from "react";
import { View } from "react-native";
import styled from "styled-components";
import theme from "../theme/Theme";
import DealGeneral from "./AnalyzerMain/DealGeneral";
import Financing from "./AnalyzerMain/Financing";
import InputSection from "./AnalyzerMain/InputSection";

export default function AnalyzerMain({ className, ...rest }: any) {
  return (
    <>
      <Styled {...{ className: `MainSections-root ${className}`, ...rest }}>
        <View style={{ flex: 1 }}>
          <InputSection {...{ title: "Property", sectionName: "property" }} />
          <InputSection
            {...{
              title: "Management",
              sectionName: "mgmt",
              className: "MgmtGeneral-root",
            }}
          />
          <Financing />
        </View>
      </Styled>
      <DealGeneral className="Footer-root" />
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
