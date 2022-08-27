import React from "react";
import styled from "styled-components";
import { useSetterSection } from "../../../../../../../../sharedWithServer/stateClassHooks/useSetterSection";
import { useSetterSections } from "../../../../../../../../sharedWithServer/stateClassHooks/useSetterSections";
import { listOperators } from "../../../../../../../../sharedWithServer/StateSolvers/SolveValueVarb/ConditionalValueSolver";
import { ListEditorNext } from "../../../../../../../inputs/ListEditorNext";
import MaterialSelect from "../../../../../../../inputs/MaterialSelect";
import { NumObjEntityEditor } from "../../../../../../../inputs/NumObjEntityEditor";
import LogicOperators from "../../../../../../LogicOperators";

export default function IfLogic({ rowId }: { rowId: string }) {
  const sectionName = "conditionalRow";
  const sections = useSetterSections();
  const row = useSetterSection({
    sectionName,
    feId: rowId,
  });

  const operatorVarb = row.get.varb("operator");
  const operatorVal = operatorVarb.value("string");

  let logicType: string;
  if (listOperators.includes(operatorVal as any)) {
    logicType = "listLogic";
  } else {
    logicType = "valueLogic";
  }

  const onChange = (
    event: React.ChangeEvent<{ name?: string; value: any }>
  ) => {
    sections.handleChange({ currentTarget: event.target });
  };

  return (
    <Styled>
      <NumObjEntityEditor
        feVarbInfo={row.varbInfo("left")}
        className="logic-left"
        bypassNumeric={true}
      />
      <MaterialSelect
        {...{
          name: operatorVarb.varbId,
          value: operatorVal,
          onChange,
          className: "select-operator",
        }}
      >
        {LogicOperators()}
      </MaterialSelect>
      {logicType === "listLogic" && (
        <ListEditorNext
          className="logic-right"
          feVarbInfo={row.varbInfo("rightList")}
        />
      )}
      {logicType === "valueLogic" && (
        <NumObjEntityEditor
          className="logic-right"
          feVarbInfo={row.varbInfo("rightValue")}
          labeled={false}
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
