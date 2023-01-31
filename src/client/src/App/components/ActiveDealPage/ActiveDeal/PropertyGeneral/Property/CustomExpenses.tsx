import styled from "styled-components";
import { useGetterSection } from "../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import theme from "../../../../../theme/Theme";
import { FormSection } from "../../../../appWide/FormSection";
import { MainSectionInner } from "../../../../appWide/GeneralSection/MainSectionInner";
import { ValueGroupOngoing } from "../../../../appWide/ListGroup/ValueGroupOngoing";
import { ValueGroupSingleTime } from "../../../../appWide/ListGroup/ValueGroupSingleTime";
import { TogglerBooleanTitleVarb } from "../../../../appWide/TogglerBooleanTitleVarb";

export function CustomExpenses({ feId }: { feId: string }) {
  const property = useGetterSection({
    sectionName: "property",
    feId,
  });
  const useCustomCosts = property.valueNext("useCustomCosts");
  return (
    <Styled>
      <div>
        <TogglerBooleanTitleVarb
          {...{
            className: "BasicLoanInfo-toggler",
            feVarbInfo: property.varbInfo("useCustomCosts"),
            label: "Add custom expenses (optional)",
            name: "use custom payments toggle",
          }}
        />
        {useCustomCosts && (
          <MainSectionInner className="CustomExpenses-expenses">
            <ValueGroupSingleTime
              {...{
                className: "CustomExpenses-upfrontCostGroup",
                feId: property.onlyChild("upfrontExpenseGroup").feId,
                titleText: "Custom Upfront Costs",
              }}
            />
            <ValueGroupOngoing
              {...{
                className: "CustomExpenses-ongoingCostGroup",
                feId: property.onlyChild("ongoingExpenseGroup").feId,
                titleText: "Custom Ongoing Costs",
              }}
            />
          </MainSectionInner>
        )}
      </div>
    </Styled>
  );
}

const Styled = styled(FormSection)`
  .CustomExpenses-upfrontCostGroup {
    border: none;
  }
  .CustomExpenses-expenses {
    margin-top: ${theme.s35};
    padding-top: 0;
    padding-bottom: 0;
  }
`;
