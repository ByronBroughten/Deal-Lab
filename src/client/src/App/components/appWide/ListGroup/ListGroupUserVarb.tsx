import { ChildSectionNameName } from "../../../sharedWithServer/SectionsMeta/sectionChildrenDerived/ChildSectionName";
import { FeSectionInfo } from "../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { ParentOfTypeName } from "../../../sharedWithServer/SectionsMeta/SectionNameByType";
import { ThemeName } from "../../../theme/Theme";
import { VarbListUserVarbs } from "../VarbLists/VarbListUserVarbs";
import { ListGroupGeneric } from "./ListGroupShared/ListGroupGeneric";

type ListParentName = ParentOfTypeName<"numVarbList">;
type Props<SN extends ListParentName> = {
  listParentInfo: FeSectionInfo<SN>;
  listAsChildName: ChildSectionNameName<SN, "numVarbList">;
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
