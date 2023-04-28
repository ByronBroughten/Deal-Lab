import styled from "styled-components";
import { useGetterSection } from "../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import theme from "../../../../../theme/Theme";
import { FormSection } from "../../../../appWide/FormSection";
import { MainSectionInner } from "../../../../appWide/GeneralSection/MainSectionInner";
import { ValueGroupOngoing } from "../../../../appWide/ListGroup/ValueGroupOngoing";
import { ValueGroupSingleTime } from "../../../../appWide/ListGroup/ValueGroupSingleTime";
import { TogglerBooleanTitleVarb } from "../../../../appWide/TogglerBooleanTitleVarb";
import StandardLabel from "../../../../general/StandardLabel";

export function CustomExpenses({
  feId,
  sectionName,
}: {
  feId: string;
  sectionName: "property" | "mgmt";
}) {
  const section = useGetterSection({
    sectionName,
    feId,
  });
  const useCustomCosts = section.valueNext("useCustomCosts");
  return (
    <Styled>
      <div>
        <TogglerBooleanTitleVarb
          {...{
            className: "BasicLoanInfo-toggler",
            feVarbInfo: section.varbInfo("useCustomCosts"),
            label: (
              <StandardLabel>Add custom expenses (optional)</StandardLabel>
            ),
            name: "use custom payments toggle",
          }}
        />
        {useCustomCosts && (
          <MainSectionInner className="CustomExpenses-expenses">
            <ValueGroupSingleTime
              {...{
                className: "CustomExpenses-upfrontCostGroup",
                feId: section.onlyChild("upfrontExpenseGroup").feId,
                titleText: "Custom Upfront Costs",
              }}
            />
            <ValueGroupOngoing
              {...{
                feId: section.onlyChild("ongoingExpenseGroup").feId,
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
