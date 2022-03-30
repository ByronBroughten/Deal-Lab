import React from "react";
import { IoEllipsisVertical } from "react-icons/io5";
import styled, { css } from "styled-components";
import useToggleView from "../../modules/customHooks/useToggleView";
import { useAnalyzerContext } from "../../modules/usePropertyAnalyzer";
import { FeInfo, Inf } from "../../sharedWithServer/Analyzer/SectionMetas/Info";
import ccs from "../../theme/cssChunks";
import theme, { ThemeSectionName } from "../../theme/Theme";
import PlainIconBtn from "../general/PlainIconBtn";
import BigStringEditor from "../inputs/BigStringEditor";
import { useOpenWidth } from "./SectionTitleRow";
import { listNameToStoreName } from "../../sharedWithServer/Analyzer/SectionMetas/relSections/baseSectionTypes";
import {
  SectionNam,
  SectionName,
} from "../../sharedWithServer/Analyzer/SectionMetas/SectionName";
import AdditiveListTable from "./AdditiveList/AdditiveListTable";
import { ListMenu } from "./AdditiveList/ListMenu";
import useHowMany from "./customHooks/useHowMany";
import { userListItemTypes } from "../../sharedWithServer/Analyzer/SectionMetas/relNameArrs/UserListTypes";

function useTotalVarb(feInfo: FeInfo, listType: SectionName<"additiveList">) {
  const { analyzer } = useAnalyzerContext();
  const totalVarbNameBase = "total";
  if (listType === "userSingleList")
    return analyzer.feVarb(totalVarbNameBase, feInfo);
  else return analyzer.switchedOngoingVarb(totalVarbNameBase, feInfo);
}
type AdditiveListTotalProps = {
  feInfo: FeInfo;
  listType: SectionName<"additiveList">;
};
function AdditiveListTotal({ feInfo, listType }: AdditiveListTotalProps) {
  const totalVarb = useTotalVarb(feInfo, listType);
  return (
    <div className="AdditiveList-total">{`(${totalVarb.displayVarb()})`}</div>
  );
}

type Props = {
  feInfo: FeInfo<"allList">;
  themeSectionName: ThemeSectionName;
  className?: string;
};

export default function AdditiveList({
  feInfo,
  themeSectionName,
  className,
}: Props) {
  const { analyzer } = useAnalyzerContext();
  const { sectionName } = feInfo;
  const listType = listNameToStoreName(sectionName);

  const titleVarb = analyzer.feVarb("title", feInfo);

  const { listMenuIsOpen, toggleListMenu } = useToggleView({
    initValue: false,
    viewWhat: "listMenu",
  });
  const { trackWidthToggleView, ...titleRowProps } = useOpenWidth();
  const { viewIsOpen } = titleRowProps;

  const itemType = userListItemTypes[listType];
  const itemIds = analyzer.section(feInfo).childFeIds(itemType);
  const { isAtLeastOne } = useHowMany(itemIds);

  return (
    <Styled
      className={"AdditiveList-root " + className}
      {...{ sectionName: themeSectionName, listMenuIsOpen }}
    >
      <div className="AdditiveList-viewable viewable">
        <div className="AdditiveList-titleRow">
          <div className="AdditiveList-titleRowLeft">
            <BigStringEditor
              {...{
                feVarbInfo: titleVarb.feVarbInfo,
                placeholder: "List Title",
                className: "AdditiveList-title",
                sectionName: themeSectionName,
              }}
            />
            {SectionNam.is(listType, "additiveList") && isAtLeastOne && (
              <AdditiveListTotal {...{ feInfo, listType }} />
            )}
          </div>

          <PlainIconBtn
            onClick={toggleListMenu}
            className="AdditiveList-ellipsisBtn"
          >
            <IoEllipsisVertical size="22" />
          </PlainIconBtn>
        </div>
        {viewIsOpen && <AdditiveListTable {...{ feInfo, themeSectionName }} />}
      </div>
      {Inf.is.fe(feInfo, "hasFullIndexStore") && listMenuIsOpen && (
        <ListMenu
          className="AdditiveList-listMenu"
          {...{
            viewIsOpen,
            feInfo,
            themeSectionName,
            toggleListView: trackWidthToggleView,
          }}
        />
      )}
    </Styled>
  );
}

const Styled = styled.div<{
  sectionName: ThemeSectionName;
  listMenuIsOpen: boolean;
}>`
  // needed to display list menu correctly
  display: flex;
  align-items: flex-start;

  .AdditiveList-viewable {
    display: flex;
    flex-wrap: nowrap;
  }

  ${({ sectionName }) => ccs.listSection(sectionName)};
  .title-row {
    align-items: flex-start;
    display: flex;
    button {
      margin-left: ${theme.s2};
    }
  }

  ${({ listMenuIsOpen }) =>
    listMenuIsOpen &&
    css`
      .viewable {
        border-right: none;
        border-radius: ${theme.br1} 0 0 ${theme.br1};
      }
    `}

  .AdditiveList-titleRow {
    display: flex;
    justify-content: space-between;
  }
  .AdditiveList-titleRowLeft {
    display: flex;
  }
  .AdditiveList-total {
    margin-left: ${theme.s2};
  }

  .AdditiveList-ellipsisBtn {
    color: ${({ listMenuIsOpen }) =>
      listMenuIsOpen ? theme.light : theme.dark};
  }
  tr {
    border-bottom: 1px solid ${({ sectionName }) => theme[sectionName].border};
  }

  .AdditiveList-title {
    .MuiInputBase-root {
      min-width: 5rem;
    }
  }

  .AdditiveList-total {
    margin-top: ${theme.s2};
  }

  .AdditiveListTable-root {
    margin-top: ${theme.s2};
  }
`;
