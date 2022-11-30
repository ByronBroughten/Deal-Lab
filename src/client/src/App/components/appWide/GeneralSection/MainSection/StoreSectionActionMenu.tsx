import { BsLightningFill } from "react-icons/bs";
import styled from "styled-components";
import { useMainSectionActor } from "../../../../modules/sectionActorHooks/useMainSectionActor";
import { SectionNameByType } from "../../../../sharedWithServer/SectionsMeta/SectionNameByType";
import theme from "../../../../theme/Theme";
import { DropdownList } from "../../DropdownList";
import {
  useActionMenuBtns,
  useDefaultActionLists,
} from "./StoreSectionActionMenu/ActionMenuButtons";
import { ActionMenuProps } from "./StoreSectionActionMenu/ActionMenuTypes";

interface Props<SN extends SectionNameByType<"hasIndexStore">>
  extends ActionMenuProps {
  dropTop?: boolean;
  sectionName: SN;
  feId: string;
  className?: string;
}

export function StoreSectionActionMenu<
  SN extends SectionNameByType<"hasIndexStore">
>({ dropTop, className, sectionName, feId, ...menuListProps }: Props<SN>) {
  const feInfo = { sectionName, feId };
  const mainSection = useMainSectionActor(feInfo);
  const buttons = useActionMenuBtns(feInfo);
  const defaultActionLists = useDefaultActionLists();
  const { alwaysArr, isNotSavedArr, isSavedArr } = {
    ...defaultActionLists,
    ...menuListProps,
  };
  return (
    <Styled
      {...{
        className: `StoreSectionActionMenu-root ${className ?? ""}`,
        title: `Actions`,
        icon: <BsLightningFill className="StoreActionMenu-dropdownBtnIcon" />,
        dropTop,
      }}
    >
      {!mainSection.isSaved &&
        isNotSavedArr.map((actionName) => buttons[actionName])}
      {mainSection.isSaved &&
        isSavedArr.map((actionName) => buttons[actionName])}
      {alwaysArr.map((actionName) => buttons[actionName])}
    </Styled>
  );
}

const Styled = styled(DropdownList)`
  .LabeledIconBtn-root {
    border-top: 1px solid ${theme["gray-500"]};
  }
  .StoreActionMenu-dropdownBtnIcon {
  }
  position: relative;
`;
