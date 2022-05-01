import { AiOutlineSave } from "react-icons/ai";
import { auth } from "../../../../../modules/services/authService";
import { useMainSectionIndexActions } from "../../../../../modules/useMainSectionIndexActions";
import { FeInfo } from "../../../../../sharedWithServer/SectionMetas/Info";
import TooltipIconBtn from "../../../TooltipIconBtn";

type Props = { feInfo: FeInfo<"hasRowIndexStore"> };
export default function MainSectionTitleSaveBtn({ feInfo }: Props) {
  const { saveNew } = useMainSectionIndexActions(feInfo);
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
