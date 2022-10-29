import React from "react";
import { MdOutlineSync, MdOutlineSyncDisabled } from "react-icons/md";
import styled, { css } from "styled-components";
import { useMainSectionActor } from "../../../../modules/sectionActorHooks/useMainSectionActor";
import { FeSectionInfo } from "../../../../sharedWithServer/SectionsMeta/Info";
import { SectionNameByType } from "../../../../sharedWithServer/SectionsMeta/SectionNameByType";
import theme, { ThemeName } from "../../../../theme/Theme";
import { ListMenuBtn } from "../../ListGroup/ListGroupShared/ListMenuSimple/ListMenuBtn";

type Props<SN extends SectionNameByType<"hasIndexStore">> = {
  feInfo: FeSectionInfo<SN>;
  className?: string;
};
export function ChangesSyncedStatusBtn<
  SN extends SectionNameByType<"hasIndexStore">
>({ feInfo, className }: Props<SN>) {
  const mainSection = useMainSectionActor(feInfo);
  const btnProps = {
    unsaved: {
      $themeName: "default",
      text: "Unsaved",
    },
    changesSynced: {
      $themeName: "plus",
      get icon() {
        return <MdOutlineSync />;
      },
      text: "Changes Synced",
    },
    unsyncedChanges: {
      $themeName: "primary",
      get icon() {
        return <MdOutlineSyncDisabled />;
      },
      text: "Unsynced Changes",
    },
  } as const;
  const [saveStatus, setSaveStatus] = React.useState(
    () => mainSection.saveStatus
  );

  React.useEffect(() => {
    let doIt = true;
    setTimeout(() => {
      if (doIt) {
        setSaveStatus(mainSection.saveStatus);
      }
    }, 500);
    return () => {
      doIt = false;
    };
  });
  return (
    <Styled
      {...{
        ...btnProps[saveStatus],
        className: `ChangesSyncedStatusBtn ${className ?? ""}`,
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
