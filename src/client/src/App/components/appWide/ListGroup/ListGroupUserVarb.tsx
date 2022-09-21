import { ChildSectionNameName } from "../../../sharedWithServer/SectionsMeta/childSectionsDerived/ChildSectionName";
import { FeSectionInfo } from "../../../sharedWithServer/SectionsMeta/Info";
import { ParentOfTypeName } from "../../../sharedWithServer/SectionsMeta/SectionNameByType";
import { ThemeName } from "../../../theme/Theme";
import { VarbListUserVarbs } from "../VarbLists/VarbListUserVarbs";
import { ListGroupGeneric } from "./ListGroupShared/ListGroupGeneric";

type ListParentName = ParentOfTypeName<"userVarbList">;
type Props<SN extends ListParentName> = {
  listParentInfo: FeSectionInfo<SN>;
  listAsChildName: ChildSectionNameName<SN, "userVarbList">;
  titleText: string;
  themeName: ThemeName;
  className?: string;
};

export function ListGroupUserVarbs<SN extends ListParentName>(
  props: Props<SN>
) {
  return (
    <ListGroupGeneric
      {...{
        ...props,
        makeListNode: (nodeProps) => <VarbListUserVarbs {...nodeProps} />,
      }}
    />
  );
}
