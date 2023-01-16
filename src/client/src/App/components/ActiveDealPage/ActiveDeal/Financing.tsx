import React from "react";
import styled from "styled-components";
import { useSetterSection } from "../../../sharedWithServer/stateClassHooks/useSetterSection";
import { MainSectionBtn } from "../../appWide/GeneralSection/GeneralSectionTitle/MainSectionBtn";
import theme from "./../../../theme/Theme";
import { Loan } from "./Financing/Loan";

type Props = { feId: string; className?: string };
export function Financing({ feId, className }: Props) {
  const deal = useSetterSection({
    sectionName: "deal",
    feId,
  });
  const loanIds = deal.childFeIds("loan");
  const addLoan = () => deal.addChild("loan");
  return (
    <Styled
      {...{ themeName: "loan", className: `Financing-root ${className ?? ""}` }}
    >
      <div className={"Financing-loans"}>
        {loanIds.map((feId, idx) => (
          <Loan
            key={feId}
            feId={feId}
            className={idx !== 0 ? "Financing-marginLoan" : ""}
          />
        ))}
      </div>
      <MainSectionBtn
        className="Financing-addLoanBtn"
        onClick={addLoan}
        text="+ Loan"
      />
    </Styled>
  );
}

const Styled = styled.div`
  .Financing-marginLoan,
  .Financing-addLoanBtn {
    margin-top: ${theme.s2};
  }
`;
