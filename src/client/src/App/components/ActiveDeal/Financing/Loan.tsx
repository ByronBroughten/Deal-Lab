import React from "react";
import { useGetterSection } from "../../../sharedWithServer/stateClassHooks/useGetterSection";
import MainSection from "../../appWide/GeneralSection/MainSection";
import MainSectionBody from "../../appWide/GeneralSection/MainSection/MainSectionBody";
import { MainSectionTitleRow } from "../../appWide/GeneralSection/MainSection/MainSectionTitleRow";
import { ListGroupSingleTime } from "../../appWide/ListGroup/ListGroupSingleTime";
import BasicLoanInfo from "./Loan/BasicLoanInfo";

export default function Loan({ feId }: { feId: string }) {
  const loan = useGetterSection({
    sectionName: "loan",
    feId,
  });
  return (
    <MainSection className="Loan-root">
      <div className="MainSection-viewable">
        <MainSectionTitleRow
          {...{
            ...loan.feInfo,
            sectionName: "loan",
            pluralName: "loans",
            xBtn: true,
          }}
        />
        <MainSectionBody themeName="loan">
          {/* <div className="ListGroup-root">
            <div className="ListGroup-viewable">              
            </div>
          </div> */}
          <div className="ListGroup-lists">
            <BasicLoanInfo feId={feId} className="ListGroup-root" />
          </div>
          <ListGroupSingleTime
            feId={loan.onlyChild("closingCostListGroup").feId}
            titleText="Upfront Costs"
            themeName="loan"
          />
          <ListGroupSingleTime
            feId={loan.onlyChild("wrappedInLoanListGroup").feId}
            titleText="Wrapped in loan"
            themeName="loan"
          />
        </MainSectionBody>
      </div>
    </MainSection>
  );
}
