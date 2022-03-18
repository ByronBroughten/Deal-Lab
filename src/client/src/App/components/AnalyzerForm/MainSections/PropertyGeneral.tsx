import React from "react";
import { useAnalyzerContext } from "../../../modules/usePropertyAnalyzer";
import MainSection from "../../appWide/MainSection";
import MainSectionTitle from "../../appWide/MainSection/MainSectionTitle";
import Property from "./PropertyGeneral/Property";

export default function PropertyGeneral() {
  const { analyzer } = useAnalyzerContext();
  const propertyIds = analyzer.childFeIds(["propertyGeneral", "property"]);
  return (
    <MainSection sectionName="property">
      <MainSectionTitle title="Property" sectionName="property" />
      <div>
        {propertyIds.map((id) => (
          <Property key={id} id={id} />
        ))}
      </div>
    </MainSection>
  );
}
