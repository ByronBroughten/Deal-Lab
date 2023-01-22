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
  financing: GetterSection<"financing">
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

  const financingMode = financing.valueNext("financingMode");
  if (!financingMode) updateBools({ isEmpty: true, isValid: false });
  else updateBools({ isEmpty: false, isValid: true });

  if (financingMode === "useLoan") {
    const loans = financing.children("loan");
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
  }
  if (allEmpty) return "allEmpty";
  if (allValid) return "allValid";
  else return "someInvalid";
}

function getDisplayName(financing: GetterSection<"financing">) {
  const financingMode = financing.valueNext("financingMode");
  if (financingMode === "cashOnly") {
    return "Cash Only";
  }

  const loans = financing.children("loan");
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
  const financing = useSetterSection({
    sectionName: "financing",
    feId,
  });

  const financingModeVarb = financing.varb("financingMode");
  const financingMode = financingModeVarb.value("string");

  const loanIds = financing.childFeIds("loan");
  const addLoan = () => financing.addChild("loan");

  const completionStatus = useFinancingCompletionStatus(financing.get);
  return (
    <Styled
      {...{
        ...props,
        feId,
        sectionTitle: "Financing",
        className: "Financing-root",
        closeInputs,
        displayName: getDisplayName(financing.get),
        completionStatus,
        detailVarbPropArr: financing.get.varbInfoArr([
          "loanPaymentMonthly",
          "loanTotalDollars",
          // "downPayment"
        ] as const),
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
            control={<Radio color="primary" />}
            label="Cash Only"
          />
          <FormControlLabel
            value="useLoan"
            control={<Radio color="primary" />}
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
