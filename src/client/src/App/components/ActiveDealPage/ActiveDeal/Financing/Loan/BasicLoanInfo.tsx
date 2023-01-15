import React from "react";
import styled from "styled-components";
import { useGetterSection } from "../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import theme from "../../../../../theme/Theme";
import { TogglerBooleanVarb } from "../../../../appWide/TogglerBooleanVarb";
import { NumObjEntityEditor } from "../../../../inputs/NumObjEntityEditor";
import { PercentDollarInput } from "../../general/PercentDollarInput";

type Props = { feId: string; className?: string };
export default function BasicLoanInfo({ feId, className }: Props) {
  const feInfo = { sectionName: "loan", feId } as const;
  const loan = useGetterSection(feInfo);
  const isInterestOnlyVarb = loan.varbNext("isInterestOnly");
  const hasMortInsVarb = loan.varbNext("hasMortgageIns");
  const hasMortIns = hasMortInsVarb.value("boolean");
  return (
    <Styled
      {...{ className: `BasicLoanInfo-root ${className}`, sectionName: "loan" }}
    >
      <PercentDollarInput
        {...{
          ...feInfo,
          unitBaseName: "loanBase",
          dollarVarbName: "loanBaseDollars",
          label: "Base Loan Amount",
          percentOfWhat: "purchase price",
        }}
      />
      <div className="BasicLoanInfo-firstEditorBlock">
        <TogglerBooleanVarb
          {...{
            className: "BasicLoanInfo-toggler",
            feVarbInfo: isInterestOnlyVarb.feVarbInfo,
            label: "Interest only payments",
            name: "interest only toggle",
          }}
        />
        <div className="BasicLoanInfo-rateAndTermRow BasicLoanInfo-editorsRow">
          <NumObjEntityEditor
            feVarbInfo={loan.varbInfo("interestRatePercentOngoingEditor")}
          />
          <NumObjEntityEditor
            feVarbInfo={loan.varbInfo("loanTermSpanEditor")}
            label="Loan term"
            className="BasicLoanInfo-secondEditor"
          />
        </div>
      </div>

      <div className="BasicLoanInfo-mortgageInsurance">
        <TogglerBooleanVarb
          {...{
            className: "BasicLoanInfo-toggler",
            feVarbInfo: hasMortInsVarb.feVarbInfo,
            label: "Mortgage insurance",
            name: "Mortgage insurance toggle",
          }}
        />
        {hasMortIns && (
          <div className="BasicLoanInfo-mortInsRow BasicLoanInfo-editorsRow">
            <NumObjEntityEditor
              feVarbInfo={loan.varbInfo("mortgageInsUpfrontEditor")}
              label="Upfront"
            />
            <NumObjEntityEditor
              feVarbInfo={loan.varbInfo("mortgageInsOngoingEditor")}
              label="Ongoing"
              className={"BasicLoanInfo-secondEditor"}
            />
          </div>
        )}
      </div>
    </Styled>
  );
}

const Styled = styled.div`
  .BasicLoanInfo-toggler {
    margin-top: ${theme.s25};
  }
  .BasicLoanInfo-firstEditorBlock {
    margin-top: ${theme.s35};
    border-bottom: ${theme.borderStyle};
    padding-bottom: ${theme.s35};
  }
  .BasicLoanInfo-title {
    .DraftTextField-root {
      min-width: 195px;
    }
  }
  .BasicLoanInfo-editorsRow {
    display: flex;
    .DraftTextField-root {
      min-width: 95px;
    }
  }
  .BasicLoanInfo-rateAndTermRow {
    margin-top: ${theme.s3};
  }

  .BasicLoanInfo-mortgageInsurance {
    margin-top: ${theme.s35};
    border-bottom: ${theme.borderStyle};
    padding-bottom: ${theme.s35};
  }
  .BasicLoanInfo-mortInsRow {
    margin-top: ${theme.s3};
  }

  .BasicLoanInfo-secondEditor {
    margin-left: ${theme.s35};
  }
`;
