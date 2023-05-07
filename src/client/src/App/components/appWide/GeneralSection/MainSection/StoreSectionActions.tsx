import { AiOutlineArrowRight } from "react-icons/ai";
import { BiReset } from "react-icons/bi";
import styled from "styled-components";
import { SectionNameByType } from "../../../../sharedWithServer/SectionsMeta/SectionNameByType";
import { useAction } from "../../../../sharedWithServer/stateClassHooks/useAction";
import theme from "../../../../theme/Theme";
import { ListRouteName } from "../../../UserListEditorPage/UserComponentClosed";
import { useMakeGoToPage } from "../../customHooks/useGoToPage";
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
  const resetSelfToDefault = useAction("resetSelfToDefault");
  const makeGoToPage = useMakeGoToPage();
  return (
    <Styled {...{ className }}>
      <ActionLoadBtn {...{ feInfo }} />
      <ActionSaveAsNewBtn {...{ btnProps: { sx: { ml: "2px" } }, ...feInfo }} />
      <StyledActionBtn
        sx={{ ml: "2px" }}
        middle="Reset default"
        left={<BiReset size={23} />}
        onClick={() => resetSelfToDefault(feInfo)}
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
