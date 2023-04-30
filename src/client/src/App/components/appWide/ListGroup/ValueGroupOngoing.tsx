import { VarbName } from "../../../sharedWithServer/SectionsMeta/baseSectionsDerived/baseSectionsVarbsTypes";
import { ParentName } from "../../../sharedWithServer/SectionsMeta/sectionChildrenDerived/ParentName";
import { ChildNameOfType } from "../../../sharedWithServer/SectionsMeta/SectionNameByType";
import { ValueSectionOngoing } from "../OngoingValue";
import { ValueGroupGeneric } from "./ListGroupShared/ValueGroupGeneric";

type Props<
  SN extends ParentName<"ongoingValue">,
  CN extends ChildNameOfType<SN, "ongoingValue">
> = {
  sectionName: SN;
  feId: string;
  valueChildName: CN;
  totalVarbName: VarbName<SN>;
  titleText: string;
  className?: string;
  extraValueChildren?: React.ReactNode;
};

export function ValueGroupOngoing<
  SN extends ParentName<"ongoingValue">,
  CN extends ChildNameOfType<SN, "ongoingValue">
>({
  feId,
  sectionName,
  valueChildName,
  totalVarbName,
  ...props
}: Props<SN, CN>) {
  return (
    <ValueGroupGeneric
      {...{
        ...props,
        valueParentInfo: {
          sectionName,
          feId,
        } as const,
        valueAsChildName: valueChildName,
        totalVarbName,
        makeValueNode: (nodeProps) => <ValueSectionOngoing {...nodeProps} />,
      }}
    />
  );
}
