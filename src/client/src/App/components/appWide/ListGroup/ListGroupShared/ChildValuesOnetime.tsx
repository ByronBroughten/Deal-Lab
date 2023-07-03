import { ParentName } from "../../../../sharedWithServer/SectionsMeta/sectionChildrenDerived/ParentName";
import { ChildNameOfType } from "../../../../sharedWithServer/SectionsMeta/SectionNameByType";
import { useAction } from "../../../../sharedWithServer/stateClassHooks/useAction";
import { useGetterSection } from "../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { OnetimeValue } from "../../OnetimeValue";
import { ValueGroupValues } from "./ValueGroupValues";

interface Props<
  SN extends ParentName<"onetimeValue">,
  CN extends ChildNameOfType<SN, "onetimeValue">
> {
  sectionName: SN;
  feId: string;
  valueChildName: CN;
}
export function ChildValuesOnetime<
  SN extends ParentName<"onetimeValue">,
  CN extends ChildNameOfType<SN, "onetimeValue">
>({ valueChildName, ...feInfo }: Props<SN, CN>) {
  const parent = useGetterSection(feInfo);
  const addChild = useAction("addChild");
  return (
    <ValueGroupValues
      {...{
        feIds: parent.childFeIds(valueChildName),
        makeValueNode: (nodeProps) => <OnetimeValue {...nodeProps} />,
        addValue: () =>
          addChild({
            feInfo,
            childName: valueChildName,
          }),
      }}
    />
  );
}
