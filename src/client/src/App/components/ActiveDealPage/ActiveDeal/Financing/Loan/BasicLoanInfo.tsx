import styled from "styled-components";
import { useGetterSection } from "../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import theme from "../../../../../theme/Theme";
import { FormSection } from "../../../../appWide/FormSection";
import { LabelWithInfo } from "../../../../appWide/LabelWithInfo";
import { TogglerBooleanTitleVarb } from "../../../../appWide/TogglerBooleanTitleVarb";
import { TogglerBooleanVarb } from "../../../../appWide/TogglerBooleanVarb";
import { NumObjEntityEditor } from "../../../../inputs/NumObjEntityEditor";
import { LoanBaseValueNext } from "./LoanBaseValueNext";

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
      <LoanBaseValueNext feId={loan.onlyChildFeId("loanBaseValue")} />
      <FormSection className="BasicLoanInfo-otherInfo">
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
      </FormSection>
      <FormSection>
        <div>
          <TogglerBooleanTitleVarb
            {...{
              feVarbInfo: hasMortInsVarb.feVarbInfo,
              label: (
                <LabelWithInfo
                  {...{
                    label: "Mortgage insurance",
                    infoTitle: "Mortgage Insurance",
                    infoText: `Sometimes in order to get a loan you are required to pay for mortgage insurance. This tends to happen with loans where the borrower pays a low down payment—lower than 20%.\n\nMortgage insurance basically assures the bank that it will be able to recover its assets in the event that the borrower does not repay them, which makes it less risky for them to work with smaller down payments.\n\nYou may be required to pay the mortgage insurance in a lump sum at the time of closing, or as a recurring monthly payment, or both. To determine whether you'll need mortgage insurance and, if so, in what form and at what cost, either research the type of loan you're entering or ask your lender.`,
                  }}
                />
              ),
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
      min-width: 110px;
    }
  }

  .BasicLoanInfo-input {
    margin: ${theme.s3};
    margin-left: 0;
    margin-right: ${theme.s4};
  }
`;
