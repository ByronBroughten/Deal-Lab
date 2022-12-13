import React from "react";
import styled from "styled-components";
import { useSetterSection } from "../../sharedWithServer/stateClassHooks/useSetterSection";
import theme from "../../theme/Theme";
import { GeneralSection } from "../appWide/GeneralSection";
import { MainSectionBtn } from "../appWide/GeneralSection/GeneralSectionTitle/MainSectionBtn";
import { Loan } from "./Financing/Loan";

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
      {/* <FinancingInfo feId={feId} /> */}
      <div className="MainSection-entries">
        {loanIds.map((feId) => (
          <Loan key={feId} feId={feId} />
        ))}
      </div>
      <div className="GeneralSection-addEntryBtnDiv">
        <MainSectionBtn
          className="MainSection-addChildBtn"
          onClick={addLoan}
          text="+ Loan"
        />
      </div>
    </Styled>
  );
}

const Styled = styled(GeneralSection)`
  .FinancingInfo-root {
    margin-top: ${theme.s2};
  }
`;
