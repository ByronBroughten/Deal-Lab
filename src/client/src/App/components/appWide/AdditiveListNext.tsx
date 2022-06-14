import React from "react";
import { IoEllipsisVertical } from "react-icons/io5";
import styled, { css } from "styled-components";
import useToggleView from "../../modules/customHooks/useToggleView";
import { listNameToStoreName } from "../../sharedWithServer/SectionsMeta/baseSectionTypes";
import {
  FeInfoByType,
  FeSectionInfo,
} from "../../sharedWithServer/SectionsMeta/Info";
import { userListItemTypes } from "../../sharedWithServer/SectionsMeta/relSectionTypes/UserListTypes";
import {
  SectionName,
  sectionNameS,
} from "../../sharedWithServer/SectionsMeta/SectionName";
import { useGetterSection } from "../../sharedWithServer/stateClassHooks/useGetterSection";
import ccs from "../../theme/cssChunks";
import theme, { ThemeName } from "../../theme/Theme";
import PlainIconBtn from "../general/PlainIconBtn";
import { BigStringEditorNext } from "../inputs/BigStringEditorNext";
import AdditiveListTable from "./AdditiveListNext/AdditiveListTable";
import { ListMenu } from "./AdditiveListNext/ListMenu";
import useHowMany from "./customHooks/useHowMany";
import { useOpenWidth } from "./SectionTitleRow";

function useDisplayTotal(
  feInfo: FeSectionInfo,
  listType: SectionName<"additiveList">
) {
  const section = useGetterSection(feInfo);
  const totalVarbNameBase = "total";
  if (listType === "userSingleList")
    return section.varb(totalVarbNameBase).displayVarb();
  else return section.switchVarb(totalVarbNameBase, "ongoing").displayVarb();
}
type AdditiveListTotalProps = {
  feInfo: FeSectionInfo;
  listType: SectionName<"additiveList">;
};
function AdditiveListTotal({ feInfo, listType }: AdditiveListTotalProps) {
  const displayTotal = useDisplayTotal(feInfo, listType);
  return <div className="AdditiveList-total">{`(${displayTotal})`}</div>;
}

type Props = {
  feInfo: FeInfoByType<"allList">;
  themeName: ThemeName;
  className?: string;
};

export function AdditiveListNext({ feInfo, themeName, className }: Props) {
  const section = useGetterSection(feInfo);
  const listType = listNameToStoreName(feInfo.sectionName);
  const titleVarb = section.varb("title");
  const { listMenuIsOpen, toggleListMenu } = useToggleView({
    initValue: false,
    viewWhat: "listMenu",
  });

  const { trackWidthToggleView, ...titleRowProps } = useOpenWidth();
  const { viewIsOpen } = titleRowProps;

  const itemType = userListItemTypes[listType];
  const itemIds = section.childFeIds(itemType);
  const { isAtLeastOne } = useHowMany(itemIds);
  return (
    <Styled
      className={"AdditiveList-root " + className}
      {...{ sectionName: themeName, listMenuIsOpen }}
    >
      <div className="AdditiveList-viewable viewable">
        <div className="AdditiveList-titleRow">
          <div className="AdditiveList-titleRowLeft">
            <BigStringEditorNext
              {...{
                feVarbInfo: titleVarb.feVarbInfo,
                placeholder: "List Title",
                className: "AdditiveList-title",
                sectionName: themeName,
              }}
            />
            {sectionNameS.is(listType, "additiveList") && isAtLeastOne && (
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
        {viewIsOpen && <AdditiveListTable {...{ feInfo, themeName }} />}
      </div>
      {section.thisIsSectionType("hasIndexStore") && listMenuIsOpen && (
        <ListMenu
          className="AdditiveList-listMenu"
          {...{
            viewIsOpen,
            feInfo: section.feInfo,
            themeName,
            toggleListView: trackWidthToggleView,
          }}
        />
      )}
    </Styled>
  );
}

const Styled = styled.div<{
  sectionName: ThemeName;
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
