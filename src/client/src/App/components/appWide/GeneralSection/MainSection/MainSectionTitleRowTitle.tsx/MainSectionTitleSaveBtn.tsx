import { AiOutlineSave } from "react-icons/ai";
import { auth } from "../../../../../modules/services/authService";
import { useRowIndexSourceActions } from "../../../../../modules/useRowIndexSourceActions";
import { FeInfo } from "../../../../../sharedWithServer/SectionsMeta/Info";
import TooltipIconBtn from "../../../TooltipIconBtn";

type Props = { feInfo: FeInfo<"hasRowIndex"> };
export default function MainSectionTitleSaveBtn({ feInfo }: Props) {
  const { saveNew } = useRowIndexSourceActions(feInfo);
  const props = {
    className: "MainSectionTitleRow-flexUnit",
    onClick: saveNew,
    ...(auth.isLoggedIn
      ? { title: "Save New" }
      : { title: "Login to save", disabled: true }),
  };

  return (
    <TooltipIconBtn {...props}>
      <AiOutlineSave />
    </TooltipIconBtn>
  );
}
