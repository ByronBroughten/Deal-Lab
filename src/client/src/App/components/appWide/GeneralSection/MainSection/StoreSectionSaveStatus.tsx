import styled, { css } from "styled-components";
import { useMainSectionActor } from "../../../../modules/sectionActorHooks/useMainSectionActor";
import { FeSectionInfo } from "../../../../sharedWithServer/SectionsMeta/Info";
import { SectionNameByType } from "../../../../sharedWithServer/SectionsMeta/SectionNameByType";
import theme, { ThemeName } from "../../../../theme/Theme";
import ListMenuBtn from "../../ListGroup/ListGroupShared/ListMenuSimple/ListMenuBtn";

type Props<SN extends SectionNameByType<"hasIndexStore">> = {
  feInfo: FeSectionInfo<SN>;
  className?: string;
};
export function StoreSectionSaveStatus<
  SN extends SectionNameByType<"hasIndexStore">
>({ feInfo, className }: Props<SN>) {
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
  return (
    <Styled
      {...{
        ...btnProps[mainSection.saveStatus],
        className: `StoreSectionSaveStatus ${className ?? ""}`,
      }}
    />
  );
}

const Styled = styled(ListMenuBtn)<{ $themeName: ThemeName }>`
  background: transparent;
  ${({ $themeName }) => css`
    border: 2px solid ${theme[$themeName].border};
    color: ${theme[$themeName].border};
    font-weight: 700;

    :hover {
      color: ${theme[$themeName].border};
      background: transparent;
      cursor: auto;
    }
  `};
`;
