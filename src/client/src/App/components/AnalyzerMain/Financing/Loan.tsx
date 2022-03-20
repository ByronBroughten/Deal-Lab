import React from "react";
import MainSectionEntry from "../../appWide/MainSection/MainSectionEntry";
import MainEntryBody from "../../appWide/MainSection/MainSectionEntry/MainEntryBody";
import BasicLoanInfo from "./Loan/BasicLoanInfo";
import MainEntryTitleRow from "../../appWide/MainSection/MainSectionEntry/MainEntryTitleRow";
import ListGroup from "../general/ListGroup";

const sectionName = "loan";
export default function Loan({ id }: { id: string }) {
  const feInfo = { sectionName, id, idType: "feId" } as const;

  return (
    <MainSectionEntry className="Loan-root">
      <div className="MainSectionEntry-viewable">
        <MainEntryTitleRow feInfo={feInfo} pluralName="Financing" xBtn={true} />
        <MainEntryBody>
          <BasicLoanInfo feInfo={feInfo} className="ListGroup-root" />
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
        </MainEntryBody>
      </div>
    </MainSectionEntry>
  );
}
