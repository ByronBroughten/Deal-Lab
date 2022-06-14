import { FeSectionInfo } from "../../../sharedWithServer/SectionsMeta/Info";
import { SectionName } from "../../../sharedWithServer/SectionsMeta/SectionName";
import { useSetterSection } from "../../../sharedWithServer/stateClassHooks/useSetterSection";
import { ThemeName } from "../../../theme/Theme";
import { VarbListGeneric } from "../ListGroup/ListGroupShared/VarbListGeneric";
import { OngoingListItem } from "./VarbListOngoing/OngoingListItem";

type Props<SN extends SectionName<"ongoingList"> = SectionName<"ongoingList">> =
  {
    feInfo: FeSectionInfo<SN>;
    themeName: ThemeName;
  };
export function VarbListOngoing(props: Props) {
  const itemName = "ongoingItem";
  const list = useSetterSection(props.feInfo);
  const totalVarbName = list.get.switchVarbName("total", "ongoing");
  const defaultOngoingSwitch = list
    .varb("defaultOngoingSwitch")
    .value("string");
  return (
    <VarbListGeneric
      {...{
        ...props,
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
