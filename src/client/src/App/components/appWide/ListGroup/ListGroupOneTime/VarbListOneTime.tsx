import {
  VarbListGeneric,
  VarbListGenericMenuType
} from "../ListGroupShared/VarbListGeneric";
import { ListItemOneTime } from "./VarbListOneTime/ListItemOneTime";

type Props = {
  feId: string;
  menuType?: VarbListGenericMenuType;
  className?: string;
};

export function VarbListOneTime({ feId, ...rest }: Props) {
  const feInfo = { sectionName: "onetimeList", feId } as const;
  return (
    <VarbListGeneric
      {...{
        ...rest,
        feInfo,
        contentTitle: "Cost",
        totalVarbName: "total",
        makeItemNode: ({ feId }) => (
          <ListItemOneTime {...{ feId, key: feId }} />
        ),
      }}
    />
  );
}

export function OneTimeListTable() {}
