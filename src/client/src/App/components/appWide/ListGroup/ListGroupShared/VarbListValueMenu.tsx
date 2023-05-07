import { AiOutlineArrowRight } from "react-icons/ai";
import { FeSectionInfo } from "../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { SectionNameByType } from "../../../../sharedWithServer/SectionsMeta/SectionNameByType";
import { ListRouteName } from "../../../UserListEditorPage/UserComponentClosed";
import { useMakeGoToPage } from "../../customHooks/useGoToPage";
import { ActionLoadBtn } from "../../GeneralSection/MainSection/ActionBtns/ActionLoadBtn";
import { ActionSaveAsNewBtn } from "../../GeneralSection/MainSection/ActionBtns/SaveAsNewBtn";
import { StyledActionBtn } from "../../GeneralSection/MainSection/StyledActionBtn";
import { VarbListMenuStyled } from "./VarbListMenuStyled";

interface Props<SN extends SectionNameByType<"varbListAllowed">>
  extends FeSectionInfo<SN> {
  totalVarbName?: string;
  className?: string;
  routeBtnProps?: {
    title: string;
    routeName: ListRouteName;
  };
}

export function VarbListValueMenu<
  SN extends SectionNameByType<"varbListAllowed">
>({ totalVarbName, className, routeBtnProps, ...feInfo }: Props<SN>) {
  const makeGoToPage = useMakeGoToPage();

  return (
    <VarbListMenuStyled className={`VarbListMenu-root ${className ?? ""}`}>
      <div className="VarbListMenu-titleRow">
        <ActionSaveAsNewBtn {...{ ...feInfo }} />
        <ActionLoadBtn {...{ loadWhat: "List", feInfo }} />
        {routeBtnProps && (
          <StyledActionBtn
            middle={routeBtnProps.title}
            left={<AiOutlineArrowRight size={23} />}
            onClick={makeGoToPage(routeBtnProps.routeName)}
          />
        )}
        <div className="VarbListMenu-titleRowLeft" />
        <div className="VarbListGeneric-titleRowRight"></div>
      </div>
    </VarbListMenuStyled>
  );
}
