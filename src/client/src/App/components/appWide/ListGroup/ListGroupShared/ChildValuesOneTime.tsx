import { ParentName } from "../../../../sharedWithServer/SectionsMeta/sectionChildrenDerived/ParentName";
import { useAction } from "../../../../sharedWithServer/stateClassHooks/useAction";
import { useGetterSection } from "../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { SingleTimeValue } from "../../SingleTimeValue";
import { ValueGroupValues } from "./ValueGroupValues";

interface Props {
  sectionName: ParentName<"singleTimeValue">;
  feId: string;
}
export function ChildValuesOneTime(props: Props) {
  const parent = useGetterSection(props);
  const addChild = useAction("addChild");
  return (
    <ValueGroupValues
      {...{
        feIds: parent.childFeIds("singleTimeValue"),
        makeValueNode: (nodeProps) => <SingleTimeValue {...nodeProps} />,
        addValue: () =>
          addChild({
            feInfo: props,
            childName: "singleTimeValue",
          }),
      }}
    />
  );
}
