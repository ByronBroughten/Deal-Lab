import { ParentName } from "../../../../sharedWithServer/SectionsMeta/sectionChildrenDerived/ParentName";
import { useAction } from "../../../../sharedWithServer/stateClassHooks/useAction";
import { useGetterSection } from "../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { ValueSectionOngoing } from "../../OngoingValue";
import { ValueGroupValues } from "./ValueGroupValues";

interface Props {
  sectionName: ParentName<"ongoingValue">;
  feId: string;
}
export function ChildValuesOngoing(props: Props) {
  const parent = useGetterSection(props);
  const addChild = useAction("addChild");
  return (
    <ValueGroupValues
      {...{
        feIds: parent.childFeIds("ongoingValue"),
        makeValueNode: (nodeProps) => <ValueSectionOngoing {...nodeProps} />,
        addValue: () =>
          addChild({
            feInfo: props,
            childName: "ongoingValue",
          }),
      }}
    />
  );
}
