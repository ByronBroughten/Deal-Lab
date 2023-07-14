import { ReactNode } from "react";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import styled from "styled-components";
import theme from "../../../../../theme/Theme";
import { HollowBtn } from "../../../HollowBtn";

export type MakeListNode = (props: MakeListNodeProps) => ReactNode;
export type MakeListNodeProps = {
  feId: string;
  key: string;
  className?: string;
};

type Props = {
  feIds: string[];
  makeListNode: MakeListNode;
  addList: () => void;
};
export function ListGroupLists({ feIds, makeListNode, addList }: Props) {
  return (
    <Styled className="ListGroup-lists">
      {feIds.map((feId) => (
        <div key={feId}>
          {makeListNode({
            feId,
            key: feId,
            className: "ListGroup-list",
          })}
        </div>
      ))}
      <HollowBtn
        className="ListGroup-addListBtn ListGroup-list"
        onClick={addList}
        middle={<MdOutlinePlaylistAdd className="ListGroup-addListBtnIcon" />}
      />
    </Styled>
  );
}
const Styled = styled.div`
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
