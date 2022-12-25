import { ReactNode } from "react";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import styled from "styled-components";
import theme, { ThemeName } from "../../../../../theme/Theme";
import { HollowBtn } from "../../../HollowBtn";

export type MakeListNode = (props: MakeListNodeProps) => ReactNode;
type MakeListNodeProps = {
  feId: string;
  key: string;
  themeName: ThemeName;
  className?: string;
};

type Props = {
  themeName?: ThemeName;
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
    <Styled className="ListGroup-lists">
      {feIds.map((feId) => {
        return makeListNode({
          feId,
          key: feId,
          themeName: "default",
          className: "ListGroup-list",
        });
      })}
      <HollowBtn
        className="ListGroup-addListBtn ListGroup-list"
        onClick={addList}
      >
        <MdOutlinePlaylistAdd className="ListGroup-addListBtnIcon" />
      </HollowBtn>
    </Styled>
  );
}
const Styled = styled.div<{ $themeName?: ThemeName }>`
  display: flex;
  flex-wrap: wrap;
  .ListGroup-list {
    margin: ${theme.s2};
  }
  .ListGroup-addListBtn {
    border-color: ${theme.primaryBorder};
    width: 80px;
    max-height: 200px;
    min-height: 100px;
  }
  .ListGroup-addListBtnIcon {
    font-size: 35px;
    padding: 0;
    margin: 0;
  }
`;
