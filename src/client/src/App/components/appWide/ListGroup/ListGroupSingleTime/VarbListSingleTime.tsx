import { FeInfoByType } from "../../../../sharedWithServer/SectionsMeta/Info";
import { SectionName } from "../../../../sharedWithServer/SectionsMeta/SectionName";
import { ThemeName } from "../../../../theme/Theme";
import { VarbListGeneric } from "../ListGroupShared/VarbListGeneric";
import { ListItemSingleTime } from "./VarbListSingleTime/ListItemSingleTime";

type Props<SN extends SectionName<"singleTimeListType">> = {
  themeName: ThemeName;
  feInfo: FeInfoByType<SN>;
};
export function VarbListSingleTime<SN extends SectionName<"singleTimeListType">>(
  props: Props<SN>
) {
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
