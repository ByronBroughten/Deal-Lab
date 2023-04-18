import { FeInfoByType } from "../../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { useActionMenuBtns } from "./ActionMenuButtons";
import { ActionBtnName } from "./ActionMenuTypes";

interface Props extends FeInfoByType<"hasIndexStore"> {
  onLoad?: () => void;
  actionName: ActionBtnName;
}
export function ActionMenuBtn({ actionName, ...rest }: Props) {
  const buttons = useActionMenuBtns(rest);
  return buttons[actionName];
}
