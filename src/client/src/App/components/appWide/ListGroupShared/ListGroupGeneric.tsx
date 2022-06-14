import { ReactNode } from "react";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import styled, { css } from "styled-components";
import {
  FeParentInfo,
  FeSectionInfo,
} from "../../../sharedWithServer/SectionsMeta/Info";
import { ChildName } from "../../../sharedWithServer/SectionsMeta/relSectionTypes/ChildTypes";
import { SectionName } from "../../../sharedWithServer/SectionsMeta/SectionName";
import { useSetterSection } from "../../../sharedWithServer/stateClassHooks/useSetterSection";
import ccs from "../../../theme/cssChunks";
import theme, { ThemeName } from "../../../theme/Theme";
import useHowMany from "../customHooks/useHowMany";
import PlusBtn from "../PlusBtn";
import { ListGroupTotal } from "./ListGroupGeneric/ListGroupTotal";

type Props<SN extends SectionName<"allList"> = SectionName<"allList">> = {
  themeName: ThemeName;
  parentInfo: FeParentInfo<SN>;
  sectionName: SN;
  itemName: ChildName<SN>;
  makeListNode: ({
    feInfo,
    themeName,
    key,
  }: MakeListNodeProps<SN>) => ReactNode;
  titleText: string;
  totalVarbName?: string;
  className?: string;
};

export type MakeListNodeProps<SN extends SectionName<"allList">> = {
  feInfo: FeSectionInfo<SN>;
  themeName: ThemeName;
  className?: string;
  key: string;
};

export function ListGroupGeneric({
  themeName,
  parentInfo,
  sectionName,
  itemName,
  makeListNode,
  titleText,
  totalVarbName,
  className,
}: Props) {
  const parent = useSetterSection(parentInfo);
  const lists = parent.get.children(sectionName);

  const numListsWithItems = lists.reduce<number>((num, list) => {
    const childIds = list.childFeIds(itemName);
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
          {lists.map(({ feInfo, feId }) => {
            return makeListNode({
              feInfo,
              themeName,
              key: feId,
              className: "ListGroup-list",
            });
          })}
          <PlusBtn
            className="ListGroup-addListBtn ListGroup-list"
            onClick={() => parent.addChild(sectionName)}
          >
            <MdOutlinePlaylistAdd className="ListGroup-addListBtnIcon" />
          </PlusBtn>
        </div>
      </div>
    </Styled>
  );
}

export const listGroupCss = css`
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
  .ListGroup-addListBtn {
    width: 42px;
  }
  .ListGroup-addListBtnIcon {
    font-size: 35px;
    padding: 0;
    margin: 0;
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
    ${ccs.coloring.section.lightNeutral};
    padding: ${theme.s2};
  }
`;

const Styled = styled.div`
  ${listGroupCss}
`;
