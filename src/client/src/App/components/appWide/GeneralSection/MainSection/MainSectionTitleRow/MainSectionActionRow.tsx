import styled from "styled-components";
import { SectionNameByType } from "../../../../../sharedWithServer/SectionsMeta/SectionNameByType";
import theme from "../../../../../theme/Theme";
import { StoreSectionActionMenu } from "../StoreSectionActionMenu";
import { ActionMenuProps } from "../StoreSectionActionMenu/ActionMenuTypes";

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
      <StoreSectionActionMenu
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

  .MainSectionActionRow-item {
    :not(:first-child) {
      margin-left: ${theme.s25};
    }
  }
`;

export const MainSectionActionRowMini = styled(MainSectionActionRow)`
  .MainSectionActionRow-item {
    :not(:first-child) {
      margin-left: 0;
    }
  }

  .MainSectionActionRow-item {
    margin-right: ${theme.s2};
  }
  .ListMenuBtn-root {
    height: ${theme.smallButtonHeight};
  }
`;
