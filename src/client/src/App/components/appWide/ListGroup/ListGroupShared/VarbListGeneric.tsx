import React, { ReactNode } from "react";
import styled, { css } from "styled-components";
import useToggleView from "../../../../modules/customHooks/useToggleView";
import { SectionValues } from "../../../../sharedWithServer/SectionsMeta/baseSectionsDerived/valueMetaTypes";
import { ChildName } from "../../../../sharedWithServer/SectionsMeta/childSectionsDerived/ChildName";
import { DbVarbs } from "../../../../sharedWithServer/SectionsMeta/childSectionsDerived/SectionPack/RawSection";
import { FeSectionInfo } from "../../../../sharedWithServer/SectionsMeta/Info";
import {
  SectionNameByType,
  SectionValuesByType,
} from "../../../../sharedWithServer/SectionsMeta/SectionNameByType";
import { useSetterSection } from "../../../../sharedWithServer/stateClassHooks/useSetterSection";
import ccs from "../../../../theme/cssChunks";
import theme, { ThemeName } from "../../../../theme/Theme";
import { BigStringEditor } from "../../../inputs/BigStringEditor";
import { useSaveStatus } from "../../GeneralSection/MainSection/useSaveStatus";
import { useOpenWidth } from "../../SectionTitleRow";
import { ListMenuFull } from "./ListMenuFull";
import { ListMenuSimple } from "./ListMenuSimple";
import { CaretMenuBtn } from "./VarbListGeneric/CaretMenuBtn";
import { VarbListTable } from "./VarbListGeneric/VarbListTable";
import { VarbListTotal } from "./VarbListGeneric/VarbListTotal";

type VarbListAllowed = SectionNameByType<"varbListAllowed">;
type Props<SN extends VarbListAllowed> = {
  feInfo: FeSectionInfo<SN>;
  makeItemNode: (props: { feId: string }) => ReactNode;
  themeName: ThemeName;
  contentTitle: string;
  totalVarbName?: string;
  className?: string;
  childDbVarbs?: DbVarbs;
  menuType?: "simple" | "full";
};

export type VarbListGenericMenuType = "simple" | "full";
export function VarbListGeneric<SN extends VarbListAllowed>({
  feInfo,
  makeItemNode,
  themeName,
  contentTitle,
  totalVarbName,
  className,
  childDbVarbs,
  menuType = "full",
}: Props<SN>) {
  const disableSaveStatus = menuType === "simple";
  let saveStatus = useSaveStatus(feInfo, disableSaveStatus);
  const list = useSetterSection(feInfo);
  const titleVarb = list.varb("displayName");
  const { listMenuIsOpen } = useToggleView({
    initValue: false,
    viewWhat: "listMenu",
  });

  const { trackWidthToggleView, ...titleRowProps } = useOpenWidth();
  const { viewIsOpen } = titleRowProps;

  const itemName = list.meta.varbListItem as ChildName<SN>;

  const addItem = () => {
    const defaultValueSwitch = list.varb("defaultValueSwitch").value("string");
    list.addChild(itemName, {
      dbVarbs: {
        valueSwitch: defaultValueSwitch,
        ...childDbVarbs,
      } as SectionValuesByType<"varbListItem"> as SectionValues<any>,
    });
  };

  const items = list.get.children(itemName);
  const listGet = list.get;

  const listMenuProps = {
    ...listGet.feInfo,
    viewIsOpen,
    themeName,
    toggleListView: trackWidthToggleView,
    saveStatus,
  } as const;

  const { toggleMenu, menuIsOpen } = useToggleView({
    viewWhat: "menu",
    initValue: false,
  });

  const listMenu = {
    full: () => (
      <ListMenuFull className="VarbListGeneric-menuFull" {...listMenuProps} />
    ),
    simple: () => (
      <ListMenuSimple
        className="VarbListGeneric-menuSimple"
        {...listMenuProps}
      />
    ),
  };
  return (
    <Styled
      className={"AdditiveList-root " + className}
      {...{ themeName, listMenuIsOpen }}
    >
      <div className="VarbListGeneric-viewable viewable">
        <div className="VarbList-menuRow">
          {menuIsOpen && listMenu[menuType]()}
        </div>
        <div className="AdditiveList-titleRow">
          <div className="AdditiveList-titleRowLeft">
            <BigStringEditor
              {...{
                feVarbInfo: titleVarb.get.feVarbInfo,
                placeholder: "Category",
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
          <CaretMenuBtn
            saveStatus={saveStatus}
            className="VarbListGeneric-caretBtn"
            dropped={menuIsOpen}
            onClick={toggleMenu}
          />
        </div>

        {viewIsOpen && (
          <VarbListTable {...{ themeName, contentTitle, addItem }}>
            {items.map((item) => makeItemNode(item))}
          </VarbListTable>
        )}
      </div>
    </Styled>
  );
}

const Styled = styled.div<{
  themeName: ThemeName;
  listMenuIsOpen: boolean;
}>`
  display: flex;
  align-items: flex-start;

  .VarbList-menuRow {
    display: flex;
  }

  .ListMenuGeneric-root {
    margin-bottom: ${theme.s2};
  }

  .VarbListGeneric-menuSimple {
    margin-left: ${theme.s1};
  }

  .VarbListGeneric-viewable {
    display: flex;
    flex-wrap: nowrap;
  }

  border: solid 1px ${theme.primaryBorder};
  border-radius: ${theme.br0};
  .viewable {
    ${ccs.subSection.viewable};
    .title-row {
      ${ccs.subSection.titleRow}
    }
  }

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
        border-radius: ${theme.br0} 0 0 ${theme.br0};
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

  .VarbListTable-root {
    margin-top: ${theme.s2};
  }

  .VarbListGeneric-caretBtn {
    margin-left: ${theme.s2};
    height: ${theme.smallButtonHeight};
  }
`;
