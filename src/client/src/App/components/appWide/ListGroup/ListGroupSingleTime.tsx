import { SectionVarbName } from "../../../sharedWithServer/SectionsMeta/baseSectionsDerived/baseSectionTypes";
import { ChildSectionNameName } from "../../../sharedWithServer/SectionsMeta/childSectionsDerived/ChildSectionName";
import { FeSectionInfo } from "../../../sharedWithServer/SectionsMeta/Info";
import { ParentOfTypeName } from "../../../sharedWithServer/SectionsMeta/SectionName";
import { ThemeName } from "../../../theme/Theme";
import { ListGroupGeneric } from "./ListGroupShared/ListGroupGeneric";
import { VarbListSingleTime } from "./ListGroupSingleTime/VarbListSingleTime";

type ListParentName = ParentOfTypeName<"singleTimeList">;
type Props<SN extends ListParentName> = {
  listParentInfo: FeSectionInfo<SN>;
  listAsChildName: ChildSectionNameName<SN, "singleTimeList">;
  titleText: string;
  themeName: ThemeName;
  totalVarbName: SectionVarbName<SN>;
  className?: string;
};
export function ListGroupSingleTime<SN extends ListParentName>(
  props: Props<SN>
) {
  return (
    <ListGroupGeneric
      {...{
        ...props,
        makeListNode: (nodeProps) => <VarbListSingleTime {...nodeProps} />,
      }}
    />
  );
}
