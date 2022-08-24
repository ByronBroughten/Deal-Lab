import React from "react";
import { useGetterSection } from "../../sharedWithServer/stateClassHooks/useGetterSection";
import MainSection from "../appWide/GeneralSection";
import GeneralSectionTitle from "../appWide/GeneralSection/GeneralSectionTitle";
import Property from "./PropertyGeneral/Property";

export function PropertyGeneral({ feId }: { feId: string }) {
  const propertyGeneral = useGetterSection({
    sectionName: "propertyGeneral",
    feId,
  });
  const propertyIds = propertyGeneral.childFeIds("property");
  return (
    <MainSection themeName="property" className="PropertyGeneral-root">
      <GeneralSectionTitle title="Property" themeName="property" />
      <div className="MainSection-entries">
        {propertyIds.map((feId) => (
          <Property key={feId} feId={feId} />
        ))}
      </div>
    </MainSection>
  );
}
