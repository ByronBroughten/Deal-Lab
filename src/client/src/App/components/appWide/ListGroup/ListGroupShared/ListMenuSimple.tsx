import React from "react";
import styled from "styled-components";
import { FeInfoByType } from "../../../../sharedWithServer/SectionsMeta/Info";
import { useSetterSection } from "../../../../sharedWithServer/stateClassHooks/useSetterSection";
import { ThemeName } from "../../../../theme/Theme";
import { StandardProps } from "../../../general/StandardProps";
import { MainSectionMenusMini } from "../../GeneralSection/MainSection/MainSectionTitleRow/MainSectionMenus";
import { ViewAndXMenu } from "./ListMenuSimple/ViewAndXMenu";

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
        <MainSectionMenusMini
          {...{
            ...feInfo,
            pluralName: "lists",
            showActions: true,
            actionMenuProps: {
              isNotSavedArr: [],
              isSavedArr: [],
              alwaysArr: ["createNew"],
            },
            showLoadList: false,
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
  .ListMenuSimple-viewable {
    display: flex;
  }
`;
