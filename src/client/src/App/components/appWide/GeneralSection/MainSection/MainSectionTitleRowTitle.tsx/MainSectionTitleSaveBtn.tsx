import { AiOutlineSave } from "react-icons/ai";
import { auth } from "../../../../../modules/services/authService";
import { useSectionQueryActions } from "../../../../../modules/useQueryActions/useSectionQueryActions";
import { FeInfo } from "../../../../../sharedWithServer/Analyzer/SectionMetas/Info";
import TooltipIconBtn from "../../../TooltipIconBtn";

type Props = { feInfo: FeInfo<"hasRowIndexStore"> };
export default function MainSectionTitleSaveBtn({ feInfo }: Props) {
  const store = useSectionQueryActions();

  const props = {
    className: "MainSectionTitleRow-flexUnit",
    onClick: async () => await store.postRowIndexEntry(feInfo),
    ...(auth.isLoggedIn
      ? { title: "Save" }
      : { title: "Login to save", disabled: true }),
  };

  return (
    <TooltipIconBtn {...props}>
      <AiOutlineSave />
    </TooltipIconBtn>
  );
}
