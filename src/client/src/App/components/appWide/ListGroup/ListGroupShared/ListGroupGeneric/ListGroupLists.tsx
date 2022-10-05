import { ReactNode } from "react";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import styled, { css } from "styled-components";
import ccs from "../../../../../theme/cssChunks";
import theme, { ThemeName } from "../../../../../theme/Theme";
import PlusBtn from "../../../PlusBtn";

export type MakeListNode = (props: MakeListNodeProps) => ReactNode;
type MakeListNodeProps = {
  feId: string;
  key: string;
  themeName: ThemeName;
  className?: string;
};

type Props = {
  themeName: ThemeName;
  feIds: string[];
  makeListNode: MakeListNode;
  addList: () => void;
};
export function ListGroupLists({
  themeName,
  feIds,
  makeListNode,
  addList,
}: Props) {
  return (
    <Styled className="ListGroup-lists" $themeName={themeName}>
      {feIds.map((feId) => {
        return makeListNode({
          feId,
          key: feId,
          themeName,
          className: "ListGroup-list",
        });
      })}
      <PlusBtn
        className="ListGroup-addListBtn ListGroup-list"
        onClick={addList}
      >
        <MdOutlinePlaylistAdd className="ListGroup-addListBtnIcon" />
      </PlusBtn>
    </Styled>
  );
}
const Styled = styled.div<{ $themeName: ThemeName }>`
  ${({ $themeName }) => listGroupListsCss($themeName)}
`;
const listGroupListsCss = (themeName: ThemeName = "default") => css`
  display: flex;
  flex-wrap: wrap;
  .ListGroup-list {
    margin: ${theme.s2};
  }
  .ListGroup-addListBtn {
    ${ccs.mainColorSection(themeName)};
    width: 42px;
    max-height: 200px;
    min-height: 100px;
    :hover {
      background: ${theme[themeName].dark};
    }
  }
  .ListGroup-addListBtnIcon {
    font-size: 35px;
    padding: 0;
    margin: 0;
  }
`;
