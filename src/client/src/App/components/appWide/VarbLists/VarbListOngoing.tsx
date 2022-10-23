import { useSetterSection } from "../../../sharedWithServer/stateClassHooks/useSetterSection";
import { ThemeName } from "../../../theme/Theme";
import {
  VarbListGeneric,
  VarbListGenericMenuType,
} from "../ListGroup/ListGroupShared/VarbListGeneric";
import { ListItemOngoing } from "./VarbListOngoing/ListItemOngoing";

type Props = {
  feId: string;
  themeName: ThemeName;
  className?: string;
  menuType?: VarbListGenericMenuType;
};
export function VarbListOngoing({ feId, ...rest }: Props) {
  const list = useSetterSection({ sectionName: "ongoingList", feId });
  const totalVarbName = list.get.switchVarbName("total", "ongoing");
  const defaultOngoingSwitch = list
    .varb("defaultOngoingSwitch")
    .value("string");
  return (
    <VarbListGeneric
      {...{
        ...rest,
        feInfo: list.feInfo,
        itemName: "ongoingItem",
        totalVarbName,
        contentTitle: "Cost",
        childDbVarbs: {
          valueOngoingSwitch: defaultOngoingSwitch,
        },
        makeItemNode: ({ feId }) => (
          <ListItemOngoing {...{ feId, key: feId }} />
        ),
      }}
    />
  );
}
