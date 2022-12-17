import React from "react";
import styled from "styled-components";
import { useGetterSection } from "../../../sharedWithServer/stateClassHooks/useGetterSection";
import { GeneralSection } from "../../appWide/GeneralSection";
import { Property } from "./PropertyGeneral/Property";

export function PropertyGeneral({ feId }: { feId: string }) {
  const propertyGeneral = useGetterSection({
    sectionName: "propertyGeneral",
    feId,
  });
  const propertyIds = propertyGeneral.childFeIds("property");
  return (
    <Styled
      {...{
        themeName: "property",
        className: "PropertyGeneral-root",
        mainSectionIds: propertyIds,
        makeMainSectionEntries: {
          ids: propertyGeneral.childFeIds("property"),
          make: ({ feId }) => <Property key={feId} feId={feId} />,
        },
      }}
    ></Styled>
  );
}

const Styled = styled(GeneralSection)``;
