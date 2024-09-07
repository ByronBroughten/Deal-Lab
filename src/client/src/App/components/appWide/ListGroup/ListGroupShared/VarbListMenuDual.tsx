import { FeSectionInfo } from "../../../../../sharedWithServer/StateGetters/Identifiers/FeInfo";
import { SectionNameByType } from "../../../../../sharedWithServer/stateSchemas/SectionNameByType";
import { ListRouteName } from "../../../UserListEditorPage/UserComponentClosed";
import { StoreSectionActions } from "../../GeneralSection/MainSection/StoreSectionActions";
import { VarbListEditorPageMenu } from "./VarbListEditorPageMenu";
import { VarbListGenericMenuType } from "./VarbListGeneric";

interface Props<SN extends SectionNameByType<"hasIndexStore">>
  extends FeSectionInfo<SN> {
  totalVarbName?: string;
  className?: string;
  menuType: VarbListGenericMenuType;
  routeBtnProps?: {
    title: string;
    routeName: ListRouteName;
  };
}
export function VarbListMenuDual<
  SN extends SectionNameByType<"hasIndexStore">
>({ menuType, ...props }: Props<SN>) {
  const listMenu = {
    value: () => <StoreSectionActions {...props} />,
    editorPage: () => <VarbListEditorPageMenu {...props} />,
  };
  return listMenu[menuType]();
}
