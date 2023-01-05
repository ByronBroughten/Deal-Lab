import React from "react";
import styled from "styled-components";
import { useGetterSection } from "../../../../sharedWithServer/stateClassHooks/useGetterSection";
import theme from "../../../../theme/Theme";
import { MainSection } from "../../../appWide/GeneralSection/MainSection";
import MainSectionBody from "../../../appWide/GeneralSection/MainSection/MainSectionBody";
import { MainSectionTopRows } from "../../../appWide/MainSectionTopRows";
import { ValueSectionZone } from "../../../appWide/ValueSectionZone";
import BasicLoanInfo from "./Loan/BasicLoanInfo";

export function Loan({ feId }: { feId: string }) {
  const feInfo = {
    sectionName: "loan",
    feId,
  } as const;
  const loan = useGetterSection(feInfo);
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
        <ValueSectionZone
          {...{
            ...feInfo,
            childName: "closingCostValue",
            displayName: "Closing Costs",
            plusBtnText: "+ Closing Costs",
          }}
        />
        {/* <ValueSectionOneTime
          {...{
            feId: loan.onlyChild("closingCostValue").feId,
            displayName: "Closing Costs",
            showXBtn: false,
          }}
        /> */}
      </MainSectionBody>
    </Styled>
  );
}

const Styled = styled(MainSection)`
  .ValueSectionOneTime-root {
    margin: ${theme.s2};
    margin-top: 0;
  }

  :hover {
    .MainSectionTitleRow-xBtn {
      visibility: visible;
    }
  }
`;
