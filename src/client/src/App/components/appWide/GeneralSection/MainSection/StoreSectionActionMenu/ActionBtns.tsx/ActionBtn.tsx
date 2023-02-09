import { FeInfoByType } from "../../../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { useActionBtns } from "../ActionBtns.tsx/ActionBtns";
import { ActionBtnName } from "../ActionMenuTypes";

interface Props extends FeInfoByType<"hasIndexStore"> {
  loadWhat: string;
  onLoad?: () => void;
  actionName: ActionBtnName;
  className: string;
}
export function ActionBtn({ actionName, className, ...rest }: Props) {
  const buttons = useActionBtns(rest);
  return (
    <span className={`ActionBtn-root ${className ?? ""}`}>
      {buttons[actionName]}
    </span>
  );
}
