import React from "react";
import styled from "styled-components";
import { useGetterSection } from "../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import theme from "../../../../../theme/Theme";
import { FormSection } from "../../../../appWide/FormSection";
import { FormSectionLabeled } from "../../../../appWide/FormSectionLabeled";
import { TogglerBooleanTitleVarb } from "../../../../appWide/TogglerBooleanTitleVarb";
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
      <FormSection>
        <PercentDollarInput
          {...{
            ...feInfo,
            unitBaseName: "loanBase",
            dollarVarbName: "loanBaseDollars",
            label: "Base Loan Amount",
            percentOfWhat: "purchase price",
          }}
        />
      </FormSection>
      <FormSectionLabeled
        className="BasicLoanInfo-otherInfo"
        label="Other Loan Info"
      >
        <div className="BasicLoanInfo-rateAndTermRow BasicLoanInfo-editorsRow">
          <NumObjEntityEditor
            feVarbInfo={loan.varbInfo("interestRatePercentOngoingEditor")}
            className="BasicLoanInfo-input"
          />
          <NumObjEntityEditor
            feVarbInfo={loan.varbInfo("loanTermSpanEditor")}
            label="Loan term"
            className="BasicLoanInfo-input BasicLoanInfo-secondEditor"
          />
          <TogglerBooleanVarb
            {...{
              className: "BasicLoanInfo-input BasicLoanInfo-basicToggler",
              feVarbInfo: isInterestOnlyVarb.feVarbInfo,
              label: "Interest only payments",
              name: "interest only toggle",
            }}
          />
        </div>
      </FormSectionLabeled>
      <FormSection>
        <div>
          <TogglerBooleanTitleVarb
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
                className="BasicLoanInfo-input"
                feVarbInfo={loan.varbInfo("mortgageInsUpfrontEditor")}
                label="Upfront"
              />
              <NumObjEntityEditor
                feVarbInfo={loan.varbInfo("mortgageInsOngoingEditor")}
                label="Ongoing"
                className="BasicLoanInfo-input"
              />
            </div>
          )}
        </div>
      </FormSection>
    </Styled>
  );
}

const Styled = styled.div`
  .BasicLoanInfo-otherInfo {
    padding-bottom: ${theme.s3};
  }
  .BasicLoanInfo-basicToggler {
    border: ${theme.borderStyle};
    border-radius: ${theme.br0};
    padding: ${theme.s25};
  }

  .BasicLoanInfo-editorsRow {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-top: ${theme.s15};
    .DraftTextField-root {
      min-width: 95px;
    }
  }

  .BasicLoanInfo-input {
    margin: ${theme.s3};
    margin-left: 0;
    margin-right: ${theme.s4};
  }
`;
