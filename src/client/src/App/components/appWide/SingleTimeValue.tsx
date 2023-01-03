import { VarbListSingleTime } from "./ListGroup/ListGroupSingleTime/VarbListSingleTime";
import { ValueSectionGeneric } from "./ValueSectionGeneric";

interface Props {
  className?: string;
  feId: string;
  displayName?: string;
}

export function SingleTimeValue(props: Props) {
  return (
    <ValueSectionGeneric
      {...{
        ...props,
        sectionName: "singleTimeValue",
        valueName: "value",
        makeItemizedListNode: (nodeProps) => (
          <VarbListSingleTime {...nodeProps} />
        ),
      }}
    />
  );
}
