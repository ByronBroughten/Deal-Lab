import { FormControl, FormControlLabel, RadioGroup } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import { useSetterSection } from "../../../sharedWithServer/stateClassHooks/useSetterSection";
import { GetterSection } from "../../../sharedWithServer/StateGetters/GetterSection";
import { MainSectionBtn } from "../../appWide/GeneralSection/GeneralSectionTitle/MainSectionBtn";
import { SectionTitle } from "../../appWide/SectionTitle";
import Radio from "../../general/Radio";
import theme from "./../../../theme/Theme";
import { BackToDealBtn } from "./BackToDealBtn";
import { Loan } from "./Financing/Loan";
import {
  CompletionStatus,
  MainDealSection,
  MainDealSectionProps,
} from "./MainDealSection";

function useFinancingCompletionStatus(
  deal: GetterSection<"deal">
): CompletionStatus {
  let allEmpty = true;
  let allValid = true;
  const updateBools = ({
    isEmpty,
    isValid,
  }: {
    isEmpty: boolean;
    isValid: boolean;
  }) => {
    if (!isEmpty) allEmpty = false;
    if (!isValid) allValid = false;
  };

  const financingMode = deal.valueNext("financingMode");
  if (!financingMode) updateBools({ isEmpty: true, isValid: false });
  else updateBools({ isEmpty: false, isValid: true });

  if (financingMode === "useLoan") {
    const loans = deal.children("loan");
    if (loans.length < 1) {
      updateBools({ isEmpty: true, isValid: false });
    }

    for (const loan of loans) {
      const loanBaseUnitSwitch = loan.valueNext("loanBaseUnitSwitch");
      if (loanBaseUnitSwitch === "percent") {
        updateBools(loan.checkInputValue("loanBasePercentEditor"));
      } else if (loanBaseUnitSwitch === "dollars") {
        updateBools(loan.checkInputValue("loanBaseDollarsEditor"));
      }

      const varbNames = [
        "interestRatePercentOngoingEditor",
        "loanTermSpanEditor",
      ] as const;
      for (const varbName of varbNames) {
        updateBools(loan.checkInputValue(varbName));
      }

      const hasMortgageIns = loan.valueNext("hasMortgageIns");
      if (hasMortgageIns) {
        const varbNames = [
          "mortgageInsUpfrontEditor",
          "mortgageInsOngoingEditor",
        ] as const;
        for (const varbName of varbNames) {
          updateBools(loan.checkInputValue(varbName));
        }
      }

      const closingCostValue = loan.onlyChild("closingCostValue");
      const isItemized = closingCostValue.valueNext("isItemized");
      if (!isItemized) {
        updateBools(closingCostValue.checkInputValue("valueEditor"));
      }
    }
    if (allEmpty) return "allEmpty";
    if (allValid) return "allValid";
    else return "someInvalid";
  }

  // function getBasePayInputName() {
  //   const unitSwitch = mgmt.valueNext("basePayUnitSwitch");
  //   if (unitSwitch === "percent") {
  //     return "basePayPercentEditor";
  //   } else if (unitSwitch === "dollars") {
  //     return "basePayDollarsEditor";
  //   } else throw new Error(`"unitSwitch" is ${unitSwitch}`);
  // }

  // function getVacancyLossInputName() {
  //   const unitSwitch = mgmt.valueNext("vacancyLossUnitSwitch");
  //   if (unitSwitch === "percent") {
  //     return "vacancyLossPercentEditor";
  //   } else if (unitSwitch === "dollars") {
  //     return "vacancyLossDollarsEditor";
  //   } else throw new Error(`"unitSwitch" is ${unitSwitch}`);
  // }

  // const basePayInputName = getBasePayInputName();
  // updateBools(mgmt.checkInputValue(basePayInputName));

  // const vacancyLossInputName = getVacancyLossInputName();
  // updateBools(mgmt.checkInputValue(vacancyLossInputName));

  if (allEmpty) return "allEmpty";
  if (allValid) return "allValid";
  else return "someInvalid";
}

function getDisplayName(deal: GetterSection<"deal">) {
  const financingMode = deal.valueNext("financingMode");
  if (financingMode === "cashOnly") {
    return "Cash Only";
  }

  const loans = deal.children("loan");
  let displayName = "";
  for (let i = 0; i < loans.length; i++) {
    if (i !== 0) displayName += " | ";
    displayName += loans[i].valueNext("displayName").mainText;
  }
  return displayName;
}

export function Financing({
  feId,
  closeInputs,
  ...props
}: MainDealSectionProps & { closeInputs: () => void }) {
  const deal = useSetterSection({
    sectionName: "deal",
    feId,
  });

  const financingModeVarb = deal.varb("financingMode");
  const financingMode = financingModeVarb.value("string");

  const loanIds = deal.childFeIds("loan");
  const addLoan = () => deal.addChild("loan");

  const completionStatus = useFinancingCompletionStatus(deal.get);
  return (
    <Styled
      {...{
        ...props,
        feId,
        sectionTitle: "Financing",
        className: "Financing-root",
        closeInputs,
        displayName: getDisplayName(deal.get),
        completionStatus,
      }}
    >
      <div className="Financing-titleRow">
        <SectionTitle
          text={"Financing"}
          className="MainSectionTopRows-sectionTitle"
        />
        <BackToDealBtn onClick={closeInputs} />
      </div>
      <FormControl className="Financing-financingTypeControl">
        <RadioGroup
          aria-labelledby="financing-type-radio-buttons-group"
          name="financing-type-radio-buttons-group"
          value={financingMode}
          onChange={(e) => financingModeVarb.updateValue(e.currentTarget.value)}
        >
          <FormControlLabel
            value="cashOnly"
            control={<Radio />}
            label="Cash Only"
          />
          <FormControlLabel
            value="useLoan"
            control={<Radio />}
            label="Use Loan(s)"
          />
        </RadioGroup>
      </FormControl>
      {financingMode === "useLoan" && (
        <>
          <div className={"Financing-loans"}>
            {loanIds.map((feId, idx) => (
              <Loan
                key={feId}
                feId={feId}
                className={idx !== 0 ? "Financing-marginLoan" : ""}
              />
            ))}
          </div>
          <MainSectionBtn
            className="Financing-addLoanBtn"
            onClick={addLoan}
            text="+ Loan"
          />
        </>
      )}
    </Styled>
  );
}

const Styled = styled(MainDealSection)`
  .Financing-addLoanBtn {
    box-shadow: none;
    border: ${theme.borderStyle};
  }

  .Financing-financingTypeControl {
    margin: 0;
    padding: 0;
    margin-top: ${theme.s2};

    .MuiFormLabel-root {
      font-size: ${theme.infoSize};
      color: ${theme.dark};
    }
    .MuiFormControlLabel-label {
      margin-left: ${theme.s25};
    }
    .MuiFormControlLabel-root {
      margin: 0;
      margin-top: ${theme.s15};
    }
    .Mui-checked {
      color: ${theme.primaryNext};
    }
  }
  .Financing-titleRow {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .Financing-marginLoan,
  .Financing-addLoanBtn {
    margin-top: ${theme.s3};
  }

  .Financing-loans {
    margin-top: ${theme.s4};
  }
`;
