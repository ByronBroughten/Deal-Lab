import { ThemeName } from "../../../theme/Theme";
import { VarbListOngoing } from "../VarbLists/VarbListOngoing";
import { useGetterSection } from "./../../../sharedWithServer/stateClassHooks/useGetterSection";
import { ListGroupGeneric } from "./ListGroupShared/ListGroupGeneric";

type Props = {
  feId: string;
  titleText: string;
  themeName: ThemeName;
  className?: string;
};
export function ListGroupOngoing({ feId, ...props }: Props) {
  const listGroup = useGetterSection({
    sectionName: "ongoingListGroup",
    feId,
  });
  return (
    <ListGroupGeneric
      {...{
        ...props,
        listParentInfo: listGroup.feInfo,
        listAsChildName: "ongoingList",
        makeListNode: (nodeProps) => <VarbListOngoing {...nodeProps} />,
      }}
    />
  );
}
