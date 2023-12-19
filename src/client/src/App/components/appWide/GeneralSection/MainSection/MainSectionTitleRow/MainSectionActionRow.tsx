import { SectionNameByType } from "../../../../../../sharedWithServer/SectionNameByType";
import { ActionMenuProps } from "../ActionBtns/ActionMenuTypes";
import { StoreSectionActions } from "../StoreSectionActions";

export interface MainSectionMenuOptions {
  dropTop?: boolean;
  actionMenuProps?: ActionMenuProps;
}

interface Props extends MainSectionMenuOptions {
  sectionName: SectionNameByType<"hasIndexStore">;
  feId: string;
  className?: string;
}
export function MainSectionActionRow({
  dropTop,
  className,
  actionMenuProps,
  ...feInfo
}: Props) {
  return (
    <StoreSectionActions
      {...{
        ...feInfo,
        ...actionMenuProps,
        dropTop,
      }}
    />
  );
}
