import { useGetterSection } from "../../../sharedWithServer/stateClassHooks/useGetterSection";

export function PropertyGeneral({ feId }: { feId: string }) {
  const propertyGeneral = useGetterSection({
    sectionName: "propertyGeneral",
    feId,
  });
  const property = propertyGeneral.onlyChild("property");
  return null; // <Property feId={property.feId} />;
}
