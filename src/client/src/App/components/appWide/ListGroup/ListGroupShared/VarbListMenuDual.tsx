import { FeSectionInfo } from "../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { SectionNameByType } from "../../../../sharedWithServer/SectionsMeta/SectionNameByType";
import { VarbListEditorPageMenu } from "./VarbListEditorPageMenu";
import { VarbListGenericMenuType } from "./VarbListGeneric";
import { VarbListValueMenu } from "./VarbListValueMenu";

interface Props<SN extends SectionNameByType<"varbListAllowed">>
  extends FeSectionInfo<SN> {
  totalVarbName?: string;
  className?: string;
  menuType: VarbListGenericMenuType;
}
export function VarbListMenuDual<
  SN extends SectionNameByType<"varbListAllowed">
>({ menuType, ...props }: Props<SN>) {
  const listMenu = {
    value: () => <VarbListValueMenu {...props} />,
    editorPage: () => <VarbListEditorPageMenu {...props} />,
  };
  return listMenu[menuType]();
}
