import { dealModeLabels } from "../../../../../sharedWithServer/SectionsMeta/values/StateValue/unionValues";
import { BasicHomeBuyerInfo } from "./ViewChunks/BasicHomeBuyerInfo";
import { PropertyEditorBody } from "./ViewChunks/PropertyEditorBody";
import { PropertyOngoingCosts } from "./ViewChunks/PropertyOngoingCosts";
import { RehabSection } from "./ViewChunks/PropertyRehab";

export function PropertyHomeBuyerView({ feId }: { feId: string }) {
  return (
    <PropertyEditorBody
      {...{
        feId,
        sectionTitle: "Property",
        titleAppend: dealModeLabels.homeBuyer,
      }}
    >
      <BasicHomeBuyerInfo feId={feId} />
      <PropertyOngoingCosts feId={feId} />
      <RehabSection {...{ feId, dealMode: "homeBuyer" }} />
    </PropertyEditorBody>
  );
}
