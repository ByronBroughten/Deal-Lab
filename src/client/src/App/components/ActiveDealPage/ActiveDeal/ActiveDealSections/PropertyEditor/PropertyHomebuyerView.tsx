import { dealModeLabels } from "../../../../../../sharedWithServer/stateSchemas/StateValue/unionValues";
import { BasicHomebuyerInfo } from "./ViewChunks/BasicHomebuyerInfo";
import { PropertyEditorBody } from "./ViewChunks/PropertyEditorBody";
import { PropertyOngoingCosts } from "./ViewChunks/PropertyOngoingCosts";
import { RehabSection } from "./ViewChunks/PropertyRehab";

export function PropertyHomebuyerView({ feId }: { feId: string }) {
  return (
    <PropertyEditorBody
      {...{
        feId,
        sectionTitle: "Property",
        titleAppend: dealModeLabels.homeBuyer,
      }}
    >
      <BasicHomebuyerInfo feId={feId} />
      <PropertyOngoingCosts feId={feId} />
      <RehabSection {...{ feId }} />
    </PropertyEditorBody>
  );
}
