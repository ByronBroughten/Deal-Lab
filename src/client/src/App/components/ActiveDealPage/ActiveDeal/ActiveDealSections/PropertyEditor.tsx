import React from "react";
import { FeIdProp } from "../../../../sharedWithServer/SectionsMeta/SectionInfo/NanoIdInfo";
import { StateValue } from "../../../../sharedWithServer/SectionsMeta/values/StateValue";
import { useGetterSection } from "../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { PropertyBrrrrView } from "./PropertyEditor/PropertyBrrrrView";
import { PropertyBuyAndHoldView } from "./PropertyEditor/PropertyBuyAndHoldView";
import { PropertyFixAndFlipView } from "./PropertyEditor/PropertyFixAndFlipView";
import { PropertyHomebuyerView } from "./PropertyEditor/PropertyHomebuyerView";

const propertiesByType: Record<
  StateValue<"dealMode">,
  (props: FeIdProp) => React.ReactElement
> = {
  homeBuyer: (props) => <PropertyHomebuyerView {...props} />,
  buyAndHold: (props) => <PropertyBuyAndHoldView {...props} />,
  fixAndFlip: (props) => <PropertyFixAndFlipView {...props} />,
  brrrr: (props) => <PropertyBrrrrView {...props} />,
};

interface Props extends FeIdProp {
  propertyMode?: StateValue<"dealMode">;
}
export function PropertyEditor({ feId, propertyMode }: Props) {
  const property = useGetterSection({ sectionName: "property", feId });
  const mode = propertyMode ?? property.valueNext("propertyMode");
  return propertiesByType[mode]({ feId });
}
