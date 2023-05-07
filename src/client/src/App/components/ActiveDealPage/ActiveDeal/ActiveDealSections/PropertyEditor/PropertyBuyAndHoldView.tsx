import { useGetterSection } from "../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { BasicBuyAndHoldInfo } from "./BasicBuyAndHoldInfo";
import { CapExValue } from "./CapExValue";
import { MaintenanceValue } from "./MaintenanceValue";
import { PropertyEditorBody } from "./PropertyEditorBody";
import { RehabSection } from "./RehabSection";
import { Units } from "./Units";
import { UtilityValue } from "./UtilityValue";

export function PropertyBuyAndHoldView({ feId }: { feId: string }) {
  const feInfo = { sectionName: "property", feId } as const;
  const property = useGetterSection(feInfo);
  return (
    <PropertyEditorBody
      {...{ feId, sectionTitle: "Property", titleAppend: "Rental Property" }}
    >
      <BasicBuyAndHoldInfo feId={feId} />
      <Units {...{ feId }} />
      <RehabSection {...{ feId, dealMode: "fixAndFlip" }} />
      <UtilityValue feId={property.onlyChildFeId("utilityValue")} />
      <CapExValue feId={property.onlyChildFeId("capExValue")} />
      <MaintenanceValue feId={property.onlyChildFeId("maintenanceValue")} />
    </PropertyEditorBody>
  );
}
