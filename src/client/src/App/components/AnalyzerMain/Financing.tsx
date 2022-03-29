import React from "react";
import { useAnalyzerContext } from "../../modules/usePropertyAnalyzer";
import Loan from "./Financing/Loan";
import MainSection from "../appWide/GeneralSection";
import FinancingInfo from "./Financing/FinancingInfo";
import styled from "styled-components";
import theme from "../../theme/Theme";
import GeneralSectionTitle from "../appWide/GeneralSection/GeneralSectionTitle";
import MainSectionTitleBtn from "../appWide/GeneralSection/GeneralSectionTitle/MainSectionTitleBtn";

type Props = { className?: string };
export default function Financing(props: Props) {
  const { analyzer, handleSet } = useAnalyzerContext();
  const section = analyzer.section("financing");
  const loanIds = section.childFeIds("loan");
  const addLoan = () => handleSet("addSectionAndSolve", "loan", "financing");
  return (
    <Styled {...{ ...props, sectionName: "loan" }}>
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
