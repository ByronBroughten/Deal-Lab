import React from "react";
import styled from "styled-components";
import theme from "../../../../theme/Theme";
import MainSectionBody from "../../../appWide/GeneralSection/MainSection/MainSectionBody";
import { MainSectionInner } from "../../../appWide/GeneralSection/MainSectionInner";
import { MainSectionTopRows } from "../../../appWide/MainSectionTopRows";
import { ValueSectionZone } from "../../../appWide/ValueSectionZone";
import BasicLoanInfo from "./Loan/BasicLoanInfo";

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
  return (
    <Styled className={`Loan-root ${className ?? ""}`}>
      <MainSectionTopRows
        {...{
          ...feInfo,
          sectionTitle: "Loan",
          loadWhat: "Loan",
          showXBtn,
        }}
      />
      <MainSectionBody themeName="loan">
        <BasicLoanInfo feId={feId} className="ListGroup-root" />
        <ValueSectionZone
          {...{
            ...feInfo,
            childName: "closingCostValue",
            displayName: "Closing Costs",
            plusBtnText: "+ Closing Costs",
            className: "Loan-closingCosts",
          }}
        />
      </MainSectionBody>
    </Styled>
  );
}

const Styled = styled(MainSectionInner)`
  .ValueSectionOneTime-root {
    margin: ${theme.s2};
    margin-top: 0;
  }

  .MainSectionTopRows-xBtn {
    visibility: hidden;
  }

  :hover {
    .MainSectionTopRows-xBtn {
      visibility: visible;
    }
  }
  .Loan-closingCosts {
    margin-top: ${theme.s4};
  }
`;
