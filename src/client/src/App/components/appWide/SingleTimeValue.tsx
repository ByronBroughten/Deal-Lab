import { ListEditorSingleTime } from "../ActiveDealPage/ActiveDeal/PropertyGeneral/Property/ValueShared.tsx/ListEditorSingleTime";
import { ValueSectionGeneric } from "./ValueSectionGeneric";

export interface ValueSectionOneTimeProps {
  className?: string;
  feId: string;
  displayName?: string;
  showXBtn?: boolean;
}
export function SingleTimeValue(props: ValueSectionOneTimeProps) {
  return (
    <ValueSectionGeneric
      {...{
        ...props,
        sectionName: "singleTimeValue",
        valueName: "value",
        valueEditorName: "valueEditor",
        makeItemizedListNode: (props) => (
          <ListEditorSingleTime
            {...{
              routeBtnProps: {
                title: "Custom Lists",
                routeName: "singleTimeListMain",
              },
              menuType: "value",
              ...props,
            }}
          />
        ),
      }}
    />
  );
}
