import React from "react";
import styled from "styled-components";
import PlusBtn from "../../../../../../App/components/appWide/PlusBtn";
import MaterialSelect from "../../../../../../App/components/inputs/MaterialSelect";
import { InfoS } from "../../../../../../App/sharedWithServer/SectionsMeta/Info";
import theme from "../../../../../../App/theme/Theme";
import NumObjEditor from "../../../../NumObjEditor";
import { useAnalyzerContext } from "../../../../usePropertyAnalyzer";
import {
  IfOptions,
  OrElseOptions,
  orElseOptions,
} from "./ConditionalRows/ControlRow/IfOrElseOptions";
import IfLogic from "./LogicRow/IfLogic";

const sectionName = "conditionalRow";
type Props = { id: string; idx?: number | string };
export default function LogicRow({ id, idx = "" }: Props) {
  const feInfo = { sectionName, id, idType: "feId" } as const;
  const { analyzer, handleChange } = useAnalyzerContext();

  const row = analyzer.section(feInfo);

  const typeVarb = row.varb("type");
  const type = row.value("type", "string");
  const level = row.value("level", "number");
  const levelArray = Array(level).fill(0);
  return (
    <Styled className={`${idx}`}>
      {type !== " " &&
        levelArray.map((_, idx) => <PlusBtn className="invisible" key={idx} />)}
      <MaterialSelect
        {...{
          name: typeVarb.stringFeVarbInfo,
          value: type,
          onChange: (e: any) => {
            handleChange({ currentTarget: e.target });
          },
          className: "select-logic-word",
        }}
      >
        {(orElseOptions.includes(type) && OrElseOptions()) || IfOptions()}
      </MaterialSelect>

      {["if", "or if"].includes(type) && <IfLogic rowId={id} />}
      {["then", "or else"].includes(type) && (
        <NumObjEditor
          feVarbInfo={InfoS.feVarb("then", feInfo)}
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
