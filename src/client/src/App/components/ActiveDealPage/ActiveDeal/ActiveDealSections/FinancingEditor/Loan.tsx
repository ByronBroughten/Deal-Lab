import React from "react";
import styled from "styled-components";
import { useGetterSection } from "../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import MainSectionBody from "../../../../appWide/GeneralSection/MainSection/MainSectionBody";
import { MainSectionInner } from "../../../../appWide/GeneralSection/MainSectionInner";
import { MainSectionTopRows } from "../../../../appWide/MainSectionTopRows";
import BasicLoanInfo from "./Loan/BasicLoanInfo";
import { ClosingCostValue } from "./Loan/ClostingCostValue";

export function Loan({
  feId,
  className,
  showXBtn,
}: {
  feId: string;
  className?: string;
  showXBtn: boolean;
}) {
  const feInfo = {
    sectionName: "loan",
    feId,
  } as const;

  const loan = useGetterSection(feInfo);
  return (
    <Styled className={`Loan-root ${className ?? ""}`}>
      <MainSectionTopRows
        {...{
          ...feInfo,
          sectionTitle: "Loan",
          showXBtn,
        }}
      />
      <MainSectionBody themeName="loan">
        <BasicLoanInfo feId={feId} />
        <ClosingCostValue
          {...{
            feId: loan.onlyChildFeId("closingCostValue"),
            fivePercentLoanDisplay: loan
              .varbNext("fivePercentBaseLoan")
              .displayVarb(),
          }}
        />
      </MainSectionBody>
    </Styled>
  );
}

const Styled = styled(MainSectionInner)`
  .ClosingCostValue-root {
    padding-bottom: 0;
  }
  .MainSectionTopRows-xBtn {
    visibility: hidden;
  }

  :hover {
    .MainSectionTopRows-xBtn {
      visibility: visible;
    }
  }
`;
