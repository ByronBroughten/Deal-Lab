import { ChildName } from "../../../sharedWithServer/SectionsMeta/childSectionsDerived/ChildTypes";
import { FeParentInfo } from "../../../sharedWithServer/SectionsMeta/Info";
import { SectionName } from "../../../sharedWithServer/SectionsMeta/SectionName";
import { ThemeName } from "../../../theme/Theme";
import { VarbListUserVarbs } from "../VarbLists/VarbListUserVarbs";
import {
  ListGroupGeneric,
  MakeListNodeProps,
} from "./ListGroupShared/ListGroupGeneric";

type Props<
  SN extends SectionName<"userVarbList"> = SectionName<"userVarbList">
> = {
  parentInfo: FeParentInfo<SN>;
  sectionName: SN;
  itemName: ChildName<SN>;
  titleText: string;
  themeName: ThemeName;
  className?: string;
};
export function ListGroupUserVarbs<SN extends SectionName<"userVarbList">>(
  props: Props<SN>
) {
  return (
    <ListGroupGeneric
      {...{
        ...props,
        makeListNode: (nodeProps) => (
          <VarbListUserVarbs {...(nodeProps as MakeListNodeProps<SN>)} />
        ),
      }}
    />
  );
}
