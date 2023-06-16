import { AiOutlineArrowRight } from "react-icons/ai";
import { BiReset } from "react-icons/bi";
import styled from "styled-components";
import { SectionNameByType } from "../../../../sharedWithServer/SectionsMeta/SectionNameByType";
import { useActionWithProps } from "../../../../sharedWithServer/stateClassHooks/useAction";
import theme from "../../../../theme/Theme";
import { useMakeGoToPage } from "../../../customHooks/useGoToPage";
import { useConfirmationModal } from "../../../Modals/ConfirmationDialogueProvider";
import { ListRouteName } from "../../../UserListEditorPage/UserComponentClosed";
import { ActionLoadBtn } from "./ActionBtns/ActionLoadBtn";
import { ActionMenuProps } from "./ActionBtns/ActionMenuTypes";
import { ActionSaveAsNewBtn } from "./ActionBtns/SaveAsNewBtn";
import { StyledActionBtn } from "./StyledActionBtn";

interface Props<SN extends SectionNameByType<"hasIndexStore">>
  extends ActionMenuProps {
  dropTop?: boolean;
  sectionName: SN;
  feId: string;
  className?: string;
  routeBtnProps?: {
    title: string;
    routeName: ListRouteName;
  };
}

export function StoreSectionActions<
  SN extends SectionNameByType<"hasIndexStore">
>({ className, sectionName, feId, routeBtnProps }: Props<SN>) {
  const feInfo = { sectionName, feId } as const;
  const resetSelfToDefault = useActionWithProps("resetSelfToDefault", feInfo);
  const makeGoToPage = useMakeGoToPage();
  const { setModal } = useConfirmationModal();
  const warnThenReset = () =>
    setModal({
      title: "Are you sure you want to reset this section to default?",
      description: "If yes, you will lose all the changes made to it.",
      variant: "danger",
    })
      .then(resetSelfToDefault)
      .catch();

  return (
    <Styled {...{ className }}>
      <ActionLoadBtn {...{ feInfo }} />
      <ActionSaveAsNewBtn {...{ btnProps: { sx: { ml: "2px" } }, ...feInfo }} />
      <StyledActionBtn
        sx={{ ml: "2px" }}
        isDangerous={true}
        middle="Reset default"
        left={<BiReset size={23} />}
        onClick={warnThenReset}
      />
      {routeBtnProps && (
        <StyledActionBtn
          middle={routeBtnProps.title}
          left={<AiOutlineArrowRight size={23} />}
          onClick={makeGoToPage(routeBtnProps.routeName)}
        />
      )}
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
