import React from "react";
import styled from "styled-components";
import theme from "../../../../theme/Theme";
import { MainSection } from "../../../appWide/GeneralSection/MainSection";
import MainSectionBody from "../../../appWide/GeneralSection/MainSection/MainSectionBody";
import { MainSectionTopRows } from "../../../appWide/MainSectionTopRows";
import { SingleTimeValueZone } from "../../../appWide/SingleTimeValueZone";
import BasicLoanInfo from "./Loan/BasicLoanInfo";

export function Loan({ feId }: { feId: string }) {
  const feInfo = {
    sectionName: "loan",
    feId,
  } as const;
  return (
    <Styled className="Loan-root">
      <MainSectionTopRows
        {...{
          ...feInfo,
          sectionTitle: "Loan",
          loadWhat: "Loan",
        }}
      />
      <MainSectionBody themeName="loan">
        <div className="ListGroup-lists">
          <BasicLoanInfo feId={feId} className="ListGroup-root" />
        </div>
        <SingleTimeValueZone
          {...{
            ...feInfo,
            childName: "closingCostValue",
            plusBtnText: "+ Closing Costs",
            displayName: "Closing Costs",
          }}
        />
        <SingleTimeValueZone
          {...{
            ...feInfo,
            className: "Loan-financedCosts",
            childName: "wrappedInLoanValue",
            plusBtnText: "+ Financed costs",
            displayName: "Other Financed Costs",
          }}
        />
      </MainSectionBody>
    </Styled>
  );
}

const Styled = styled(MainSection)`
  .SingleTimeValue-root {
    margin: ${theme.s2};
    margin-top: 0;
  }

  :hover {
    .MainSectionTitleRow-xBtn {
      visibility: visible;
    }
  }
`;
