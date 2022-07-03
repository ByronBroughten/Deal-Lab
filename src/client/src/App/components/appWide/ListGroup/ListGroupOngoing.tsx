import { ChildSectionNameName } from "../../../sharedWithServer/SectionsMeta/childSectionsDerived/ChildSectionName";
import { FeSectionInfo } from "../../../sharedWithServer/SectionsMeta/Info";
import { ParentOfTypeName } from "../../../sharedWithServer/SectionsMeta/SectionName";
import { ThemeName } from "../../../theme/Theme";
import { VarbListOngoing } from "../VarbLists/VarbListOngoing";
import { useGetterSection } from "./../../../sharedWithServer/stateClassHooks/useGetterSection";
import { ListGroupGeneric } from "./ListGroupShared/ListGroupGeneric";

type ListParentName = ParentOfTypeName<"ongoingList">;
type Props<SN extends ListParentName> = {
  listParentInfo: FeSectionInfo<SN>;
  listAsChildName: ChildSectionNameName<SN, "ongoingList">;
  titleText: string;
  themeName: ThemeName;
  totalVarbNameBase: string;
  className?: string;
};
export function ListGroupOngoing<SN extends ListParentName>({
  totalVarbNameBase,
  ...props
}: Props<SN>) {
  const parent = useGetterSection(props.listParentInfo);
  return (
    <ListGroupGeneric
      {...{
        ...props,
        totalVarbName: parent.switchVarbName(totalVarbNameBase, "ongoing"),
        makeListNode: (nodeProps) => <VarbListOngoing {...nodeProps} />,
      }}
    />
  );
}
