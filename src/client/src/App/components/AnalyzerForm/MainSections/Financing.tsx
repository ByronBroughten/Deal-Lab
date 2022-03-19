import React from "react";
import { useAnalyzerContext } from "../../../modules/usePropertyAnalyzer";
import Loan from "./Financing/Loan";
import MainSection from "../../appWide/MainSection";
import FinancingInfo from "./Financing/FinancingInfo";
import styled from "styled-components";
import theme from "../../../theme/Theme";
import MainSectionTitle from "../../appWide/MainSection/MainSectionTitle";
import AddSectionEntryBtn from "../../appWide/MainSection/AddSectionEntryBtn";

type Props = { className?: string };
export default function Financing(props: Props) {
  const { analyzer } = useAnalyzerContext();
  const loanIds = analyzer.childFeIds(["financing", "loan"]);
  return (
    <Styled {...{ ...props, sectionName: "loan" }}>
      <MainSectionTitle
        {...{
          title: "Financing",
          sectionName: "loan",
        }}
      >
        <AddSectionEntryBtn {...{ sectionName: "loan", title: "+ Loan" }} />
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
  div.MainSection-entry.Loan-root {
    border-top: 2px solid ${theme.loan.dark};
  }
`;
