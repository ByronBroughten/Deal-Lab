import React from "react";
import styled from "styled-components";
import { useSetterSection } from "../../../../../../../sharedWithServer/stateClassHooks/useSetterSection";
import { useSetterSections } from "../../../../../../../sharedWithServer/stateClassHooks/useSetterSections";
import theme from "../../../../../../../theme/Theme";
import MaterialSelect from "../../../../../../inputs/MaterialSelect";
import { NumObjEntityEditor } from "../../../../../../inputs/NumObjEntityEditor";
import PlusBtn from "../../../../../PlusBtn";
import {
  IfOptions,
  OrElseOptions,
  orElseOptions,
} from "./ConditionalRows/ControlRow/IfOrElseOptions";
import IfLogic from "./LogicRow/IfLogic";

type Props = { feId: string; idx?: number | string };
export default function LogicRow({ feId, idx = "" }: Props) {
  const sectionName = "conditionalRow";
  const row = useSetterSection({
    sectionName,
    feId,
  });

  const sections = useSetterSections();

  const typeVarb = row.get.varb("type");
  const type = row.get.value("type", "string");
  const level = row.get.value("level", "number");
  const levelArray = Array(level).fill(0);
  return (
    <Styled className={`${idx}`}>
      {type !== " " &&
        levelArray.map((_, idx) => <PlusBtn className="invisible" key={idx} />)}
      <MaterialSelect
        {...{
          name: typeVarb.varbId,
          value: type,
          onChange: (event: any) => {
            sections.updateVarbCurrentTarget({ currentTarget: event.target });
          },
          className: "select-logic-word",
        }}
      >
        {(orElseOptions.includes(type) && OrElseOptions()) || IfOptions()}
      </MaterialSelect>

      {["if", "or if"].includes(type) && <IfLogic rowId={row.get.feId} />}
      {["then", "or else"].includes(type) && (
        <NumObjEntityEditor
          feVarbInfo={row.varbInfo("then")}
          className={"then-content"}
          labeled={false}
        />
      )}
    </Styled>
  );
}

const Styled = styled.div.attrs(({ className }) => ({
  className: "logic-row content-row " + className,
}))`
  display: flex;
  align-items: flex-start;
  div {
    :focus-within {
      z-index: 1;
    }
  }

  .select-logic-word {
    margin-right: ${theme.s2};
  }
`;
