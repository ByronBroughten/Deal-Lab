import { SectionValues } from "../../../sharedWithServer/SectionsMeta/values/StateValue";
import { useAction } from "../../../sharedWithServer/stateClassHooks/useAction";
import { useGetterSection } from "../../../sharedWithServer/stateClassHooks/useGetterSection";
import {
  VarbListGeneric,
  VarbListGenericMenuType,
} from "../ListGroup/ListGroupShared/VarbListGeneric";
import { VarbListStandardHeaders } from "../ListGroup/ListGroupShared/VarbListGeneric/VarbListStandardHeaders";
import { ListItemCapEx } from "./VarbListOngoing/ListItemCapEx";

type Props = {
  feId: string;
  className?: string;
  menuType?: VarbListGenericMenuType;
};
export function VarbListCapEx({ feId, ...rest }: Props) {
  const addChild = useAction("addChild");

  const feInfo = { sectionName: "capExList", feId } as const;
  const list = useGetterSection(feInfo);
  const totalVarbName = list.activeSwitchTargetName("total", "periodic");
  const itemPeriodicSwitch = list.varb("itemPeriodicSwitch").value("periodic");

  const sectionValues: Partial<SectionValues<"capExItem">> = {
    valueDollarsPeriodicSwitch: itemPeriodicSwitch,
  };

  const addItem = () => {
    addChild({
      feInfo,
      childName: "capExItem",
      options: { sectionValues },
    });
  };
  return (
    <VarbListGeneric
      {...{
        ...rest,
        feInfo: list.feInfo,
        headers: <VarbListStandardHeaders contentTitle={"Cost"} />,
        itemName: "capExItem",
        totalVarbName,
        addItem,
        makeItemNode: ({ feId }) => <ListItemCapEx {...{ feId, key: feId }} />,
      }}
    />
  );
}
// Should I make separate lists for utilities, closing costs, etc?
// No, just capEx I think.
