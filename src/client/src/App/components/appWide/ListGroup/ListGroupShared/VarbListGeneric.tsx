import React, { ReactNode } from "react";
import { IoEllipsisVertical } from "react-icons/io5";
import styled, { css } from "styled-components";
import useToggleView from "../../../../modules/customHooks/useToggleView";
import { DbVarbs } from "../../../../sharedWithServer/SectionPack/RawSection";
import { FeSectionInfo } from "../../../../sharedWithServer/SectionsMeta/Info";
import { ChildName } from "../../../../sharedWithServer/SectionsMeta/relSectionTypes/ChildTypes";
import { SectionName } from "../../../../sharedWithServer/SectionsMeta/SectionName";
import { useSetterSection } from "../../../../sharedWithServer/stateClassHooks/useSetterSection";
import { GetterSection } from "../../../../sharedWithServer/StateGetters/GetterSection";
import ccs from "../../../../theme/cssChunks";
import theme, { ThemeName } from "../../../../theme/Theme";
import PlainIconBtn from "../../../general/PlainIconBtn";
import { BigStringEditorNext } from "../../../inputs/BigStringEditorNext";
import { ListMenu } from "../../AdditiveListNext/ListMenu";
import { useOpenWidth } from "../../SectionTitleRow";
import { VarbListTable } from "./VarbListGeneric/VarbListTable";
import { VarbListTotal } from "./VarbListGeneric/VarbListTotal";

type Props<SN extends SectionName<"allList">, CN extends ChildName<SN>> = {
  feInfo: FeSectionInfo<SN>;
  itemName: CN;
  makeItemNode: (item: GetterSection<CN>) => ReactNode;
  themeName: ThemeName;
  contentTitle: string;
  totalVarbName?: string;
  className?: string;
  childDbVarbs?: DbVarbs;
};

export function VarbListGeneric<
  SN extends SectionName<"allList">,
  CN extends ChildName<SN>
>({
  feInfo,
  itemName,
  makeItemNode,
  themeName,
  contentTitle,
  totalVarbName,
  className,
  childDbVarbs,
}: Props<SN, CN>) {
  const list = useSetterSection(feInfo);
  const titleVarb = list.varb("title");
  const { listMenuIsOpen, toggleListMenu } = useToggleView({
    initValue: false,
    viewWhat: "listMenu",
  });

  const { trackWidthToggleView, ...titleRowProps } = useOpenWidth();
  const { viewIsOpen } = titleRowProps;

  const addItem = () => {
    const defaultValueSwitch = list.varb("defaultValueSwitch").value("string");
    list.addChild(itemName, {
      dbVarbs: {
        valueSwitch: defaultValueSwitch,
        ...childDbVarbs,
      },
    });
  };

  const items = list.get.children(itemName);
  const listGet = list.get;
  return (
    <Styled
      className={"AdditiveList-root " + className}
      {...{ themeName, listMenuIsOpen }}
    >
      <div className="AdditiveList-viewable viewable">
        <div className="AdditiveList-titleRow">
          <div className="AdditiveList-titleRowLeft">
            <BigStringEditorNext
              {...{
                feVarbInfo: titleVarb.get.feVarbInfo,
                placeholder: "List Title",
                className: "AdditiveList-title",
                themeName,
              }}
            />
            {totalVarbName && (
              <VarbListTotal
                varbInfo={{
                  ...feInfo,
                  varbName: totalVarbName,
                }}
              />
            )}
          </div>

          <PlainIconBtn
            onClick={toggleListMenu}
            className="AdditiveList-ellipsisBtn"
          >
            <IoEllipsisVertical size="22" />
          </PlainIconBtn>
        </div>
        {viewIsOpen && (
          <VarbListTable {...{ themeName, contentTitle, addItem }}>
            {[...items].reverse().map((item) => makeItemNode(item))}
          </VarbListTable>
        )}
      </div>
      {listGet.thisIsSectionType("hasIndexStore") && listMenuIsOpen && (
        <ListMenu
          className="AdditiveList-listMenu"
          {...{
            viewIsOpen,
            feInfo: listGet.feInfo,
            themeName,
            toggleListView: trackWidthToggleView,
          }}
        />
      )}
    </Styled>
  );
}

const Styled = styled.div<{
  themeName: ThemeName;
  listMenuIsOpen: boolean;
}>`
  display: flex;
  align-items: flex-start;

  .AdditiveList-viewable {
    display: flex;
    flex-wrap: nowrap;
  }

  ${({ themeName }) => ccs.listSection(themeName)};
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
    border-bottom: 1px solid ${({ themeName }) => theme[themeName].border};
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
