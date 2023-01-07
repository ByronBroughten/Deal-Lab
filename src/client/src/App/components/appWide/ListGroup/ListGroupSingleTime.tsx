import { ThemeName } from "../../../theme/Theme";
import { ListGroupGeneric } from "./ListGroupShared/ListGroupGeneric";
import { VarbListSingleTime } from "./ListGroupSingleTime/VarbListSingleTime";

type Props = {
  feId: string;
  titleText: string;
  themeName: ThemeName;
  className?: string;
};

export function ListGroupSingleTime({ feId, ...props }: Props) {
  return (
    <ListGroupGeneric
      {...{
        ...props,
        listParentInfo: {
          sectionName: "singleTimeListGroup",
          feId,
        } as const,
        listAsChildName: "singleTimeList",
        totalVarbName: "total",
        makeListNode: (nodeProps) => <VarbListSingleTime {...nodeProps} />,
      }}
    />
  );
}
