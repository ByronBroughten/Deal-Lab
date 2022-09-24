import styled, { css } from "styled-components";
import { useMainSectionActor } from "../../../../modules/sectionActorHooks/useMainSectionActor";
import { FeSectionInfo } from "../../../../sharedWithServer/SectionsMeta/Info";
import { SectionNameByType } from "../../../../sharedWithServer/SectionsMeta/SectionNameByType";
import theme, { ThemeName } from "../../../../theme/Theme";
import ListMenuBtn from "../../ListGroup/ListGroupShared/ListMenuSimple/ListMenuBtn";

export function StoreSectionSaveStatus<
  SN extends SectionNameByType<"hasIndexStore">
>({ feInfo }: { feInfo: FeSectionInfo<SN> }) {
  const mainSection = useMainSectionActor(feInfo);
  const btnProps = {
    unsaved: {
      $themeName: "default",
      children: "Unsaved",
    },
    saved: {
      $themeName: "plus",
      children: "Saved",
    },
    unsavedChanges: {
      $themeName: "error",
      children: "Unsaved Changes",
    },
  } as const;
  return <Styled {...btnProps[mainSection.saveStatus]} />;
}

const Styled = styled(ListMenuBtn)<{ $themeName: ThemeName }>`
  background: transparent;
  ${({ $themeName }) => css`
    border: 2px solid ${theme[$themeName].border};
    color: ${theme[$themeName].border};
    font-weight: 700;
  `};
`;
