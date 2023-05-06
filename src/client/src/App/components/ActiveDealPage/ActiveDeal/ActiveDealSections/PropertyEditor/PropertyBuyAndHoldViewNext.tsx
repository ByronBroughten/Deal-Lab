import { BasicBuyAndHoldInfoNext } from "./BasicBuyAndHoldInfoNext";
import { PropertyEditorBody } from "./PropertyEditorBody";
import { PropertyOngoingCosts } from "./PropertyOngoingCosts";
import { RehabSection } from "./RehabSection";

export function PropertyBuyAndHoldViewNext({ feId }: { feId: string }) {
  return (
    <PropertyEditorBody
      {...{ feId, sectionTitle: "Property", titleAppend: "Rental Property" }}
    >
      <BasicBuyAndHoldInfoNext feId={feId} />
      <PropertyOngoingCosts feId={feId} />
      <RehabSection {...{ feId, dealMode: "fixAndFlip" }} />
    </PropertyEditorBody>
  );
}
