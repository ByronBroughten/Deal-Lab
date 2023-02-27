import styled from "styled-components";
import { ChildName } from "../../../../sharedWithServer/SectionsMeta/sectionChildrenDerived/ChildName";
import { ChildSectionName } from "../../../../sharedWithServer/SectionsMeta/sectionChildrenDerived/ChildSectionName";
import { FeSectionInfo } from "../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import {
  ChildNameOfType,
  ParentOfTypeName,
  SectionNameByType,
} from "../../../../sharedWithServer/SectionsMeta/SectionNameByType";
import { useSetterSection } from "../../../../sharedWithServer/stateClassHooks/useSetterSection";
import { GetterSection } from "../../../../sharedWithServer/StateGetters/GetterSection";
import theme from "../../../../theme/Theme";
import {
  ListGroupLists,
  MakeListNode,
} from "./ListGroupGeneric/ListGroupLists";

type ListParentName = ParentOfTypeName<"varbListAllowed">;

export type ListGroupGenericProps<SN extends ListParentName> = {
  listParentInfo: FeSectionInfo<SN>;
  listAsChildName: ChildName<SN>;
  makeListNode: MakeListNode;
  className?: string;
};

export function ListGroupGeneric<
  SN extends ListParentName,
  CN extends ChildNameOfType<SN, "varbListAllowed">
>({
  listParentInfo,
  listAsChildName,
  makeListNode,
  className,
}: ListGroupGenericProps<SN>) {
  const parent = useSetterSection(listParentInfo);
  const lists = parent.get.children(
    listAsChildName
  ) as GetterSection<any>[] as GetterSection<
    ChildSectionName<SN, CN> & SectionNameByType<"varbListAllowed">
  >[];
  return (
    <Styled className={`ListGroup-root ` + className ?? ""}>
      <div className="ListGroup-viewable">
        <div className="ListGroup-titleRow">
          <div className="listGroup-titleRowRight"></div>
        </div>
        <ListGroupLists
          {...{
            feIds: lists.map(({ feId }) => feId),
            makeListNode,
            addList: () => parent.addChild(listAsChildName),
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
