import { FormControl, FormControlLabel, RadioGroup } from "@material-ui/core";
import styled from "styled-components";
import { DealMode } from "../../../sharedWithServer/SectionsMeta/values/StateValue/unionValues";
import { useSetterSection } from "../../../sharedWithServer/stateClassHooks/useSetterSection";
import { FormSection } from "../../appWide/FormSection";
import { SubSectionBtn } from "../../appWide/GeneralSection/GeneralSectionTitle/SubSectionBtn";
import { SectionTitle } from "../../appWide/SectionTitle";
import Radio from "../../general/Radio";
import theme from "./../../../theme/Theme";
import { BackToSectionBtn } from "./BackToSectionBtn";
import { Loan } from "./Financing/Loan";

type Props = {
  feId: string;
  dealMode: DealMode;
  backBtnProps: {
    backToWhat: string;
    onClick: () => void;
  };
};

export function FinancingEditor({ feId, backBtnProps }: Props) {
  const financing = useSetterSection({
    sectionName: "financing",
    feId,
  });

  const financingModeVarb = financing.varb("financingMode");
  const financingMode = financingModeVarb.value("string");

  const loanIds = financing.childFeIds("loan");
  const addLoan = () => financing.addChild("loan");

  return (
    <Styled>
      <div className="Financing-titleRow">
        <SectionTitle
          text={"Financing"}
          className="MainSectionTopRows-sectionTitle"
        />
        <BackToSectionBtn {...backBtnProps} />
      </div>
      <FormSection>
        <div className="Financing-inputDiv">
          <FormControl className="Financing-financingTypeControl">
            <RadioGroup
              aria-labelledby="financing-type-radio-buttons-group"
              name="financing-type-radio-buttons-group"
              value={financingMode}
              onChange={(e) =>
                financingModeVarb.updateValue(e.currentTarget.value)
              }
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
                    showXBtn={loanIds.length > 1}
                  />
                ))}
              </div>
              <SubSectionBtn
                className="Financing-addLoanBtn"
                onClick={addLoan}
                text="+ Loan"
              />
            </>
          )}
        </div>
      </FormSection>
    </Styled>
  );
}

const Styled = styled.div`
  .Financing-inputDiv {
    display: flex;
    flex-direction: column;
    flex: 1;
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
    padding-bottom: ${theme.s3};
  }
  .Financing-marginLoan,
  .Financing-addLoanBtn {
    margin-top: ${theme.s3};
  }

  .Financing-loans {
    margin-top: ${theme.s4};
  }
`;
