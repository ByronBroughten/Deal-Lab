import React, { ReactNode } from "react";
import styled, { css } from "styled-components";
import useToggleView from "../../../../modules/customHooks/useToggleView";
import { SectionValues } from "../../../../sharedWithServer/SectionsMeta/baseSectionsDerived/valueMetaTypes";
import { ChildName } from "../../../../sharedWithServer/SectionsMeta/childSectionsDerived/ChildName";
import { DbVarbs } from "../../../../sharedWithServer/SectionsMeta/childSectionsDerived/SectionPack/RawSection";
import { FeSectionInfo } from "../../../../sharedWithServer/SectionsMeta/Info";
import {
  SectionName,
  SectionValuesByType,
} from "../../../../sharedWithServer/SectionsMeta/SectionName";
import { useSetterSection } from "../../../../sharedWithServer/stateClassHooks/useSetterSection";
import ccs from "../../../../theme/cssChunks";
import theme, { ThemeName } from "../../../../theme/Theme";
import { BigStringEditor } from "../../../inputs/BigStringEditor";
import { useOpenWidth } from "../../SectionTitleRow";
import { ListMenuFull } from "./ListMenuFull";
import { ListMenuSimple } from "./ListMenuSimple";
import { CaretBtn } from "./VarbListGeneric/CaretBtn";
import { VarbListTable } from "./VarbListGeneric/VarbListTable";
import { VarbListTotal } from "./VarbListGeneric/VarbListTotal";

type VarbListAllowed = SectionName<"varbListAllowed">;
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
  const list = useSetterSection(feInfo);
  const titleVarb = list.varb("displayName");
  const { listMenuIsOpen, toggleListMenu } = useToggleView({
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
    viewIsOpen,
    feInfo: listGet.feInfo,
    themeName,
    toggleListView: trackWidthToggleView,
  };

  const { toggleMenu, menuIsOpen } = useToggleView({
    viewWhat: "menu",
    initValue: false,
  });

  const listMenu = {
    full: (
      <ListMenuFull className="VarbListGeneric-menuFull" {...listMenuProps} />
    ),
    simple: (
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
      <div className="AdditiveList-viewable viewable">
        <div className="VarbList-menuRow">
          {menuIsOpen && listMenu[menuType]}
        </div>
        <div className="AdditiveList-titleRow">
          <div className="AdditiveList-titleRowLeft">
            <BigStringEditor
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
          <CaretBtn dropped={menuIsOpen} onClick={toggleMenu} />
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
    flex-direction: row-reverse;
  }

  .VarbListGeneric-menuFull {
    display: flex;
    flex-direction: row-reverse;
    margin-bottom: ${theme.s2};
  }

  .VarbListGeneric-menuSimple {
    margin-left: ${theme.s1};
  }

  .AdditiveList-viewable {
    display: flex;
    flex-wrap: nowrap;
  }

  ${({ themeName }) => ccs.subSection.main(themeName)};
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
