import React from "react";
import { FiMaximize2, FiMinimize2 } from "react-icons/fi";
import styled, { css } from "styled-components";
import { useStores } from "../../../modules/customHooks/useStore";
import useToggleView from "../../../modules/customHooks/useToggleView";
import { useAnalyzerContext } from "../../../modules/usePropertyAnalyzer";
import { SectionOption } from "../../../sharedWithServer/Analyzer/methods/variableOptions";
import { FeInfo } from "../../../sharedWithServer/Analyzer/SectionMetas/Info";
import theme, { ThemeSectionName } from "../../../theme/Theme";
import { StandardProps } from "../../general/StandardProps";
import { OnSelect } from "../../inputs/VarbAutoComplete";
import { LoadIndexSectionList } from "../LoadIndexSectionList";
import XBtn from "../Xbtn";
import ListMenuBtn from "./ListMenuBtn";

function useFullIndexStoreMenu(feInfo: FeInfo<"hasFullIndexStore">) {
  const { analyzer, handle, handleRemoveSection } = useAnalyzerContext();
  const store = useStores();
  const { loadMenuIsOpen, toggleLoadMenu } = useToggleView({
    initValue: false,
    viewWhat: "loadMenu",
  });

  const { sectionName } = feInfo;
  const load: OnSelect = ({ dbId }: SectionOption) =>
    handle("loadSectionFromFeIndex", feInfo, dbId);
  return {
    load,
    loadOptions: analyzer.sectionOptions(sectionName),
    loadMenuIsOpen,
    toggleLoadMenu,
    isSaved: analyzer.sectionIsIndexSaved(feInfo),
    remove: () => handleRemoveSection(feInfo), // not sure why both remove and delete
    copy: () => handle("copySection", feInfo),
    save: async () => await store.postIndexEntry(feInfo),
    update: async () => await store.putIndexEntry(feInfo),
    delete: async (dbId: string) =>
      await store.deleteIndexEntry(sectionName, dbId),
  };
}

type Props = StandardProps & {
  feInfo: FeInfo<"hasFullIndexStore">;
  themeSectionName: ThemeSectionName;
  toggleListView: () => void;
  viewIsOpen: boolean;
};
export function ListMenu({
  className,
  feInfo,
  toggleListView,
  themeSectionName,
  viewIsOpen,
}: Props) {
  const menu = useFullIndexStoreMenu(feInfo);
  return (
    <Styled
      {...{
        className: "ListMenu-root " + className,
        themeSectionName,
      }}
    >
      <div className="ListMenu-viewable">
        <XBtn className="ListMenu-listMenuBtn" onClick={menu.remove}>
          Remove
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
        {menu.loadMenuIsOpen && <LoadIndexSectionList feInfo={feInfo} />} */}
      </div>
    </Styled>
  );
}

const Styled = styled.div<{ themeSectionName: ThemeSectionName }>`
  .ListMenu-viewable {
    border-radius: 0 ${theme.br1} ${theme.br1} 0;
    border: 1px solid;
    border-left: none;
    box-shadow: ${theme.boxShadow1};
    position: relative;

    ${({ themeSectionName }) => css`
      background-color: ${theme[themeSectionName].main};
      border-color: ${theme[themeSectionName].border};
    `}
  }
  .ListMenu-listMenuBtn {
    font-size: 0.9rem;
    display: flex; // centers button content
    width: 60px;
    height: 32px;
    border-radius: 0;
  }
`;
