import { ListEditorOneTime } from "../ActiveDealPage/ActiveDeal/ActiveDealSections/PropertyEditor/ValueShared/ListEditorOneTime";
import { ValueSectionGeneric } from "./ValueSectionGeneric";

export interface ValueSectionOneTimeProps {
  className?: string;
  feId: string;
  displayName?: string;
  showXBtn?: boolean;
}
export function OnetimeValue(props: ValueSectionOneTimeProps) {
  return (
    <ValueSectionGeneric
      {...{
        ...props,
        sectionName: "singleTimeValue",
        valueName: "value",
        valueEditorName: "valueEditor",
        makeItemizedListNode: (props) => (
          <ListEditorOneTime
            {...{
              routeBtnProps: {
                title: "Custom Lists",
                routeName: "onetimeListMain",
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
