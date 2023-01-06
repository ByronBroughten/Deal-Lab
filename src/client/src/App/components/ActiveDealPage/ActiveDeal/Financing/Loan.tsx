import React from "react";
import styled from "styled-components";
import theme from "../../../../theme/Theme";
import { MainSection } from "../../../appWide/GeneralSection/MainSection";
import MainSectionBody from "../../../appWide/GeneralSection/MainSection/MainSectionBody";
import { MainSectionTopRows } from "../../../appWide/MainSectionTopRows";
import { ValueSectionZone } from "../../../appWide/ValueSectionZone";
import BasicLoanInfo from "./Loan/BasicLoanInfo";

export function Loan({
  feId,
  className,
}: {
  feId: string;
  className?: string;
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
          showXBtn: true,
        }}
      />
      <MainSectionBody themeName="loan">
        <div className="ListGroup-lists">
          <BasicLoanInfo feId={feId} className="ListGroup-root" />
        </div>
        <ValueSectionZone
          {...{
            ...feInfo,
            childName: "closingCostValue",
            displayName: "Closing Costs",
            plusBtnText: "+ Closing Costs",
          }}
        />
      </MainSectionBody>
    </Styled>
  );
}

const Styled = styled(MainSection)`
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
`;
