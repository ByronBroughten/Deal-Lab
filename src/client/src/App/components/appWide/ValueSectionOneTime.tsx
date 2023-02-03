import { VarbListSingleTime } from "./ListGroup/ListGroupSingleTime/VarbListSingleTime";
import { ValueSectionGeneric } from "./ValueSectionGeneric";

export interface ValueSectionOneTimeProps {
  className?: string;
  feId: string;
  displayName?: string;
  showXBtn?: boolean;
}

export function ValueSectionOneTime(props: ValueSectionOneTimeProps) {
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
