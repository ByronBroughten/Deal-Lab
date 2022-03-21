import styled, { css } from "styled-components";
import { useAnalyzerContext } from "../../../modules/usePropertyAnalyzer";
import { Inf } from "../../../sharedWithServer/Analyzer/SectionMetas/Info";
import {
  FeParentInfo,
  ListSectionName,
  userListItemTypes,
} from "../../../sharedWithServer/Analyzer/SectionMetas/relSectionTypes";
import { SectionNam } from "../../../sharedWithServer/Analyzer/SectionMetas/SectionName";
import ccs from "../../../theme/cssChunks";
import theme, { themeSectionNameOrDefault } from "../../../theme/Theme";
import AdditiveList from "../../appWide/AdditiveList";
import PlusBtn from "../../appWide/PlusBtn";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { listNameToStoreName } from "../../../sharedWithServer/Analyzer/SectionMetas/relSections/baseSectionTypes";
import useHowMany from "../../appWide/customHooks/useHowMany";

type Props<S extends ListSectionName = ListSectionName> = {
  className?: string;
  feInfo: FeParentInfo<S>;
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

  const listIds = analyzer.childFeIds([feInfo, listSectionName]);
  const displayTotal = SectionNam.is(listSectionName, "singleTimeList")
    ? analyzer.displayVarb(totalVarbName, feInfo)
    : analyzer.switchedOngoingDisplayVarb(totalVarbName, feInfo);

  return (
    <Styled className={`ListGroup-root ` + className ?? ""}>
      <div className="ListGroup-viewable">
        <div className="ListGroup-titleRow">
          <h6 className="ListGroup-titleText">{titleText}</h6>
          <div className="ListGroup-titleTotal">{displayTotal}</div>
          <PlusBtn
            className="ListGroup-addListBtn"
            onClick={addUpfrontCostList}
          >
            <MdOutlinePlaylistAdd className="ListGroup-addListBtnIcon" />
          </PlusBtn>
        </div>
        <div className="ListGroup-lists">
          {listIds.map((listId) => {
            return (
              <AdditiveList
                {...{
                  key: listId,
                  feInfo: Inf.fe(listSectionName, listId),
                  themeSectionName: themeSectionNameOrDefault(sectionName),
                  className: "ListGroup-list",
                }}
              />
            );
          })}
        </div>
      </div>
    </Styled>
  );
}

export const listGroupCss = css`
  .ListGroup-titleRow {
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
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
  .ListGroup-addListBtn {
    margin-left: ${theme.s2};
    .ListGroup-addListBtnIcon {
      font-size: 22px;
      padding: 0;
      margin: 0;
    }
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
