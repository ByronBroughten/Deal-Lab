import { FeInfoByType } from "../../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { useActionMenuBtns } from "./ActionMenuButtons";
import { MenuActionName } from "./ActionMenuTypes";

interface Props extends FeInfoByType<"hasIndexStore"> {
  loadWhat: string;
  onLoad?: () => void;
  actionName: MenuActionName;
}
export function ActionMenuBtn({ actionName, ...rest }: Props) {
  const buttons = useActionMenuBtns(rest);
  return buttons[actionName];
}
