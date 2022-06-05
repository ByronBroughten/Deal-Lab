import React from "react";
import styled from "styled-components";
import { listOperators } from "../../../../../../../sharedWithServer/Analyzer/methods/solveVarbs/solveAndUpdateValue/updateUserVarb";
import { useSetterSection } from "../../../../../../../sharedWithServer/StateHooks/useSetterSection";
import { useSetterSections } from "../../../../../../../sharedWithServer/StateHooks/useSetterSections";
import LogicOperators from "../../../../../../appWide/LogicOperators";
import { ListEditorNext } from "../../../../../../inputs/ListEditorNext";
import { NumObjEditorNext } from "../../../../../../inputs/NumObjEditorNext";
import MaterialSelect from "./../../../../../../inputs/MaterialSelect";

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
      <NumObjEditorNext
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
        <NumObjEditorNext
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
