import { dealModeLabels } from "../../../../../../../sharedWithServer/stateSchemas/schema4ValueTraits/StateValue/unionValues";
import { BasicBrrrrInfo } from "./ViewChunks/BasicBrrrrInfo";
import { PropertyEditorBody } from "./ViewChunks/PropertyEditorBody";
import { PropertyHoldingCosts } from "./ViewChunks/PropertyHoldingCosts";
import { PropertyOngoingCosts } from "./ViewChunks/PropertyOngoingCosts";
import { RehabSection } from "./ViewChunks/PropertyRehab";

export function PropertyBrrrrView({ feId }: { feId: string }) {
  return (
    <PropertyEditorBody
      {...{
        feId,
        sectionTitle: "Property",
        titleAppend: dealModeLabels.brrrr,
      }}
    >
      <BasicBrrrrInfo feId={feId} />
      <PropertyHoldingCosts feId={feId} />
      <RehabSection {...{ feId }} />
      <PropertyOngoingCosts feId={feId} />
    </PropertyEditorBody>
  );
}
