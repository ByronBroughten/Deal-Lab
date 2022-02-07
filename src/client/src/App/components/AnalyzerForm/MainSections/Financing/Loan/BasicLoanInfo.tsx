import React from "react";
import {
  FeInfo,
  Inf,
} from "../../../../../sharedWithServer/Analyzer/SectionMetas/Info";
import BasicSectionInfo from "../../../../appWide/MainSection/MainSectionEntry/MainEntryBody/BasicSectionInfo";
import StandardLabel from "../../../../general/StandardLabel";
import NumObjEditor from "../../../../inputs/NumObjEditor";
import DollarPercentRadioSwap from "../../general/DollarPercentRadioSwap";

type Props = { feInfo: FeInfo; className?: string };
export default function BasicLoanInfo({ feInfo, className }: Props) {
  const feVarbInfo = Inf.feVarbMaker(feInfo);
  const names = {
    percent: "loanAmountBasePercent",
    dollars: "loanAmountBaseDollars",
    switch: "loanAmountBaseUnitSwitch",
  };
  return (
    <BasicSectionInfo
      {...{ className: `BasicLoanInfo-root ${className}`, sectionName: "loan" }}
    >
      <div className="viewable">
        <h6 className="title-text">Basic Info</h6>
        <div className="BasicSectionInfo-subSections">
          <div className="BasicSectionInfo-subSection">
            <div className="BasicSectionInfo-subSection-viewable">
              <DollarPercentRadioSwap
                {...{
                  names,
                  feInfo,
                  title: "Base loan amount",
                  percentAdornment: "% LTV",
                }}
              />
            </div>
          </div>
          <div className="BasicSectionInfo-subSection">
            <div className="BasicSectionInfo-subSection-viewable">
              <NumObjEditor
                feVarbInfo={feVarbInfo("interestRatePercentYearly")}
              />
              <NumObjEditor
                feVarbInfo={feVarbInfo("loanTermYears")}
                label="Loan term"
              />
            </div>
          </div>
          <div className="BasicSectionInfo-subSection">
            <div className="BasicSectionInfo-subSection-viewable">
              <StandardLabel>Mortgage Insurance</StandardLabel>
              <NumObjEditor
                feVarbInfo={feVarbInfo("mortInsUpfront")}
                label="Upfront"
              />
              <NumObjEditor
                feVarbInfo={feVarbInfo("mortgageInsYearly")}
                label="Ongoing"
              />
            </div>
          </div>
        </div>
      </div>
    </BasicSectionInfo>
  );
}
