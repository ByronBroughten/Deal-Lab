import { AiOutlineArrowRight } from "react-icons/ai";
import { BiReset } from "react-icons/bi";
import styled from "styled-components";
import { useMainSectionActor } from "../../../../modules/sectionActorHooks/useMainSectionActor";
import { SectionNameByType } from "../../../../sharedWithServer/SectionsMeta/SectionNameByType";
import theme from "../../../../theme/Theme";
import { ListRouteName } from "../../../UserListEditorPage/UserComponentClosed";
import { useMakeGoToPage } from "../../customHooks/useGoToPage";
import { StyledActionBtn } from "./StoreSectionActionMenu/ActionBtns.tsx/StyledActionBtn";
import { ActionLoadBtn } from "./StoreSectionActionMenu/ActionLoadBtn";
import { ActionMenuProps } from "./StoreSectionActionMenu/ActionMenuTypes";
import { ActionSaveAsNewBtn } from "./StoreSectionActionMenu/SaveAsNewBtn";

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
  const feInfo = { sectionName, feId };
  const mainSection = useMainSectionActor(feInfo);
  const makeGoToPage = useMakeGoToPage();
  return (
    <Styled
      {...{
        className: `StoreSectionActionMenu-root ${className ?? ""}`,
      }}
    >
      <ActionLoadBtn
        {...{
          feInfo,
          loadMode: "loadAndCopy",
        }}
      />
      <ActionSaveAsNewBtn {...{ ...feInfo }} />
      <StyledActionBtn
        middle="Reset default"
        left={<BiReset size={23} />}
        onClick={() => mainSection.replaceWithDefault()}
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
