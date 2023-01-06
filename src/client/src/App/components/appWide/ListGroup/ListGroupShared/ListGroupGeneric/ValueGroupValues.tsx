import React from "react";
import styled from "styled-components";
import theme, { ThemeName } from "../../../../../theme/Theme";
import { ValueSectionBtn } from "../ValueSectionBtn";

export type MakeValueNode = (props: MakeListNodeProps) => React.ReactNode;
type MakeListNodeProps = {
  feId: string;
  key: string;
  className?: string;
};

interface Props {
  feIds: string[];
  makeValueNode: MakeValueNode;
  addValue: () => void;
  extraValueChildren: React.ReactNode;
  className?: string;
}
export function ValueGroupValues({
  feIds,
  makeValueNode,
  addValue,
  extraValueChildren,
  className,
}: Props) {
  return (
    <Styled className={`ValueGroup-values ${className ?? ""}`}>
      {extraValueChildren}
      {feIds.map((feId) => {
        return makeValueNode({
          feId,
          key: feId,
          className: "ValueGroup-value",
        });
      })}
      <ValueSectionBtn
        text={"+ Custom"}
        onClick={addValue}
        className="ValueGroup-addValueBtn ValueGroup-value"
      />
    </Styled>
  );
}
const Styled = styled.div<{ $themeName?: ThemeName }>`
  display: flex;
  flex-wrap: wrap;
  .ValueGroup-value {
    margin: ${theme.flexElementSpacing};
  }
  .ValueGroup-addValueBtn {
    height: calc(${theme.valueSectionSize} + 18px);
    width: 120px;
  }
  .ValueGroup-addValueBtnIcon {
    font-size: 35px;
    padding: 0;
    margin: 0;
  }
`;
