import React from "react";
import MainSection from "../../appWide/GeneralSection/MainSection";
import MainSectionBody from "../../appWide/GeneralSection/MainSection/MainSectionBody";
import { MainSectionTitleRowNext } from "./../../appWide/GeneralSection/MainSection/MainSectionTitleRowNext";
import { ListGroupNext } from "./../general/ListGroupNext";
import BasicLoanInfo from "./Loan/BasicLoanInfo";

export default function Loan({ feId }: { feId: string }) {
  const feInfo = {
    sectionName: "loan",
    feId,
  } as const;
  return (
    <MainSection className="Loan-root">
      <div className="MainSection-viewable">
        <MainSectionTitleRowNext
          feInfo={feInfo}
          pluralName="loans"
          xBtn={true}
        />
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

          <ListGroupNext
            {...{
              feInfo,
              listSectionName: "closingCostList",
            }}
            titleText="Loan Fees"
            totalVarbName="closingCosts"
          />
          <ListGroupNext
            feInfo={feInfo}
            listSectionName="wrappedInLoanList"
            titleText="Wrapped in loan"
            totalVarbName="wrappedInLoan"
          />
        </MainSectionBody>
      </div>
    </MainSection>
  );
}
