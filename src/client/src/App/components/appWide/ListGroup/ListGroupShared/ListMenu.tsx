import React from "react";
import { FiMaximize2, FiMinimize2 } from "react-icons/fi";
import styled from "styled-components";
import { FeInfoByType } from "../../../../sharedWithServer/SectionsMeta/Info";
import { useSetterSection } from "../../../../sharedWithServer/stateClassHooks/useSetterSection";
import theme, { ThemeName } from "../../../../theme/Theme";
import { StandardProps } from "../../../general/StandardProps";
import XBtn from "../../Xbtn";
import ListMenuBtn from "./ListMenu/ListMenuBtn";

type Props = StandardProps & {
  feInfo: FeInfoByType<"hasFullIndex">;
  themeName: ThemeName;
  toggleListView: () => void;
  viewIsOpen: boolean;
};

// here is the simple list menu
// let's make the more in-depth list menu

// Now the two buttons should work for the other lists
export function ListMenu({
  className,
  feInfo,
  toggleListView,
  themeName,
  viewIsOpen,
}: Props) {
  const section = useSetterSection(feInfo);
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
        <XBtn
          className="ListMenu-listMenuBtn"
          onClick={() => section.removeSelf()}
        />
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
