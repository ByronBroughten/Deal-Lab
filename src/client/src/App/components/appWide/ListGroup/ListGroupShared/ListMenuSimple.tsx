import React from "react";
import { FiMaximize2, FiMinimize2 } from "react-icons/fi";
import styled from "styled-components";
import { FeInfoByType } from "../../../../sharedWithServer/SectionsMeta/Info";
import { useSetterSection } from "../../../../sharedWithServer/stateClassHooks/useSetterSection";
import theme, { ThemeName } from "../../../../theme/Theme";
import { StandardProps } from "../../../general/StandardProps";
import XBtn from "../../Xbtn";
import ListMenuBtn from "./ListMenuSimple/ListMenuBtn";

type Props = StandardProps & {
  feInfo: FeInfoByType<"hasFullIndex">;
  themeName: ThemeName;
  toggleListView: () => void;
  viewIsOpen: boolean;
};

export function ListMenuSimple({
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
        className: "ListMenuSimple-root " + className,
        $themeName: themeName,
      }}
    >
      <div className="ListMenuSimple-viewable">
        <ListMenuBtn
          themeName={themeName}
          className="ListMenuSimple-listMenuBtn ListMenuSimple-viewBtn"
          onClick={toggleListView}
        >
          {viewIsOpen && <FiMinimize2 size={15} />}
          {!viewIsOpen && <FiMaximize2 size={15} />}
        </ListMenuBtn>
        <XBtn
          className="ListMenuSimple-listMenuBtn"
          onClick={() => section.removeSelf()}
        />
      </div>
    </Styled>
  );
}

const Styled = styled.div<{ $themeName: ThemeName }>`
  .ListMenuSimple-viewable {
    display: flex;
  }
  .ListMenuSimple-listMenuBtn {
    margin: ${theme.s1};
    margin-top: 0;
    width: 24px;
    height: 24px;
    :last-child {
      margin-right: 0;
    }
  }
`;
