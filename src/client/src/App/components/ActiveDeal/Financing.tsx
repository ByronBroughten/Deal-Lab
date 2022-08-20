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
    <Styled {...{ ...rest, themeName: "loan", className: "Financing-root" }}>
      <GeneralSectionTitle {...{ title: "Financing", themeName: "loan" }} />
      <FinancingInfo feId={feId} />
      <div className="MainSection-entries">
        {loanIds.map((feId) => (
          <Loan key={feId} feId={feId} />
        ))}
      </div>
      <div className="MainSection-addEntryBtnDiv">
        <MainSectionTitleBtn
          themeName="loan"
          className="Financing-mainSectionTitleBtn"
          onClick={addLoan}
        >
          Add Loan
        </MainSectionTitleBtn>
      </div>
    </Styled>
  );
}

const Styled = styled(MainSection)`
  .FinancingInfo-root {
    margin-top: ${theme.s2};
  }
  .MainSection-entries {
    margin-top: ${theme.s2};
  }

  .Financing-mainSectionTitleBtn {
    width: 75%;
    max-width: 600px;
    height: 40px;
    background: ${theme.loan.main};
    :hover,
    :active {
      background-color: ${theme.loan.dark};
    }
  }
  .MainSection-addEntryBtnDiv {
    display: flex;
    justify-content: center;
    padding-bottom: ${theme.s4};
  }
  .Loan-root {
    border-top: 2px solid ${theme.loan.main};
  }
`;
