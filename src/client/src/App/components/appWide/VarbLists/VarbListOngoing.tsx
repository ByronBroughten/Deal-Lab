import { useSetterSection } from "../../../sharedWithServer/stateClassHooks/useSetterSection";
import { ThemeName } from "../../../theme/Theme";
import {
  VarbListGeneric,
  VarbListGenericMenuType,
} from "../ListGroup/ListGroupShared/VarbListGeneric";
import { OngoingListItem } from "./VarbListOngoing/OngoingListItem";

type Props = {
  feId: string;
  themeName: ThemeName;
  className?: string;
  menuType?: VarbListGenericMenuType;
};
export function VarbListOngoing({ feId, ...rest }: Props) {
  const feInfo = { sectionName: "ongoingList", feId } as const;
  const itemName = "ongoingItem";
  const list = useSetterSection(feInfo);
  const totalVarbName = list.get.switchVarbName("total", "ongoing");
  const defaultOngoingSwitch = list
    .varb("defaultOngoingSwitch")
    .value("string");
  return (
    <VarbListGeneric
      {...{
        ...rest,
        feInfo,
        itemName,
        totalVarbName,
        contentTitle: "Cost",
        childDbVarbs: {
          valueOngoingSwitch: defaultOngoingSwitch,
        },
        makeItemNode: ({ feId }) => (
          <OngoingListItem {...{ feId, key: feId }} />
        ),
      }}
    />
  );
}
