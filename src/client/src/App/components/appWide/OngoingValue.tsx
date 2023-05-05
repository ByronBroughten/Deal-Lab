import { useSetterSection } from "../../sharedWithServer/stateClassHooks/useSetterSection";
import { ListEditorOngoing } from "../ActiveDealPage/ActiveDeal/ActiveDealSections/PropertyEditor/ValueShared.tsx/ListEditorOngoing";
import { ValueSectionGeneric } from "./ValueSectionGeneric";

interface Props {
  className?: string;
  feId: string;
  displayName?: string;
}

export function ValueSectionOngoing({ feId, ...rest }: Props) {
  const section = useSetterSection({
    sectionName: "ongoingValue",
    feId,
  });
  const valueName = section.get.activeSwitchTargetName("value", "ongoing");
  return (
    <ValueSectionGeneric
      {...{
        ...rest,
        sectionName: "ongoingValue",
        valueName,
        valueEditorName: "valueOngoingEditor",
        feId,
        makeItemizedListNode: (props) => (
          <ListEditorOngoing
            {...{
              routeBtnProps: {
                title: "Custom Lists",
                routeName: "ongoingListMain",
              },
              menuType: "value",
              ...props,
            }}
          />
        ),
      }}
    />
  );
}
