import React from "react";
import styled from "styled-components";
import theme, { ThemeName } from "../../../../../theme/Theme";
import { HollowBtn } from "../../../HollowBtn";

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
}
export function ValueGroupValues({
  feIds,
  makeValueNode,
  addValue,
  extraValueChildren,
}: Props) {
  return (
    <Styled className="ValueGroup-values">
      {extraValueChildren}
      {feIds.map((feId) => {
        return makeValueNode({
          feId,
          key: feId,
          className: "ValueGroup-value",
        });
      })}
      <HollowBtn
        className="ValueGroup-addValueBtn ValueGroup-value"
        onClick={addValue}
      >
        <>
          <span>+ Custom</span>
          {/* <BiPlus className="ValueGroup-addValueBtnIcon" /> */}
        </>
      </HollowBtn>
    </Styled>
  );
}
const Styled = styled.div<{ $themeName?: ThemeName }>`
  display: flex;
  flex-wrap: wrap;
  .ValueGroup-value {
    margin: ${theme.s2};
  }
  .ValueGroup-addValueBtn {
    height: calc(${theme.valueSectionSize} + 18px);
    width: 100px;
    border-color: ${theme.primaryBorder};
    font-size: ${theme.smallTitleSize};
  }
  .ValueGroup-addValueBtnIcon {
    font-size: 35px;
    padding: 0;
    margin: 0;
  }
`;
