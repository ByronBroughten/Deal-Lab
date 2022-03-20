import React from "react";
import { useAnalyzerContext } from "../../modules/usePropertyAnalyzer";
import Loan from "./Financing/Loan";
import MainSection from "../appWide/MainSection";
import FinancingInfo from "./Financing/FinancingInfo";
import styled from "styled-components";
import theme from "../../theme/Theme";
import MainSectionTitle from "../appWide/MainSection/MainSectionTitle";
import MainSectionTitleBtn from "../appWide/MainSection/MainSectionTitle/MainSectionTitleBtn";

type Props = { className?: string };
export default function Financing(props: Props) {
  const { analyzer, handleSet } = useAnalyzerContext();
  const loanIds = analyzer.childFeIds(["financing", "loan"]);
  const addLoan = () => handleSet("addSectionAndSolve", "loan", "financing");
  return (
    <Styled {...{ ...props, sectionName: "loan" }}>
      <MainSectionTitle
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
      </MainSectionTitle>
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
