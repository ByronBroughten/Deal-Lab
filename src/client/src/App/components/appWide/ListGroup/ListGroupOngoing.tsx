import { FeParentInfo } from "../../../sharedWithServer/SectionsMeta/Info";
import { ChildName } from "../../../sharedWithServer/SectionsMeta/relSectionTypes/ChildTypes";
import { SectionName } from "../../../sharedWithServer/SectionsMeta/SectionName";
import { ThemeName } from "../../../theme/Theme";
import { VarbListOngoing } from "../VarbLists/VarbListOngoing";
import { useGetterSection } from "./../../../sharedWithServer/stateClassHooks/useGetterSection";
import {
  ListGroupGeneric,
  MakeListNodeProps,
} from "./ListGroupShared/ListGroupGeneric";

type Props<SN extends SectionName<"ongoingList"> = SectionName<"ongoingList">> =
  {
    parentInfo: FeParentInfo<SN>;
    sectionName: SN;
    itemName: ChildName<SN>;
    titleText: string;
    themeName: ThemeName;
    totalVarbNameBase: string;
    className?: string;
  };
export function ListGroupOngoing<SN extends SectionName<"ongoingList">>({
  totalVarbNameBase,
  ...props
}: Props<SN>) {
  const parent = useGetterSection(props.parentInfo);
  return (
    <ListGroupGeneric
      {...{
        ...props,
        totalVarbName: parent.switchVarbName(totalVarbNameBase, "ongoing"),
        makeListNode: (nodeProps) => (
          <VarbListOngoing {...(nodeProps as MakeListNodeProps<SN>)} />
        ),
      }}
    />
  );
}
