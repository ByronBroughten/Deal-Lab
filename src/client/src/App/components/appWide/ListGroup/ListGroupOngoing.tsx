import { FeParentInfo } from "../../../sharedWithServer/SectionsMeta/Info";
import { ThemeName } from "../../../theme/Theme";
import { VarbListOngoing } from "../VarbLists/VarbListOngoing";
import { useGetterSection } from "./../../../sharedWithServer/stateClassHooks/useGetterSection";
import {
  ListGroupGeneric,
  MakeListNodeProps,
} from "./ListGroupShared/ListGroupGeneric";

type Props = {
  parentInfo: FeParentInfo<"ongoingList">;
  titleText: string;
  themeName: ThemeName;
  totalVarbNameBase: string;
  className?: string;
};
export function ListGroupOngoing<SN extends "ongoingList">({
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
