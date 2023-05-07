import { VarbName } from "../../../sharedWithServer/SectionsMeta/baseSectionsDerived/baseSectionsVarbsTypes";
import { ParentName } from "../../../sharedWithServer/SectionsMeta/sectionChildrenDerived/ParentName";
import { ChildNameOfType } from "../../../sharedWithServer/SectionsMeta/SectionNameByType";
import { OnetimeValue } from "../OnetimeValue";
import { ValueGroupGeneric } from "./ListGroupShared/ValueGroupGeneric";

interface Props<
  SN extends ParentName<"singleTimeValue">,
  CN extends ChildNameOfType<SN, "singleTimeValue">
> {
  sectionName: SN;
  feId: string;
  valueChildName: CN;
  totalVarbName: VarbName<SN>;
  titleText: string;
  className?: string;
  extraValueChildren?: React.ReactNode;
}

export function ValueGroupOneTime<
  SN extends ParentName<"singleTimeValue">,
  CN extends ChildNameOfType<SN, "singleTimeValue">
>({
  sectionName,
  feId,
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
        makeValueNode: (nodeProps) => <OnetimeValue {...nodeProps} />,
      }}
    />
  );
}
