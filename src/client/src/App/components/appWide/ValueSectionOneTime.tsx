import { VarbListSingleTime } from "./ListGroup/ListGroupSingleTime/VarbListSingleTime";
import { ValueSectionGenericNext } from "./ValueSectionGenericNext";

export interface ValueSectionOneTimeProps {
  className?: string;
  feId: string;
  displayName?: string;
  showXBtn?: boolean;
}

export function ValueSectionOneTime(props: ValueSectionOneTimeProps) {
  return (
    <ValueSectionGenericNext
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
