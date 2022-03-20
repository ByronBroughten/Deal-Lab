import React from "react";
import styled from "styled-components";
import theme from "../theme/Theme";
import InputSection from "./AnalyzerMain/InputSection";
import Financing from "./AnalyzerMain/Financing";
import DealGeneral from "./AnalyzerMain/DealGeneral";

export default function AnalyzerMain({ className, ...rest }: any) {
  return (
    <>
      <Styled {...{ className: `MainSections-root ${className}`, ...rest }}>
        <div className="MainSections-viewable">
          <InputSection {...{ title: "Property", sectionName: "property" }} />
          <Financing />
          <InputSection
            {...{
              title: "Management",
              sectionName: "mgmt",
              className: "MgmtGeneral-root",
            }}
          />
        </div>
      </Styled>
      <DealGeneral className="Footer-root" />
    </>
  );
}

const Styled = styled.div`
  background: ${theme.plus.light};
  display: flex;
  flex: 1;

  .MainSections-viewable {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  .MgmtGeneral-root {
    display: flex;
    flex: 1;
  }
`;
