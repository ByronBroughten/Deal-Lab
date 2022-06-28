import { FeParentInfo } from "../../../sharedWithServer/SectionsMeta/Info";
import { SectionName } from "../../../sharedWithServer/SectionsMeta/SectionName";
import { ThemeName } from "../../../theme/Theme";
import {
  ListGroupGeneric,
  MakeListNodeProps,
} from "./ListGroupShared/ListGroupGeneric";
import { VarbListSingleTime } from "./ListGroupSingleTime/VarbListSingleTime";

type Props = {
  parentInfo: FeParentInfo<"singleTimeList">;
  titleText: string;
  themeName: ThemeName;
  totalVarbName: string;
  className?: string;
};
export function ListGroupSingleTime<SN extends SectionName<"singleTimeList">>(
  props: Props
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
