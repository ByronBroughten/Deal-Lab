import styled from "styled-components";
import theme from "../../../../../theme/Theme";
import {
  ListGroupLists,
  MakeListNode,
} from "./ListGroupGeneric/ListGroupLists";

export type ListGroupGenericProps = {
  className?: string;
  listFeIds: string[];
  addList: () => void;
  makeListNode: MakeListNode;
};

export function ListGroupGeneric({
  listFeIds,
  addList,
  makeListNode,
  className,
}: ListGroupGenericProps) {
  return (
    <Styled className={`ListGroup-root ` + className ?? ""}>
      <div className="ListGroup-viewable">
        <div className="ListGroup-titleRow">
          <div className="listGroup-titleRowRight"></div>
        </div>
        <ListGroupLists
          {...{
            feIds: listFeIds,
            makeListNode,
            addList,
          }}
        />
      </div>
    </Styled>
  );
}

const Styled = styled.div`
  ${theme.sectionBorderChunk};
  padding: ${theme.sectionPadding};

  .ListGroup-titleRow {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
  .ListGroup-titleRowLeft {
    display: flex;
    align-items: center;
    padding-left: ${theme.s1};
  }
`;
