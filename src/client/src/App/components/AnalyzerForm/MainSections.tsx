import React from "react";
import styled from "styled-components";
import theme from "../../theme/Theme";
import InputSection from "./MainSections/InputSection";
import Financing from "./MainSections/Financing";
import CurrentDeal from "./AnalysisFooter/DealGeneral";
import TotalInsAndOuts from "./MainSections/TotalInsAndOuts";

export default function MainSections(props: any) {
  return (
    <>
      <Styled {...props}>
        <div className="MainSections-viewable">
          <InputSection {...{ title: "Property", sectionName: "property" }} />
          <Financing />
          <InputSection {...{ title: "Management", sectionName: "mgmt" }} />
          {/* <TotalInsAndOuts /> */}
          <CurrentDeal />
        </div>
      </Styled>
    </>
  );
}

const Styled = styled.div.attrs(({ className, ...rest }) => ({
  className: "MainSections-root " + className,
  ...rest,
}))`
  display: flex;
  justify-content: center;
  background: ${theme.plus.light};
  position: relative;

  .MainSections-viewable {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .CurrentDeal-root {
    position: sticky;
    bottom: 0;
    z-index: 3;
  }
`;
