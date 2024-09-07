import { SectionValues } from "../../../../sharedWithServer/stateSchemas/StateValue";
import { useAction } from "../../../../stateHooks/useAction";
import { useGetterSection } from "../../../../stateHooks/useGetterSection";
import {
  VarbListGeneric,
  VarbListGenericMenuType,
} from "../ListGroup/ListGroupShared/VarbListGeneric";
import { VarbListStandardHeaders } from "../ListGroup/ListGroupShared/VarbListGeneric/VarbListStandardHeaders";
import { PeriodicItem } from "./ListGroupPeriodicList/PeriodicItem";

type Props = {
  feId: string;
  className?: string;
  menuType?: VarbListGenericMenuType;
};
export function ListGroupPeriodicList({ feId, ...rest }: Props) {
  const addChild = useAction("addChild");
  const list = useGetterSection({ sectionName: "periodicList", feId });
  const totalVarbName = "totalMonthly";

  const addItem = () => {
    const itemValueSource = list.valueNext("itemValueSource");
    const sectionValues: Partial<SectionValues<"periodicItem">> = {
      valueSourceName: itemValueSource,
    };
    addChild({
      feInfo: list.feInfo,
      childName: "periodicItem",
      options: { sectionValues },
    });
  };

  return (
    <VarbListGeneric
      {...{
        ...rest,
        feInfo: list.feInfo,
        headers: <VarbListStandardHeaders contentTitle={"Cost"} />,
        itemName: "periodicItem",
        totalVarbName,
        addItem,
        makeItemNode: ({ feId }) => <PeriodicItem {...{ feId, key: feId }} />,
      }}
    />
  );
}
