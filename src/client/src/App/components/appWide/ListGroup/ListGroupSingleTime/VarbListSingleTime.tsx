import {
  VarbListGeneric,
  VarbListGenericMenuType,
} from "../ListGroupShared/VarbListGeneric";
import { ListItemSingleTime } from "./VarbListSingleTime/ListItemSingleTime";

type Props = {
  feId: string;
  menuType?: VarbListGenericMenuType;
  className?: string;
};

export function VarbListSingleTime({ feId, ...rest }: Props) {
  const feInfo = { sectionName: "singleTimeList", feId } as const;
  return (
    <VarbListGeneric
      {...{
        ...rest,
        feInfo,
        contentTitle: "Cost",
        totalVarbName: "total",
        makeItemNode: ({ feId }) => (
          <ListItemSingleTime {...{ feId, key: feId }} />
        ),
      }}
    />
  );
}
