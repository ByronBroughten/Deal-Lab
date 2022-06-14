import { FeParentInfo } from "../../../sharedWithServer/SectionsMeta/Info";
import { ChildName } from "../../../sharedWithServer/SectionsMeta/relSectionTypes/ChildTypes";
import { SectionName } from "../../../sharedWithServer/SectionsMeta/SectionName";
import { ThemeName } from "../../../theme/Theme";
import {
  ListGroupGeneric,
  MakeListNodeProps,
} from "../ListGroupShared/ListGroupGeneric";
import { VarbListSingleTime } from "./ListGroupSingleTime/VarbListSingleTime";

type Props<
  SN extends SectionName<"singleTimeList"> = SectionName<"singleTimeList">
> = {
  parentInfo: FeParentInfo<SN>;
  sectionName: SN;
  itemName: ChildName<SN>;
  titleText: string;
  themeName: ThemeName;
  totalVarbName: string;
  className?: string;
};
export function ListGroupSingleTime<SN extends SectionName<"singleTimeList">>(
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
