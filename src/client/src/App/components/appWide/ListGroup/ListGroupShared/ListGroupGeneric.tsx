import { ReactNode } from "react";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import styled, { css } from "styled-components";
import { VarbNameNext } from "../../../../sharedWithServer/SectionsMeta/baseSectionsDerived/baseSectionTypes";
import { ChildName } from "../../../../sharedWithServer/SectionsMeta/childSectionsDerived/ChildName";
import { ChildSectionName } from "../../../../sharedWithServer/SectionsMeta/childSectionsDerived/ChildSectionName";
import { FeSectionInfo } from "../../../../sharedWithServer/SectionsMeta/Info";
import {
  ChildNameOfType,
  ParentOfTypeName,
  SectionName,
} from "../../../../sharedWithServer/SectionsMeta/SectionName";
import { useSetterSection } from "../../../../sharedWithServer/stateClassHooks/useSetterSection";
import { GetterSection } from "../../../../sharedWithServer/StateGetters/GetterSection";
import ccs from "../../../../theme/cssChunks";
import theme, { ThemeName } from "../../../../theme/Theme";
import useHowMany from "../../customHooks/useHowMany";
import PlusBtn from "../../PlusBtn";
import { ListGroupTotal } from "./ListGroupGeneric/ListGroupTotal";

type ListParentName = ParentOfTypeName<"varbListAllowed">;

export type ListGroupGenericProps<SN extends ListParentName> = {
  listParentInfo: FeSectionInfo<SN>;
  listAsChildName: ChildName<SN>;
  themeName: ThemeName;
  makeListNode: (props: MakeListNodeProps) => ReactNode;
  titleText: string;
  totalVarbName?: VarbNameNext<SN>;
  className?: string;
};

export type MakeListNodeProps = {
  feId: string;
  key: string;
  themeName: ThemeName;
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
    ChildSectionName<SN, CN> & SectionName<"varbListAllowed">
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
    <Styled
      className={`ListGroup-root ` + className ?? ""}
      $themeName={themeName}
    >
      <div className="ListGroup-viewable">
        <div className="ListGroup-titleRow">
          <div className="ListGroup-titleRowLeft">
            <h6 className="ListGroup-titleText">{titleText}</h6>
            {areMultipleLists && numListsWithItems > 1 && totalVarbName && (
              <ListGroupTotal varbInfo={parent.get.varbInfo(totalVarbName)} />
            )}
          </div>
          <div className="listGroup-titleRowRight">
            {/* <BtnTooltip title="Add list" className="ListGroup-addBtnTooltip">
              <PlusBtn
                className="ListGroup-addListBtn"
                onClick={addUpfrontCostList}
              >
                <MdOutlinePlaylistAdd className="ListGroup-addListBtnIcon" />
              </PlusBtn>
            </BtnTooltip> */}
          </div>
        </div>
        <div className="ListGroup-lists">
          {lists.map(({ feId }) => {
            return makeListNode({
              feId,
              key: feId,
              themeName,
              className: "ListGroup-list",
            });
          })}
          <PlusBtn
            className="ListGroup-addListBtn ListGroup-list"
            onClick={() => parent.addChild(listAsChildName)}
          >
            <MdOutlinePlaylistAdd className="ListGroup-addListBtnIcon" />
          </PlusBtn>
        </div>
      </div>
    </Styled>
  );
}

export const listGroupCss = (themeName: ThemeName = "default") => css`
  .ListGroup-addListBtn {
    ${ccs.mainColorSection(themeName)};
    width: 42px;
    :hover {
      background: ${theme[themeName].dark};
    }
  }
  .ListGroup-addListBtnIcon {
    font-size: 35px;
    padding: 0;
    margin: 0;
  }

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
    /* ${ccs.subSection.titleText}; */
    font-weight: 700;
    font-size: 1.05rem;
    line-height: 0.95rem;
    padding-left: ${theme.s1};
    padding-top: ${theme.s1};
  }

  .ListGroup-addBtnTooltip {
    border: none;
    padding: 0;
    margin: 0;
    margin-left: ${theme.s2};
  }

  .ListGroup-lists {
    display: flex;
    flex-wrap: wrap;
  }
  .ListGroup-list {
    margin: ${theme.s2};
  }

  .ListGroup-viewable {
    ${ccs.subSection.viewable};
    ${ccs.neutralColorSection};
    padding: ${theme.s2};
  }
`;

const Styled = styled.div<{ $themeName: ThemeName }>`
  ${({ $themeName }) => listGroupCss($themeName)}
`;
