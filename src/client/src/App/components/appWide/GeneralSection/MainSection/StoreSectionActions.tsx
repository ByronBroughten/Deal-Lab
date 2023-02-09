import { BsLightningFill } from "react-icons/bs";
import styled from "styled-components";
import { useToggleViewNext } from "../../../../modules/customHooks/useToggleView";
import { useMainSectionActor } from "../../../../modules/sectionActorHooks/useMainSectionActor";
import { SectionNameByType } from "../../../../sharedWithServer/SectionsMeta/SectionNameByType";
import theme from "../../../../theme/Theme";
import { ActionBtn } from "./StoreSectionActionMenu/ActionBtns.tsx/ActionBtn";
import { useDefaultActionLists } from "./StoreSectionActionMenu/ActionMenuButtons";
import {
  ActionBtnName,
  ActionMenuProps,
} from "./StoreSectionActionMenu/ActionMenuTypes";

interface Props<SN extends SectionNameByType<"hasIndexStore">>
  extends ActionMenuProps {
  dropTop?: boolean;
  sectionName: SN;
  feId: string;
  className?: string;
  loadWhat: string;
}

export function StoreSectionActions<
  SN extends SectionNameByType<"hasIndexStore">
>({
  dropTop,
  className,
  sectionName,
  feId,
  loadWhat,
  ...menuListProps
}: Props<SN>) {
  const feInfo = { sectionName, feId };
  const mainSection = useMainSectionActor(feInfo);
  const controller = useToggleViewNext("list", false);
  function btnProps(actionName: ActionBtnName) {
    return {
      ...feInfo,
      loadWhat,
      onLoad: controller.closeList,
      actionName,
      key: actionName,
      className: "StoreSectionActions-actionBtn",
    };
  }
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
        controller: controller,
      }}
    >
      {!mainSection.isSaved &&
        isNotSavedArr.map((actionName) => (
          <ActionBtn {...btnProps(actionName)} />
        ))}
      {mainSection.isSaved &&
        isSavedArr.map((actionName) => <ActionBtn {...btnProps(actionName)} />)}
      {alwaysArr.map((actionName) => (
        <ActionBtn {...btnProps(actionName)} />
      ))}
    </Styled>
  );
}

const Styled = styled.div`
  display: flex;
  flex-wrap: wrap;
  .StoreSectionActions-actionBtn {
    margin: ${theme.s0};
  }
  .ActionMenuButtons-signInToSave {
    color: ${theme.info.border};
    :hover {
      color: ${theme.light};
      background-color: ${theme.info.dark};
    }
  }
`;
