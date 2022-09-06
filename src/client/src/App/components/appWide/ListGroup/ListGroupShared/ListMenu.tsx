import React from "react";
import { FiMaximize2, FiMinimize2 } from "react-icons/fi";
import styled from "styled-components";
import useToggleView from "../../../../modules/customHooks/useToggleView";
import { FeInfoByType } from "../../../../sharedWithServer/SectionsMeta/Info";
import { useSetterSection } from "../../../../sharedWithServer/stateClassHooks/useSetterSection";
import theme, { ThemeName } from "../../../../theme/Theme";
import { StandardProps } from "../../../general/StandardProps";
import XBtn from "../../Xbtn";
import ListMenuBtn from "./ListMenu/ListMenuBtn";

function useFullIndexStoreMenu(feInfo: FeInfoByType<"hasFullIndex">) {
  const section = useSetterSection(feInfo);

  const { loadMenuIsOpen, toggleLoadMenu } = useToggleView({
    initValue: false,
    viewWhat: "loadMenu",
  });

  // const load: OnSelect = ({ dbId }: SectionOption) =>
  //   handleSet("loadSectionFromFeIndex", feInfo, dbId);
  return {
    // load,
    loadOptions: section.siblingOptions,

    loadMenuIsOpen,
    toggleLoadMenu,
    // isSaved: analyzer.sectionIsIndexSaved(feInfo),
    remove: () => section.removeSelf(), // not sure why both remove and delete
    // copy: () => handleSet("copySection", feInfo),
    // save: async () => await store.saveNewFullIndexSection(feInfo),
    // update: async () => await store.updateFullIndexSection(feInfo),
    // delete: async (dbId: string) =>
    //   await store.deleteIndexEntry(sectionName, dbId),
  };
}

type Props = StandardProps & {
  feInfo: FeInfoByType<"hasFullIndex">;
  themeName: ThemeName;
  toggleListView: () => void;
  viewIsOpen: boolean;
};

// here is the simple list menu
// let's make the more in-depth list menu

export function ListMenu({
  className,
  feInfo,
  toggleListView,
  themeName,
  viewIsOpen,
}: Props) {
  const menu = useFullIndexStoreMenu(feInfo);
  return (
    <Styled
      {...{
        className: "ListMenu-root " + className,
        $themeName: themeName,
      }}
    >
      <div className="ListMenu-viewable">
        <ListMenuBtn
          themeName={themeName}
          className="ListMenu-listMenuBtn ListMenu-viewBtn"
          onClick={toggleListView}
        >
          {viewIsOpen && <FiMinimize2 size={15} />}
          {!viewIsOpen && <FiMaximize2 size={15} />}
        </ListMenuBtn>
        <XBtn className="ListMenu-listMenuBtn" onClick={menu.remove} />
      </div>
    </Styled>
  );
}

const Styled = styled.div<{ $themeName: ThemeName }>`
  .ListMenu-viewable {
    display: flex;
  }
  .ListMenu-listMenuBtn {
    margin: ${theme.s1};
    margin-top: 0;
    width: 24px;
    height: 24px;
    :last-child {
      margin-right: 0;
    }
  }
`;
