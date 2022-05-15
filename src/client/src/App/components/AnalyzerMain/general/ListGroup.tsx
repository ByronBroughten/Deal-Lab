import { MdOutlinePlaylistAdd } from "react-icons/md";
import styled, { css } from "styled-components";
import { useAnalyzerContext } from "../../../modules/usePropertyAnalyzer";
import { listNameToStoreName } from "../../../sharedWithServer/SectionsMeta/baseSectionTypes";
import { InfoS } from "../../../sharedWithServer/SectionsMeta/Info";
import { ListSectionName } from "../../../sharedWithServer/SectionsMeta/relNameArrs";
import { ParentFeInfo } from "../../../sharedWithServer/SectionsMeta/relSectionTypes/ParentTypes";
import { userListItemTypes } from "../../../sharedWithServer/SectionsMeta/relSectionTypes/UserListTypes";
import { sectionNameS } from "../../../sharedWithServer/SectionsMeta/SectionName";
import ccs from "../../../theme/cssChunks";
import theme, { themeSectionNameOrDefault } from "../../../theme/Theme";
import AdditiveList from "../../appWide/AdditiveList";
import useHowMany from "../../appWide/customHooks/useHowMany";
import PlusBtn from "../../appWide/PlusBtn";

type Props<S extends ListSectionName = ListSectionName> = {
  className?: string;
  feInfo: ParentFeInfo<S>;
  listSectionName: S;
  totalVarbName: string;
  titleText: string;
};
export default function ListGroup({
  className,
  feInfo,
  listSectionName,
  titleText,
  totalVarbName,
}: Props) {
  const { sectionName } = feInfo;
  const { analyzer, handleAddSection } = useAnalyzerContext();
  const addUpfrontCostList = () => handleAddSection(listSectionName, feInfo);

  const section = analyzer.section(feInfo);
  const listIds = section.childFeIds(listSectionName);

  const listInfos = listIds.map((listId) => {
    return InfoS.fe(listSectionName, listId);
  });

  const listType = listNameToStoreName(listSectionName);
  const itemType = userListItemTypes[listType];

  const numListsWithItems = listInfos.reduce<number>((num, info) => {
    const childIds = analyzer.section(info).childFeIds(itemType);
    if (childIds.length > 0) num++;
    return num;
  }, 0);

  const { areMultiple: areMultipleLists } = useHowMany(listIds);

  // those would look best with a regular labeled input
  // with the =$75/month

  const displayTotal = sectionNameS.is(listSectionName, "singleTimeList")
    ? analyzer.displayVarb(totalVarbName, feInfo)
    : analyzer.switchedOngoingDisplayVarb(totalVarbName, feInfo);

  return (
    <Styled className={`ListGroup-root ` + className ?? ""}>
      <div className="ListGroup-viewable">
        <div className="ListGroup-titleRow">
          <div className="ListGroup-titleRowLeft">
            <h6 className="ListGroup-titleText">{titleText}</h6>
            {areMultipleLists && numListsWithItems > 1 && (
              <div className="ListGroup-titleTotal">({displayTotal})</div>
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
          {listIds.map((listId) => {
            return (
              <AdditiveList
                {...{
                  key: listId,
                  feInfo: InfoS.fe(listSectionName, listId),
                  themeSectionName: themeSectionNameOrDefault(sectionName),
                  className: "ListGroup-list",
                }}
              />
            );
          })}
          <PlusBtn
            className="ListGroup-addListBtn ListGroup-list"
            onClick={addUpfrontCostList}
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
