import { BiReset } from "react-icons/bi";
import { HiOutlineTemplate } from "react-icons/hi";
import styled from "styled-components";
import { SectionNameByType } from "../../../../../sharedWithServer/SectionNameByType";
import { useActionWithProps } from "../../../../stateClassHooks/useAction";
import theme from "../../../../theme/Theme";
import { useConfirmationModal } from "../../../Modals/ConfirmationModalProvider";
import { ListRouteName } from "../../../UserListEditorPage/UserComponentClosed";
import { useMakeGoToPage } from "../../../customHooks/useGoToPage";
import { MuiRow } from "../../../general/MuiRow";
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
      title: "Are you sure you want to clear this section?",
      description: "If yes, you will lose all data entered into it.",
      handleSubmit: resetSelfToDefault,
    });

  return (
    <Styled {...{ className }}>
      <MuiRow>
        <ActionLoadBtn {...{ feInfo }} />
        <ActionSaveAsNewBtn
          {...{ btnProps: { sx: { ml: "2px" } }, ...feInfo }}
        />
      </MuiRow>
      <MuiRow>
        <StyledActionBtn
          sx={{ ml: "2px" }}
          isDangerous={true}
          middle="Clear"
          left={<BiReset size={23} />}
          onClick={warnThenReset}
        />
        {routeBtnProps && (
          <StyledActionBtn
            middle={"Go to templates"}
            left={<HiOutlineTemplate size={23} />}
            onClick={makeGoToPage(routeBtnProps.routeName)}
          />
        )}
      </MuiRow>
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
