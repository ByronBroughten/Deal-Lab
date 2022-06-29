import { ChildTypeName } from "../../../sharedWithServer/SectionsMeta/childSectionsDerived/ChildTypes";
import { FeSectionInfo } from "../../../sharedWithServer/SectionsMeta/Info";
import { ParentOfTypeName } from "../../../sharedWithServer/SectionsMeta/SectionName";
import { ThemeName } from "../../../theme/Theme";
import {
  ListGroupGeneric,
  MakeListNodeProps,
} from "./ListGroupShared/ListGroupGeneric";
import { VarbListSingleTime } from "./ListGroupSingleTime/VarbListSingleTime";
type ListParentName = ParentOfTypeName<"singleTimeList">;
type Props<SN extends ListParentName> = {
  listParentInfo: FeSectionInfo<SN>;
  listAsChildName: ChildTypeName<SN, "singleTimeList">;
  titleText: string;
  themeName: ThemeName;
  totalVarbName: string;
  className?: string;
};
export function ListGroupSingleTime<SN extends ListParentName>(
  props: Props<SN>
) {
  return (
    <ListGroupGeneric
      {...{
        ...props,
        makeListNode: (nodeProps) => (
          <VarbListSingleTime {...(nodeProps as MakeListNodeProps<SN>)} />
        ),
      }}
    />
  );
}
