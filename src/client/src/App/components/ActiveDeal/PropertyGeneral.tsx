import React from "react";
import styled from "styled-components";
import { useGetterSection } from "../../sharedWithServer/stateClassHooks/useGetterSection";
import { GeneralSection } from "../appWide/GeneralSection";
import GeneralSectionTitle from "../appWide/GeneralSection/GeneralSectionTitle";
import theme from "./../../theme/Theme";
import { Property } from "./PropertyGeneral/Property";

export function PropertyGeneral({ feId }: { feId: string }) {
  const propertyGeneral = useGetterSection({
    sectionName: "propertyGeneral",
    feId,
  });
  const propertyIds = propertyGeneral.childFeIds("property");
  return (
    <Styled themeName="property" className="PropertyGeneral-root">
      <GeneralSectionTitle title="Property" themeName="property" />
      <div className="MainSection-entries">
        {propertyIds.map((feId) => (
          <Property key={feId} feId={feId} />
        ))}
      </div>
    </Styled>
  );
}

const Styled = styled(GeneralSection)`
  .GeneralSectionTitle-root {
    padding-top: ${theme.s2};
  }
`;
