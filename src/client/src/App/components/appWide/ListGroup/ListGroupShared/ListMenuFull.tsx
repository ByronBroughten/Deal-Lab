import { FiMaximize2, FiMinimize2 } from "react-icons/fi";
import styled from "styled-components";
import { FeInfoByType } from "../../../../sharedWithServer/SectionsMeta/Info";
import { useSetterSection } from "../../../../sharedWithServer/stateClassHooks/useSetterSection";
import theme, { ThemeName } from "../../../../theme/Theme";
import { MainSectionMenusMini } from "../../GeneralSection/MainSection/MainSectionTitleRow/MainSectionMenus";
import XBtn from "../../Xbtn";
import ListMenuBtn from "./ListMenuSimple/ListMenuBtn";

type Props = {
  className: string;
  themeName: ThemeName;
  toggleListView: () => void;
  viewIsOpen: boolean;
  feInfo: FeInfoByType<"hasFullIndex">;
};

export function ListMenuFull({
  feInfo,
  className,
  themeName,
  toggleListView,
  viewIsOpen,
}: Props) {
  const section = useSetterSection();
  return (
    <Styled
      {...{
        className: "ListMenuFull-root " + className,
        $themeName: themeName,
      }}
    >
      <div className="ListMenuSimple-viewable">
        <MainSectionMenusMini
          {...{
            ...feInfo,
            pluralName: "lists",
            showActions: false,
          }}
        />
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
