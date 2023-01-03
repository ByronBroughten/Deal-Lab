import React, { ReactNode } from "react";
import styled from "styled-components";
import useToggleView from "../../../../modules/customHooks/useToggleView";
import { SectionValues } from "../../../../sharedWithServer/SectionsMeta/baseSectionsDerived/valueMetaTypes";
import { ChildName } from "../../../../sharedWithServer/SectionsMeta/sectionChildrenDerived/ChildName";
import { DbVarbs } from "../../../../sharedWithServer/SectionsMeta/sectionChildrenDerived/SectionPack/RawSection";
import { FeSectionInfo } from "../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import {
  SectionNameByType,
  SectionValuesByType,
} from "../../../../sharedWithServer/SectionsMeta/SectionNameByType";
import { useSetterSection } from "../../../../sharedWithServer/stateClassHooks/useSetterSection";
import theme, { ThemeName } from "../../../../theme/Theme";
import { BigStringEditor } from "../../../inputs/BigStringEditor";
import { useOpenWidth } from "../../customHooks/useOpenWidth";
import { useSaveStatus } from "../../GeneralSection/MainSection/useSaveStatus";
import { ListMenuFull } from "./ListMenuFull";
import { ListMenuSimple } from "./ListMenuSimple";
import { CaretSyncMenuBtn } from "./VarbListGeneric/CaretSyncMenuBtn";
import { VarbListTable } from "./VarbListGeneric/VarbListTable";
import { VarbListTotal } from "./VarbListGeneric/VarbListTotal";

type VarbListAllowed = SectionNameByType<"varbListAllowed">;
type Props<SN extends VarbListAllowed> = {
  feInfo: FeSectionInfo<SN>;
  makeItemNode: (props: { feId: string }) => ReactNode;
  themeName?: ThemeName;
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
  themeName = "default",
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
    const itemValueSwitch = list.varb("itemValueSwitch").value("string");
    list.addChild(itemName, {
      dbVarbs: {
        valueSourceSwitch: itemValueSwitch,
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
      className={"VarbListGeneric-root " + className}
      {...{ themeName, listMenuIsOpen }}
    >
      <div className="VarbListGeneric-viewable">
        {menuIsOpen && (
          <div className="VarbList-menuRow">{listMenu[menuType]()}</div>
        )}

        <div className="VarbListGeneric-titleRow">
          <div className="VarbListGeneric-titleRowLeft">
            <BigStringEditor
              {...{
                feVarbInfo: titleVarb.get.feVarbInfo,
                placeholder: "Name",
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
          <CaretSyncMenuBtn
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
    margin-bottom: ${theme.s1};
  }

  .ListMenuGeneric-root {
    margin-bottom: ${theme.s2};
  }

  .VarbListGeneric-menuSimple {
    margin-left: ${theme.s1};
  }

  .VarbListGeneric-viewable {
    flex-wrap: nowrap;

    display: inline-block;
    border: solid 1px ${theme.primaryBorder};
    background: ${theme.light};
    border-radius: ${theme.br0};
    padding: ${theme.sectionPadding};
  }

  .VarbListGeneric-titleRow {
    display: flex;
    justify-content: space-between;
  }
  .VarbListGeneric-titleRowLeft {
    display: flex;
  }
  .AdditiveList-total {
    margin-left: ${theme.s2};
  }

  .AdditiveList-ellipsisBtn {
    color: ${({ listMenuIsOpen }) =>
      listMenuIsOpen ? theme.light : theme.dark};
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
