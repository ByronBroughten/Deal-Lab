import styled from "styled-components";
import { FeInfoByType } from "../../../../sharedWithServer/SectionsMeta/Info";
import { useSetterSection } from "../../../../sharedWithServer/stateClassHooks/useSetterSection";
import theme, { ThemeName } from "../../../../theme/Theme";
import {
  MainSectionMenuOptions,
  MainSectionMenusMini,
} from "../../GeneralSection/MainSection/MainSectionTitleRow/MainSectionMenus";
import { ViewAndXMenu } from "./ListMenuSimple/ViewAndXMenu";

export interface ListMenuGenericProps extends MainSectionMenuOptions {
  className?: string;
  themeName: ThemeName;
  toggleListView: () => void;
  viewIsOpen: boolean;
  feInfo: FeInfoByType<"hasFullIndex">;
}

export function ListMenuGeneric({
  feInfo,
  className,
  themeName,
  toggleListView,
  viewIsOpen,
  ...rest
}: ListMenuGenericProps) {
  const section = useSetterSection(feInfo);
  return (
    <Styled
      {...{
        className: "ListMenuGeneric-root " + className,
        $themeName: themeName,
      }}
    >
      <div className="ListMenuGeneric-viewable">
        <MainSectionMenusMini
          {...{
            ...feInfo,
            ...rest,
            pluralName: "lists",
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
  .ListMenuGeneric-viewable {
    display: flex;
    flex: 1;
    justify-content: space-between;
    background-color: ${({ $themeName }) => theme[$themeName].light};
    border: 1px solid ${theme.transparentGrayBorder};
    border-radius: ${theme.br1};
    padding: ${theme.s1};
  }
`;
