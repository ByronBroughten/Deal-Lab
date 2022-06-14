import React from "react";
import MainSection from "../../appWide/GeneralSection/MainSection";
import MainSectionBody from "../../appWide/GeneralSection/MainSection/MainSectionBody";
import { MainSectionTitleRow } from "../../appWide/GeneralSection/MainSection/MainSectionTitleRow";
import { ListGroupSingleTime } from "../../appWide/ListGroup/ListGroupSingleTime";
import BasicLoanInfo from "./Loan/BasicLoanInfo";

export default function Loan({ feId }: { feId: string }) {
  const feInfo = {
    sectionName: "loan",
    feId,
  } as const;
  return (
    <MainSection className="Loan-root">
      <div className="MainSection-viewable">
        <MainSectionTitleRow feInfo={feInfo} pluralName="loans" xBtn={true} />
        <MainSectionBody>
          <div className="ListGroup-root">
            <div className="ListGroup-viewable">
              {/* <div className="ListGroup-titleRow">
                <h6 className="ListGroup-titleText">Basic Info</h6>
              </div> */}
              <div className="ListGroup-lists">
                <BasicLoanInfo feId={feId} className="ListGroup-root" />
              </div>
            </div>
          </div>
          <ListGroupSingleTime
            parentInfo={feInfo}
            sectionName="closingCostList"
            itemName="singleTimeItem"
            totalVarbName="closingCosts"
            titleText="Loan Fees"
            themeName="loan"
          />
          <ListGroupSingleTime
            parentInfo={feInfo}
            sectionName="wrappedInLoanList"
            itemName="singleTimeItem"
            totalVarbName="wrappedInLoan"
            titleText="Wrapped in loan"
            themeName="loan"
          />
        </MainSectionBody>
      </div>
    </MainSection>
  );
}
