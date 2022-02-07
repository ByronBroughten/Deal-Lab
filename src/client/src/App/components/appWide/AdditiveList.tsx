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
import BtnTooltip from "./BtnTooltip";

function useTotalVarb(
  feInfo: FeInfo,
  listType: SectionName<"additiveListType">
) {
  const { analyzer } = useAnalyzerContext();
  const totalVarbNameBase = "total";
  if (listType === "userSingleList")
    return analyzer.feVarb(totalVarbNameBase, feInfo);
  else return analyzer.switchedOngoingVarb(feInfo, totalVarbNameBase);
}
type AdditiveListTotalProps = {
  feInfo: FeInfo;
  listType: SectionName<"additiveListType">;
};
function AdditiveListTotal({ feInfo, listType }: AdditiveListTotalProps) {
  const totalVarb = useTotalVarb(feInfo, listType);
  return (
    <div className="AdditiveList-total">{`Total: ${totalVarb.displayVarb()}`}</div>
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

  return (
    <Styled
      className={"AdditiveList-root " + className}
      {...{ sectionName: themeSectionName, listMenuIsOpen }}
    >
      <div className="AdditiveList-viewable viewable">
        <div className="AdditiveList-titleRow">
          <BigStringEditor
            {...{
              feVarbInfo: titleVarb.feVarbInfo,
              label: "Name",
              className: "AdditiveList-title",
              sectionName: themeSectionName,
            }}
          />

          <PlainIconBtn
            onClick={toggleListMenu}
            className="AdditiveList-ellipsisBtn"
          >
            <IoEllipsisVertical size="22" />
          </PlainIconBtn>
        </div>
        <div className="AdditiveList-subTitleRow">
          {SectionNam.is(listType, "additiveListType") && (
            <AdditiveListTotal {...{ feInfo, listType }} />
          )}
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

  .AdditiveList-ellipsisBtn {
    color: ${({ listMenuIsOpen }) =>
      listMenuIsOpen ? theme.plus.dark : theme.dark};
  }
  tr {
    border-bottom: 1px solid ${({ sectionName }) => theme[sectionName].border};
  }

  .AdditiveList-total {
    margin-top: ${theme.s2};
  }
  .AdditiveList-subTitleRow {
    display: flex;
    align-items: center;
    .PlusBtn {
      margin-left: ${theme.s2};
    }
  }
`;
