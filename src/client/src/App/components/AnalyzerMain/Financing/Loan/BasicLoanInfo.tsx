import React from "react";
import styled from "styled-components";
import { useGetterSection } from "../../../../sharedWithServer/stateClassHooks/useGetterSection";
import theme from "../../../../theme/Theme";
import BasicSectionInfo from "../../../appWide/GeneralSection/MainSection/MainSectionBody/BasicSectionInfo";
import StandardLabel from "../../../general/StandardLabel";
import { NumObjEntityEditor } from "../../../inputs/NumObjEntityEditor";
import DollarPercentRadioSwap from "../../general/DollarPercentRadioSwap";

type Props = { feId: string; className?: string };
export default function BasicLoanInfo({ feId, className }: Props) {
  const loan = useGetterSection({
    sectionName: "loan",
    feId,
  });

  return (
    <Styled
      {...{ className: `BasicLoanInfo-root ${className}`, sectionName: "loan" }}
    >
      <div className="viewable">
        <div className="BasicSectionInfo-subSections">
          <div className="BasicSectionInfo-subSection">
            <div className="BasicSectionInfo-subSection-viewable">
              <DollarPercentRadioSwap
                {...{
                  names: {
                    percent: "loanAmountBasePercent",
                    dollars: "loanAmountBaseDollars",
                    switch: "loanAmountBaseUnitSwitch",
                  },
                  feInfo: loan.feInfo,
                  title: "Base loan amount",
                  percentAdornment: "% LTV",
                  className: "BasicLoanInfo-radioSwap",
                }}
              />
            </div>
          </div>
          <div className="BasicSectionInfo-subSection">
            <div className="BasicSectionInfo-subSection-viewable">
              <div className="BasicSectionInfo-dualEditors BasicSectionInfo-editorBlock">
                <NumObjEntityEditor
                  feVarbInfo={loan.varbInfo("interestRatePercentYearly")}
                />
                <NumObjEntityEditor
                  feVarbInfo={loan.varbInfo("loanTermYears")}
                  label="Loan term"
                  className="BasicSectionInfo-numObjEditor secondEditor"
                />
              </div>
            </div>
          </div>
          <div className="BasicSectionInfo-subSection">
            <div className="BasicSectionInfo-subSection-viewable titledBlock">
              <div className="BasicSectionInfo-editorBlock titledBlock">
                <StandardLabel className="BasicSectionInfo-editorBlockTitle">
                  Mortgage Insurance
                </StandardLabel>
                <div className="BasicSectionInfo-dualEditors">
                  <NumObjEntityEditor
                    feVarbInfo={loan.varbInfo("mortInsUpfront")}
                    label="Upfront"
                  />
                  <NumObjEntityEditor
                    feVarbInfo={loan.varbInfo("mortgageInsYearly")}
                    label="Ongoing"
                    className="BasicSectionInfo-numObjEditor secondEditor"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Styled>
  );
}

const Styled = styled(BasicSectionInfo)`
  .BasicSectionInfo-dualEditors {
    display: flex;
    .DraftTextField-root {
      min-width: 95px;
    }
  }

  .BasicLoanInfo-radioSwap {
    .MuiInputBase-root {
      width: 158px;
    }
  }

  .BasicSectionInfo-numObjEditor.secondEditor {
    margin-left: ${theme.s2};
  }
`;
