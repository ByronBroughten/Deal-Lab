import React from "react";
import styled from "styled-components";
import { useAnalyzerContext } from "../../modules/usePropertyAnalyzer";
import theme from "../../theme/Theme";
import MainSection from "../appWide/GeneralSection";
import GeneralSectionTitle from "../appWide/GeneralSection/GeneralSectionTitle";
import MainSectionTitleBtn from "../appWide/GeneralSection/GeneralSectionTitle/MainSectionTitleBtn";
import FinancingInfo from "./Financing/FinancingInfo";
import Loan from "./Financing/Loan";

type Props = { className?: string };
export default function Financing(props: Props) {
  const { analyzer, handleSet } = useAnalyzerContext();
  const section = analyzer.section("financing");
  const loanIds = section.childFeIds("loan");
  const addLoan = () => handleSet("addSectionAndSolve", "loan", "financing");
  return (
    <Styled {...{ ...props, sectionName: "loan", className: "Financing-root" }}>
      <GeneralSectionTitle
        {...{
          title: "Financing",
          sectionName: "loan",
        }}
      >
        <MainSectionTitleBtn
          themeName="loan"
          className="Financing-mainSectionTitleBtn"
          onClick={addLoan}
        >
          + Loan
        </MainSectionTitleBtn>
      </GeneralSectionTitle>
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
  .Financing-mainSectionTitleBtn {
    width: 50%;
  }
  div.MainSection-entry.Loan-root {
    border-top: 2px solid ${theme.loan.dark};
  }
`;
