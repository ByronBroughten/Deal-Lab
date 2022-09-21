import styled, { css } from "styled-components";
import { VarbNameNext } from "../../../../sharedWithServer/SectionsMeta/baseSectionsDerived/baseSectionTypes";
import { ChildName } from "../../../../sharedWithServer/SectionsMeta/childSectionsDerived/ChildName";
import { ChildSectionName } from "../../../../sharedWithServer/SectionsMeta/childSectionsDerived/ChildSectionName";
import { FeSectionInfo } from "../../../../sharedWithServer/SectionsMeta/Info";
import {
  ChildNameOfType,
  ParentOfTypeName,
  SectionNameByType,
} from "../../../../sharedWithServer/SectionsMeta/SectionNameByType";
import { useSetterSection } from "../../../../sharedWithServer/stateClassHooks/useSetterSection";
import { GetterSection } from "../../../../sharedWithServer/StateGetters/GetterSection";
import ccs from "../../../../theme/cssChunks";
import theme, { ThemeName } from "../../../../theme/Theme";
import useHowMany from "../../customHooks/useHowMany";
import {
  ListGroupLists,
  MakeListNode,
} from "./ListGroupGeneric/ListGroupLists";
import { ListGroupTotal } from "./ListGroupGeneric/ListGroupTotal";

type ListParentName = ParentOfTypeName<"varbListAllowed">;

export type ListGroupGenericProps<SN extends ListParentName> = {
  listParentInfo: FeSectionInfo<SN>;
  listAsChildName: ChildName<SN>;
  themeName: ThemeName;
  makeListNode: MakeListNode;
  titleText: string;
  totalVarbName?: VarbNameNext<SN>;
  className?: string;
};

export function ListGroupGeneric<
  SN extends ListParentName,
  CN extends ChildNameOfType<SN, "varbListAllowed">
>({
  themeName,
  listParentInfo,
  listAsChildName,
  makeListNode,
  titleText,
  totalVarbName,
  className,
}: ListGroupGenericProps<SN>) {
  const parent = useSetterSection(listParentInfo);
  const lists = parent.get.children(
    listAsChildName
  ) as GetterSection<any>[] as GetterSection<
    ChildSectionName<SN, CN> & SectionNameByType<"varbListAllowed">
  >[];

  const numListsWithItems = lists.reduce<number>((num, list) => {
    const itemName = list.meta.varbListItem as ChildName<
      ChildSectionName<SN, CN>
    >;
    const childIds = list.childFeIds(itemName as any);
    if (childIds.length > 0) num++;
    return num;
  }, 0);

  const { areMultiple: areMultipleLists } = useHowMany(lists);
  return (
    <Styled className={`ListGroup-root ` + className ?? ""}>
      <div className="ListGroup-viewable">
        <div className="ListGroup-titleRow">
          <div className="ListGroup-titleRowLeft">
            <h6 className="ListGroup-titleText">{titleText}</h6>
            {areMultipleLists && numListsWithItems > 1 && totalVarbName && (
              <ListGroupTotal varbInfo={parent.get.varbInfo(totalVarbName)} />
            )}
          </div>
          <div className="listGroup-titleRowRight"></div>
        </div>
        <ListGroupLists
          {...{
            themeName,
            feIds: lists.map(({ feId }) => feId),
            makeListNode,
            addList: () => parent.addChild(listAsChildName),
          }}
        />
      </div>
    </Styled>
  );
}

export const listGroupCss = () => css`
  .ListGroup-titleRow {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding: ${theme.s2} ${theme.s2} 0 ${theme.s2};
  }
  .ListGroup-titleRowLeft {
    display: flex;
    align-items: center;
  }

  .ListGroup-titleText {
    ${ccs.subSection.titleText};
    padding-left: ${theme.s1};
    font-size: 1.05rem;
    line-height: 0.95rem;
  }
  .ListGroup-totalText {
    font-weight: 700;
    font-size: 1.05rem;
    line-height: 0.95rem;
    padding-left: ${theme.s1};
    padding-top: ${theme.s1};
  }
  .ListGroup-viewable {
    ${ccs.subSection.viewable};
    ${ccs.neutralColorSection};
    padding: ${theme.s2};
  }
`;

const Styled = styled.div`
  ${listGroupCss()}
`;
