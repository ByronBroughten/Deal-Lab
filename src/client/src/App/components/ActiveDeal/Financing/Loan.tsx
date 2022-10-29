import React from "react";
import { MainSection } from "../../appWide/GeneralSection/MainSection";
import MainSectionBody from "../../appWide/GeneralSection/MainSection/MainSectionBody";
import { MainSectionTitleRow } from "../../appWide/GeneralSection/MainSection/MainSectionTitleRow";
import { ListGroupSingleTimeZone } from "./../general/ListGroupSingleTimeZone";
import BasicLoanInfo from "./Loan/BasicLoanInfo";

export function Loan({ feId }: { feId: string }) {
  const feInfo = {
    sectionName: "loan",
    feId,
  } as const;
  return (
    <MainSection className="Loan-root">
      <div className="MainSection-viewable">
        <MainSectionTitleRow
          {...{
            ...feInfo,
            pluralName: "loans",
            xBtn: true,
          }}
        />
        <MainSectionBody themeName="loan">
          <div className="ListGroup-lists">
            <BasicLoanInfo feId={feId} className="ListGroup-root" />
          </div>
          <ListGroupSingleTimeZone
            {...{
              ...feInfo,
              childName: "closingCostListGroup",
              themeName: "loan",
              btnText: "+ Closing Costs",
              titleText: "Closing Costs",
            }}
          />
          <ListGroupSingleTimeZone
            {...{
              ...feInfo,
              childName: "wrappedInLoanListGroup",
              themeName: "loan",
              btnText: "+ Wrapped in Loan",
              titleText: "Wrapped in Loan",
            }}
          />
        </MainSectionBody>
      </div>
    </MainSection>
  );
}
