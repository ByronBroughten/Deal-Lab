import React from "react";
import LogicOperators from "../../../../../../appWide/LogicOperators";
import ListMaker from "../../../../../../inputs/ListEditor";
import NumObjEditor from "../../../../../../inputs/NumObjEditor";
import styled from "styled-components";
import MaterialSelect from "./../../../../../../inputs/MaterialSelect";
import { listOperators } from "../../../../../../../sharedWithServer/Analyzer/methods/solveVarbs/solveAndUpdateValue/updateUserVarb";
import { useAnalyzerContext } from "../../../../../../../modules/usePropertyAnalyzer";
import { Inf } from "../../../../../../../sharedWithServer/Analyzer/SectionMetas/Info";

const sectionName = "conditionalRow";
export default function IfLogic({ rowId }: { rowId: string }) {
  const { analyzer, handleChange } = useAnalyzerContext();

  const feInfo = { sectionName, id: rowId, idType: "feId" } as const;
  const varbs = analyzer.section(feInfo).varbs;

  const operator = varbs.operator.value("string");

  let logicType: string;
  if (listOperators.includes(operator as any)) {
    logicType = "listLogic";
  } else {
    logicType = "valueLogic";
  }

  const onChange = (e: React.ChangeEvent<{ name?: string; value: any }>) => {
    handleChange({ currentTarget: e.target });
  };

  return (
    <Styled>
      <NumObjEditor
        feVarbInfo={Inf.feVarb("left", feInfo)}
        className="logic-left"
        bypassNumeric={true}
      />
      <MaterialSelect
        {...{
          name: varbs.operator.stringFeVarbInfo,
          value: operator,
          onChange,
          className: "select-operator",
        }}
      >
        {LogicOperators()}
      </MaterialSelect>
      {logicType === "listLogic" && (
        <ListMaker
          className="logic-right"
          feVarbInfo={Inf.feVarb("rightList", feInfo)}
        />
      )}
      {logicType === "valueLogic" && (
        <NumObjEditor
          className="logic-right"
          feVarbInfo={Inf.feVarb("rightValue", feInfo)}
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
