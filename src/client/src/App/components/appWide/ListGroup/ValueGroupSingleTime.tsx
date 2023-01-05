import { ValueSectionOneTime } from "../ValueSectionOneTime";
import { ValueGroupGeneric } from "./ListGroupShared/ValueGroupGeneric";

type Props = {
  feId: string;
  titleText: string;
  className?: string;
  extraValueChildren?: React.ReactNode;
};

export function ValueGroupSingleTime({ feId, ...props }: Props) {
  return (
    <ValueGroupGeneric
      {...{
        ...props,
        valueParentInfo: {
          sectionName: "singleTimeValueGroup",
          feId,
        } as const,
        valueAsChildName: "singleTimeValue",
        totalVarbName: "total",
        makeValueNode: (nodeProps) => <ValueSectionOneTime {...nodeProps} />,
      }}
    />
  );
}
