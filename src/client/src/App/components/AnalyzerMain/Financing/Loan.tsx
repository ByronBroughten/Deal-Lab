import React from "react";
import MainSection from "../../appWide/MainSection/MainSection";
import MainSectionBody from "../../appWide/MainSection/MainSection/MainSectionBody";
import BasicLoanInfo from "./Loan/BasicLoanInfo";
import MainSectionTitleRow from "../../appWide/MainSection/MainSection/MainSectionTitleRow";
import ListGroup from "../general/ListGroup";

const sectionName = "loan";
export default function Loan({ id }: { id: string }) {
  const feInfo = { sectionName, id, idType: "feId" } as const;

  return (
    <MainSection className="Loan-root">
      <div className="MainSection-viewable">
        <MainSectionTitleRow feInfo={feInfo} pluralName="loans" xBtn={true} />
        <MainSectionBody>
          <div className="ListGroup-root">
            <div className="ListGroup-viewable">
              <div className="ListGroup-titleRow">
                <h6 className="ListGroup-titleText">Basic Info</h6>
              </div>
              <div className="ListGroup-lists">
                <BasicLoanInfo feInfo={feInfo} className="ListGroup-root" />
              </div>
            </div>
          </div>

          <ListGroup
            {...{
              feInfo,
              listSectionName: "closingCostList",
            }}
            titleText="Loan Fees"
            totalVarbName="closingCosts"
          />
          <ListGroup
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
