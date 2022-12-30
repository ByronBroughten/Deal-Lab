import styled from "styled-components";
import { FeInfoByType } from "../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import theme, { ThemeName } from "../../../../theme/Theme";
import {
  MainSectionActionRowMini,
  MainSectionMenuOptions,
} from "../../GeneralSection/MainSection/MainSectionTitleRow/MainSectionActionRow";
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
        <MainSectionActionRowMini
          {...{
            ...feInfo,
            ...rest,
            loadWhat: "List",
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
    border-bottom: 1px solid ${theme.transparentGrayBorder};
    padding-bottom: ${theme.s2};
  }
`;
