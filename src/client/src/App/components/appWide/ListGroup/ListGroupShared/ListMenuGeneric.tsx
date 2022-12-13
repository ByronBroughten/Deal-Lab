import styled from "styled-components";
import { FeInfoByType } from "../../../../sharedWithServer/SectionsMeta/Info";
import theme, { ThemeName } from "../../../../theme/Theme";
import {
  MainSectionMenuOptions,
  MainSectionMenusMini,
} from "../../GeneralSection/MainSection/MainSectionTitleRow/MainSectionMenus";
import { ViewAndXMenu } from "./ListMenuSimple/ViewAndXMenu";

export interface ListMenuGenericProps
  extends MainSectionMenuOptions,
    FeInfoByType<"hasFullIndex"> {
  className?: string;
  themeName: ThemeName;
  toggleListView: () => void;
  viewIsOpen: boolean;
}

export function ListMenuGeneric({
  className,
  themeName,
  toggleListView,
  viewIsOpen,
  sectionName,
  feId,
  ...rest
}: ListMenuGenericProps) {
  const feInfo = {
    sectionName,
    feId,
  };
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
            ...feInfo,
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
    border-radius: ${theme.br0};
    padding: ${theme.s1};
  }
`;
