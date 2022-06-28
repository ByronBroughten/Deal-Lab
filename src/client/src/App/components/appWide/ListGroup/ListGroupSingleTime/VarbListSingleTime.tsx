import { FeParentInfo } from "../../../../sharedWithServer/SectionsMeta/Info";
import { ThemeName } from "../../../../theme/Theme";
import { VarbListGeneric } from "../ListGroupShared/VarbListGeneric";
import { ListItemSingleTime } from "./VarbListSingleTime/ListItemSingleTime";

type Props = {
  themeName: ThemeName;
  parentInfo: FeParentInfo<"singleTimeList">;
  childName: string;
};
export function VarbListSingleTime(props: Props) {
  // whose responsibility is the key?
  return (
    <VarbListGeneric
      {...{
        ...props,
        itemName: "singleTimeItem",
        contentTitle: "Cost",
        totalVarbName: "total",
        makeItemNode: ({ feId }) => (
          <ListItemSingleTime {...{ feId, key: feId }} />
        ),
      }}
    />
  );
}
