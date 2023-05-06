import React from "react";
import { FeIdProp } from "../../../../sharedWithServer/SectionsMeta/SectionInfo/NanoIdInfo";
import { StateValue } from "../../../../sharedWithServer/SectionsMeta/values/StateValue";
import { useGetterSection } from "../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { PropertyBuyAndHoldViewNext } from "./PropertyEditor/PropertyBuyAndHoldViewNext";
import { PropertyFixAndFlipView } from "./PropertyEditor/PropertyFixAndFlipView";

const propertiesByType: Record<
  StateValue<"dealMode">,
  (props: FeIdProp) => React.ReactElement
> = {
  buyAndHold: (props) => <PropertyBuyAndHoldViewNext {...props} />,
  fixAndFlip: (props) => <PropertyFixAndFlipView {...props} />,
};

export function PropertyEditor({ feId }: FeIdProp) {
  const property = useGetterSection({ sectionName: "property", feId });
  const mode = property.valueNext("propertyMode");
  return propertiesByType[mode]({ feId });
}
