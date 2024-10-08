import React from "react";
import { useGetterSection } from "../../../../../../modules/stateHooks/useGetterSection";
import { FeIdProp } from "../../../../../../sharedWithServer/StateGetters/Identifiers/NanoIdInfo";
import { StateValue } from "../../../../../../sharedWithServer/stateSchemas/schema4ValueTraits/StateValue";
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

interface Props extends FeIdProp {}
export function PropertyEditor({ feId }: Props) {
  const property = useGetterSection({ sectionName: "property", feId });
  const mode = property.valueNext("propertyMode");
  return propertiesByType[mode]({ feId });
}
