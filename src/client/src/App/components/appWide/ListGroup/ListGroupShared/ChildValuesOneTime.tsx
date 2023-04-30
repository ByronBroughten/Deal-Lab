import { ParentName } from "../../../../sharedWithServer/SectionsMeta/sectionChildrenDerived/ParentName";
import { ChildNameOfType } from "../../../../sharedWithServer/SectionsMeta/SectionNameByType";
import { useAction } from "../../../../sharedWithServer/stateClassHooks/useAction";
import { useGetterSection } from "../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { SingleTimeValue } from "../../SingleTimeValue";
import { ValueGroupValues } from "./ValueGroupValues";

interface Props<
  SN extends ParentName<"singleTimeValue">,
  CN extends ChildNameOfType<SN, "singleTimeValue">
> {
  sectionName: SN;
  feId: string;
  valueChildName: CN;
}
export function ChildValuesOneTime<
  SN extends ParentName<"singleTimeValue">,
  CN extends ChildNameOfType<SN, "singleTimeValue">
>({ valueChildName, ...feInfo }: Props<SN, CN>) {
  const parent = useGetterSection(feInfo);
  const addChild = useAction("addChild");
  return (
    <ValueGroupValues
      {...{
        feIds: parent.childFeIds(valueChildName),
        makeValueNode: (nodeProps) => <SingleTimeValue {...nodeProps} />,
        addValue: () =>
          addChild({
            feInfo,
            childName: valueChildName,
          }),
      }}
    />
  );
}
