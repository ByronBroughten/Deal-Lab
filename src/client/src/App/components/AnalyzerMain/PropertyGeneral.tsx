import React from "react";
import { useAnalyzerContext } from "../../modules/usePropertyAnalyzer";
import MainSection from "../appWide/MainSection";
import GeneralSectionTitle from "../appWide/MainSection/GeneralSectionTitle";
import Property from "./PropertyGeneral/Property";

export default function PropertyGeneral() {
  const { analyzer } = useAnalyzerContext();
  const section = analyzer.section("propertyGeneral");
  const propertyIds = section.childFeIds("property");
  return (
    <MainSection sectionName="property">
      <GeneralSectionTitle title="Property" sectionName="property" />
      <div>
        {propertyIds.map((id) => (
          <Property key={id} id={id} />
        ))}
      </div>
    </MainSection>
  );
}
