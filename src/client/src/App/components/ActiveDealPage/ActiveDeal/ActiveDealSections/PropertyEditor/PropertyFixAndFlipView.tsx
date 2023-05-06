import { BasicFixAndFlipInfo } from "./BasicFixAndFlipInfo";
import { PropertyEditorBody } from "./PropertyEditorBody";
import { PropertyHoldingCosts } from "./PropertyHoldingCosts";
import { RehabSection } from "./RehabSection";

export function PropertyFixAndFlipView({ feId }: { feId: string }) {
  return (
    <PropertyEditorBody
      {...{ feId, sectionTitle: "Property", titleAppend: "Fix & Flip" }}
    >
      <BasicFixAndFlipInfo {...{ feId }} />
      <PropertyHoldingCosts {...{ feId }} />
      <RehabSection {...{ feId, dealMode: "fixAndFlip" }} />
    </PropertyEditorBody>
  );
}
