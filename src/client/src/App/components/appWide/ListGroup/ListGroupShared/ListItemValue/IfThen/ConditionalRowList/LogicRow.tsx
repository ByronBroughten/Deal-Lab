import styled from "styled-components";
import { useGetterSection } from "../../../../../../../stateClassHooks/useGetterSection";
import theme from "../../../../../../../theme/Theme";
import { NumObjEntityEditor } from "../../../../../../inputs/NumObjEntityEditor";
import SolidBtn from "../../../../../SolidBtn";
import IfLogic from "./LogicRow/IfLogic";

type Props = { feId: string; idx?: number | string };
export default function LogicRow({ feId, idx = "" }: Props) {
  const sectionName = "conditionalRow";
  const row = useGetterSection({
    sectionName,
    feId,
  });

  const typeVarb = row.varb("type");
  const type = row.value("type", "string");
  const level = row.value("level", "number");
  const levelArray = Array(level).fill(0);
  return (
    <Styled className={`${idx}`}>
      {type !== " " &&
        levelArray.map((_, idx) => (
          <SolidBtn className="invisible" key={idx} />
        ))}
      {/* 
        event.target used to contain both a name (varbId) and a value.
        You can use an improved select component now.
      */}
      {/* <MaterialSelect
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
      </MaterialSelect> */}

      {["if", "or if"].includes(type) && <IfLogic rowId={row.feId} />}
      {["then", "or else"].includes(type) && (
        <NumObjEntityEditor
          feVarbInfo={row.varbInfo2("then")}
          className={"then-content"}
          labelProps={{ showLabel: false }}
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
