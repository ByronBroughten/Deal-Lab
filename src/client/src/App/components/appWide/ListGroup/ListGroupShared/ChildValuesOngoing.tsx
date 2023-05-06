import { ParentName } from "../../../../sharedWithServer/SectionsMeta/sectionChildrenDerived/ParentName";
import { ChildNameOfType } from "../../../../sharedWithServer/SectionsMeta/SectionNameByType";
import { useAction } from "../../../../sharedWithServer/stateClassHooks/useAction";
import { useGetterSection } from "../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { ValueSectionOngoing } from "../../OngoingValue";
import { ValueGroupValues } from "./ValueGroupValues";

interface Props<
  SN extends ParentName<"ongoingValue">,
  CN extends ChildNameOfType<SN, "ongoingValue">
> {
  sectionName: SN;
  feId: string;
  childName: CN;
}
export function ChildValuesOngoing<
  SN extends ParentName<"ongoingValue">,
  CN extends ChildNameOfType<SN, "ongoingValue">
>({ childName, ...rest }: Props<SN, CN>) {
  const parent = useGetterSection(rest);
  const addChild = useAction("addChild");
  return (
    <ValueGroupValues
      {...{
        feIds: parent.childFeIds(childName),
        makeValueNode: (nodeProps) => <ValueSectionOngoing {...nodeProps} />,
        addValue: () =>
          addChild({
            feInfo: rest,
            childName,
          }),
      }}
    />
  );
}
