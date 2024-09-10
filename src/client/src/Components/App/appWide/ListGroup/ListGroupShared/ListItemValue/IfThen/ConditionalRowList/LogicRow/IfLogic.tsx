import styled from "styled-components";
import { useGetterSection } from "../../../../../../../../../modules/stateHooks/useGetterSection";
import { listOperators } from "../../../../../../../../../sharedWithServer/StateOperators/Solvers/ValueUpdateVarb/ConditionalValueSolver";
import { NumObjEntityEditor } from "../../../../../../../inputs/NumObjEntityEditor";
import { StringArrEditor } from "../../../../../../../inputs/StringArrEditor";

export default function IfLogic({ rowId }: { rowId: string }) {
  const sectionName = "conditionalRow";
  const row = useGetterSection({
    sectionName,
    feId: rowId,
  });

  const operatorVarb = row.varb("operator");
  const operatorVal = operatorVarb.value("string");

  let logicType: string;
  if (listOperators.includes(operatorVal as any)) {
    logicType = "listLogic";
  } else {
    logicType = "valueLogic";
  }

  return (
    <Styled>
      <NumObjEntityEditor
        feVarbInfo={row.varbInfo2("left")}
        className="logic-left"
        bypassNumeric={true}
      />
      {/*  */}
      {/* <MaterialSelect
        {...{
          name: operatorVarb.varbId,
          value: operatorVal,
          onChange: (event: any) => setterSections.updateVarbCurrentTarget(event);,
          className: "select-operator",
        }}
      >
        {LogicOperators()}
      </MaterialSelect> */}
      {logicType === "listLogic" && (
        <StringArrEditor
          className="logic-right"
          feVarbInfo={row.varbInfo("rightList")}
        />
      )}
      {logicType === "valueLogic" && (
        <NumObjEntityEditor
          className="logic-right"
          feVarbInfo={row.varbInfo2("rightValue")}
          labelProps={{ showLabel: false }}
        />
      )}
    </Styled>
  );
}

const Styled = styled.div`
  display: flex;
  .select-operator {
    margin: 0 0.25rem;
  }
`;
