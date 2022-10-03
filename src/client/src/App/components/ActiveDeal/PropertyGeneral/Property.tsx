import React from "react";
import { useGetterSection } from "../../../sharedWithServer/stateClassHooks/useGetterSection";
import { MainSection } from "../../appWide/GeneralSection/MainSection";
import MainSectionBody from "../../appWide/GeneralSection/MainSection/MainSectionBody";
import { MainSectionTitleRow } from "../../appWide/GeneralSection/MainSection/MainSectionTitleRow";
import { ListGroupOngoing } from "../../appWide/ListGroup/ListGroupOngoing";
import { ListGroupSingleTime } from "../../appWide/ListGroup/ListGroupSingleTime";
import BasicPropertyInfo from "./Property/BasicPropertyInfo";

export default function Property({ feId }: { feId: string }) {
  const property = useGetterSection({
    sectionName: "property",
    feId,
  });
  return (
    <MainSection>
      <MainSectionTitleRow
        {...{ ...property.feInfo, pluralName: "properties" }}
      />
      <MainSectionBody themeName="property">
        <div className="ListGroup-lists">
          <BasicPropertyInfo feId={feId} className="ListGroup-root" />
        </div>
        <ListGroupSingleTime
          feId={property.onlyChild("upfrontCostListGroup").feId}
          titleText="Upfront Costs"
          themeName="property"
        />
        <ListGroupOngoing
          feId={property.onlyChild("ongoingCostListGroup").feId}
          titleText="Ongoing Costs"
          themeName="property"
        />
      </MainSectionBody>
    </MainSection>
  );
}
