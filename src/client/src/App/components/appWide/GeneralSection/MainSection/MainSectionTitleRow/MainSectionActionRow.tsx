import styled from "styled-components";
import { SectionNameByType } from "../../../../../sharedWithServer/SectionsMeta/SectionNameByType";
import theme from "../../../../../theme/Theme";
import { ActionMenuProps } from "../StoreSectionActionMenu/ActionMenuTypes";
import { StoreSectionActions } from "../StoreSectionActions";

export interface MainSectionMenuOptions {
  dropTop?: boolean;
  actionMenuProps?: ActionMenuProps;
}

interface Props extends MainSectionMenuOptions {
  sectionName: SectionNameByType<"hasIndexStore">;
  feId: string;
  className?: string;
  loadWhat: string;
}
export function MainSectionActionRow({
  dropTop,
  className,
  actionMenuProps,
  loadWhat,
  ...feInfo
}: Props) {
  return (
    <Styled className={`MainSectionActionRow-root ${className ?? ""}`}>
      <StoreSectionActions
        {...{
          ...feInfo,
          ...actionMenuProps,
          loadWhat,
          dropTop,
          className: "MainSectionActionRow-item",
        }}
      />
    </Styled>
  );
}

const Styled = styled.div`
  display: flex;
`;

export const MainSectionActionRowMini = styled(MainSectionActionRow)`
  .ListMenuBtn-root {
    height: ${theme.smallButtonHeight};
  }
`;
