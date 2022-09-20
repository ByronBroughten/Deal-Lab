import styled from "styled-components";
import { FeInfoByType } from "../../../../sharedWithServer/SectionsMeta/Info";
import { useSetterSection } from "../../../../sharedWithServer/stateClassHooks/useSetterSection";
import theme, { ThemeName } from "../../../../theme/Theme";
import { MainSectionMenusMini } from "../../GeneralSection/MainSection/MainSectionTitleRow/MainSectionMenus";
import { ViewAndXMenu } from "./ListMenuSimple/ViewAndXMenu";

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
  const section = useSetterSection(feInfo);
  return (
    <Styled
      {...{
        className: "ListMenuFull-root " + className,
        $themeName: themeName,
      }}
    >
      <div className="ListMenuFull-viewable">
        <MainSectionMenusMini
          {...{
            ...feInfo,
            pluralName: "lists",
            showActions: true,
          }}
        />
        <ViewAndXMenu
          {...{
            removeSelf: () => section.removeSelf(),
            viewIsOpen,
            toggleListView,
          }}
        />
      </div>
    </Styled>
  );
}

const Styled = styled.div<{ $themeName: ThemeName }>`
  display: flex;
  flex: 1;
  .ListMenuFull-viewable {
    display: flex;
    flex: 1;
    justify-content: space-between;
    background-color: ${({ $themeName }) => theme[$themeName].light};
    border: 1px solid ${theme.transparentGrayBorder};
    border-radius: ${theme.br1};
    padding: ${theme.s1};
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
