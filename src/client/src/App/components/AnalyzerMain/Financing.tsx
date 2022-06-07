import React from "react";
import styled from "styled-components";
import { useSetterSection } from "../../sharedWithServer/stateClassHooks/useSetterSection";
import theme from "../../theme/Theme";
import MainSection from "../appWide/GeneralSection";
import GeneralSectionTitle from "../appWide/GeneralSection/GeneralSectionTitle";
import MainSectionTitleBtn from "../appWide/GeneralSection/GeneralSectionTitle/MainSectionTitleBtn";
import FinancingInfo from "./Financing/FinancingInfo";
import Loan from "./Financing/Loan";

type Props = { feId: string; className?: string };
export default function Financing({ feId, ...rest }: Props) {
  const financing = useSetterSection({
    sectionName: "financing",
    feId,
  });
  const loanIds = financing.childFeIds("loan");
  const addLoan = () => financing.addChild("loan");
  return (
    <Styled {...{ ...rest, sectionName: "loan", className: "Financing-root" }}>
      <GeneralSectionTitle
        {...{
          title: "Financing",
          themeName: "loan",
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
      <FinancingInfo feId={feId} />
      <div className="MainSection-entries">
        {loanIds.map((feId) => (
          <Loan key={feId} feId={feId} />
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
