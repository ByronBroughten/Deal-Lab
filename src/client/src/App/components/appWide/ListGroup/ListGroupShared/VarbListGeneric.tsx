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
import { useGetterSection } from "../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { useSetterSection } from "../../../../sharedWithServer/stateClassHooks/useSetterSection";
import theme, { ThemeName } from "../../../../theme/Theme";
import { BigStringEditor } from "../../../inputs/BigStringEditor";
import { useOpenWidth } from "../../customHooks/useOpenWidth";
import { ActionBtnLoad } from "../../GeneralSection/MainSection/StoreSectionActionMenu/ActionBtnLoad";
import { useSaveStatus } from "../../GeneralSection/MainSection/useSaveStatus";
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
  menuType?: VarbListGenericMenuType;
};

export type VarbListGenericMenuType = "value" | "editorPage";
export function VarbListGeneric<SN extends VarbListAllowed>({
  feInfo,
  makeItemNode,
  themeName = "default",
  contentTitle,
  totalVarbName,
  className,
  childDbVarbs,
  menuType = "value",
}: Props<SN>) {
  const disableSaveStatus = true;
  let saveStatus = useSaveStatus(feInfo, disableSaveStatus);
  const list = useSetterSection(feInfo);
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
  const { toggleMenu, menuIsOpen } = useToggleView({
    viewWhat: "menu",
    initValue: false,
  });

  const listMenu = {
    value: () => (
      <ValueListMenu
        className="VarbListGeneric-menuSimple"
        {...{
          ...feInfo,
          totalVarbName,
        }}
      />
    ),
    editorPage: () => (
      <EditorPageListMenu
        className="VarbListGeneric-menuSimple"
        {...{
          ...feInfo,
          totalVarbName,
        }}
      />
    ),
  };

  return (
    <Styled
      className={"VarbListGeneric-root " + className}
      {...{ themeName, listMenuIsOpen }}
    >
      <div className="VarbListGeneric-viewable">
        {listMenu[menuType]()}
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

function ValueListMenu<SN extends VarbListAllowed>({
  totalVarbName,
  className,
  ...feInfo
}: FeSectionInfo<SN> & { totalVarbName?: string; className?: string }) {
  return (
    <StyledListMenu className={`ValueListMenu-root ${className ?? ""}`}>
      <div className="VarbListGeneric-titleRow">
        <div className="VarbListGeneric-titleRowLeft">
          {totalVarbName && (
            <VarbListTotal
              varbInfo={{
                ...feInfo,
                varbName: totalVarbName,
              }}
            />
          )}
        </div>
        <div className="VarbListGeneric-titleRowRight">
          <ActionBtnLoad
            {...{
              loadMode: "loadAndCopy",
              loadWhat: "List",
              feInfo,
            }}
          />
        </div>
      </div>
    </StyledListMenu>
  );
}

function EditorPageListMenu<SN extends VarbListAllowed>({
  totalVarbName,
  className,
  ...feInfo
}: FeSectionInfo<SN> & { totalVarbName?: string; className?: string }) {
  const list = useGetterSection(feInfo);
  return (
    <StyledListMenu className={`ValueListMenu-root ${className ?? ""}`}>
      <div className="VarbListGeneric-titleRow">
        <div className="VarbListGeneric-titleRowLeft">
          <BigStringEditor
            {...{
              feVarbInfo: list.varbInfo("displayName"),
              placeholder: "Name",
              className: "AdditiveList-title",
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
        <div className="VarbListGeneric-titleRowRight">
          <ActionBtnLoad
            {...{
              loadMode: "loadAndCopy",
              loadWhat: "List",
              feInfo,
            }}
          />
        </div>
      </div>
    </StyledListMenu>
  );
}

const StyledListMenu = styled.div`
  .ActionBtnLoad-root {
    margin-left: ${theme.s25};
    width: 75px;
    height: 25px;
    border-radius: ${theme.br0};
    box-shadow: none;

    .LabeledIconBtn-iconSpan {
      min-width: 25px;
    }
    .LabeledIconBtn-label {
      margin-left: ${theme.s2};
    }
  }
`;
