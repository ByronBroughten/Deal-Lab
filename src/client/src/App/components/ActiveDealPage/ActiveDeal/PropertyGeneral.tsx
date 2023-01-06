import React from "react";
import { useGetterSection } from "../../../sharedWithServer/stateClassHooks/useGetterSection";
import { Property } from "./PropertyGeneral/Property";

export function PropertyGeneral({ feId }: { feId: string }) {
  const propertyGeneral = useGetterSection({
    sectionName: "propertyGeneral",
    feId,
  });
  const property = propertyGeneral.onlyChild("property");
  return <Property feId={property.feId} />;
}
