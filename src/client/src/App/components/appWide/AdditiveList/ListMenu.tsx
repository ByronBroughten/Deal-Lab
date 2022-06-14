import React from "react";
import { FiMaximize2, FiMinimize2 } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import styled, { css } from "styled-components";
import useToggleView from "../../../modules/customHooks/useToggleView";
import { useAnalyzerContext } from "../../../modules/usePropertyAnalyzer";
import { FeInfo } from "../../../sharedWithServer/SectionsMeta/Info";
import theme, { ThemeName } from "../../../theme/Theme";
import { StandardProps } from "../../general/StandardProps";
import XBtn from "../Xbtn";
import ListMenuBtn from "./ListMenuBtn";

function useFullIndexStoreMenu(feInfo: FeInfo<"hasFullIndex">) {
  const { analyzer, handleSet, handleRemoveSection } = useAnalyzerContext();
  const { loadMenuIsOpen, toggleLoadMenu } = useToggleView({
    initValue: false,
    viewWhat: "loadMenu",
  });

  const { sectionName } = feInfo;
  // const load: OnSelect = ({ dbId }: SectionOption) =>
  //   handleSet("loadSectionFromFeIndex", feInfo, dbId);
  return {
    // load,
    loadOptions: analyzer.sectionArrAsOptions(sectionName),
    loadMenuIsOpen,
    toggleLoadMenu,
    // isSaved: analyzer.sectionIsIndexSaved(feInfo),
    remove: () => handleRemoveSection(feInfo), // not sure why both remove and delete
    // copy: () => handleSet("copySection", feInfo),
    // save: async () => await store.saveNewFullIndexSection(feInfo),
    // update: async () => await store.updateFullIndexSection(feInfo),
    // delete: async (dbId: string) =>
    //   await store.deleteIndexEntry(sectionName, dbId),
  };
}

type Props = StandardProps & {
  feInfo: FeInfo<"hasFullIndex">;
  themeName: ThemeName;
  toggleListView: () => void;
  viewIsOpen: boolean;
};
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
        themeName,
      }}
    >
      <div className="ListMenu-viewable">
        <XBtn className="ListMenu-listMenuBtn" onClick={menu.remove}>
          <MdDelete size={24} />
        </XBtn>
        <ListMenuBtn className="ListMenu-listMenuBtn" onClick={toggleListView}>
          {viewIsOpen && <FiMinimize2 size={15} />}
          {!viewIsOpen && <FiMaximize2 size={15} />}
        </ListMenuBtn>
        {/* {!menu.isSaved && (
          <ListMenuBtn className="ListMenu-listMenuBtn" onClick={menu.save}>
            Save
          </ListMenuBtn>
        )}
        {menu.isSaved && (
          <ListMenuBtn className="ListMenu-listMenuBtn" onClick={menu.update}>
            Save Updates
          </ListMenuBtn>
        )}
        <ListMenuBtn className="ListMenu-listMenuBtn" onClick={menu.copy}>
          Copy
        </ListMenuBtn> */}
        {/* <ListMenuBtn
          className="ListMenu-listMenuBtn"
          onClick={menu.toggleLoadMenu}
        >
          Load
        </ListMenuBtn>
        {menu.loadMenuIsOpen && <RowIndexRows feInfo={feInfo} />} */}
      </div>
    </Styled>
  );
}

const Styled = styled.div<{ themeName: ThemeName }>`
  .ListMenu-viewable {
    border-radius: 0 ${theme.br1} ${theme.br1} 0;
    border: 1px solid;
    border-left: none;
    box-shadow: ${theme.boxShadow1};
    position: relative;

    ${({ themeName }) => css`
      background-color: ${theme[themeName].main};
      border-color: ${theme[themeName].border};
    `}
  }
  .ListMenu-listMenuBtn {
    font-size: 0.9rem;
    display: flex; // centers button content
    width: 35px;
    height: 32px;
    border-radius: 0;
  }
`;
