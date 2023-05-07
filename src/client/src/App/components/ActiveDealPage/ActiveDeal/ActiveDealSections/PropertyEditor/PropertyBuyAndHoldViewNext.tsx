import { BasicBuyAndHoldInfoNext } from "./ViewChunks/BasicBuyAndHoldInfoNext";
import { PropertyEditorBody } from "./ViewChunks/PropertyEditorBody";
import { PropertyOngoingCosts } from "./ViewChunks/PropertyOngoingCosts";
import { RehabSection } from "./ViewChunks/PropertyRehab";

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
