import React from "react";
import { useAnalyzerContext } from "../../../modules/usePropertyAnalyzer";
import Loan from "./Financing/Loan";
import MainSection from "../../appWide/MainSection";
import FinancingInfo from "./Financing/FinancingInfo";
import MainSectionTitleAddEntry from "../../appWide/MainSection/MainSectionTitleAddEntry";
import styled from "styled-components";
import theme from "../../../theme/Theme";

type Props = { className?: string };
export default function Financing(props: Props) {
  const { analyzer } = useAnalyzerContext();
  const loanIds = analyzer.childFeIds(["financing", "loan"]);
  return (
    <Styled {...{ ...props, sectionName: "loan" }}>
      <MainSectionTitleAddEntry
        {...{
          title: "Financing",
          sectionName: "loan",
          parentName: "financing",
          btnTitle: "Add Loan",
        }}
      />
      <FinancingInfo />
      <div className="MainSection-entries">
        {loanIds.map((id) => (
          <Loan key={id} id={id} />
        ))}
      </div>
    </Styled>
  );
}

const Styled = styled(MainSection)`
  div.MainSection-entry.Loan-root {
    border-top: 2px solid ${theme.loan.dark};
  }
`;
