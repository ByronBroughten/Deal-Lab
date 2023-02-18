import { ListEditorSingleTime } from "../ActiveDealPage/ActiveDeal/PropertyGeneral/Property/ValueShared.tsx/ListEditorSingleTime";
import { ValueSectionGeneric } from "./ValueSectionGeneric";

export interface ValueSectionOneTimeProps {
  className?: string;
  feId: string;
  displayName?: string;
  showXBtn?: boolean;
}

export function ValueSectionSingleTime(props: ValueSectionOneTimeProps) {
  return (
    <ValueSectionGeneric
      {...{
        ...props,
        sectionName: "singleTimeValue",
        valueName: "value",
        makeItemizedListNode: (props) => (
          <ListEditorSingleTime
            {...{
              menuType: "value",
              ...props,
            }}
          />
        ),
      }}
    />
  );
}
