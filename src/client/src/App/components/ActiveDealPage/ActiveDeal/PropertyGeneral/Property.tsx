import React from "react";
import { MainSection } from "../../../appWide/GeneralSection/MainSection";
import MainSectionBody from "../../../appWide/GeneralSection/MainSection/MainSectionBody";
import { MainSectionTitleRow } from "../../../appWide/GeneralSection/MainSection/MainSectionTitleRow";
import { ListGroupOngoingZone } from "../general/ListGroupOngoingZone";
import { ListGroupSingleTimeZone } from "../general/ListGroupSingleTimeZone";
import BasicPropertyInfo from "./Property/BasicPropertyInfo";
import { UnitList } from "./Property/UnitList";

export function Property({ feId }: { feId: string }) {
  const feInfo = { sectionName: "property", feId } as const;
  return (
    <MainSection>
      <MainSectionTitleRow
        {...{
          ...feInfo,
          sectionTitle: "Property",
          pluralName: "properties",
          className: "MainSectionGroup",
        }}
      />
      <MainSectionBody themeName="property">
        <div className="ListGroup-lists">
          <BasicPropertyInfo feId={feId} className="MainSectionGroup" />
        </div>
        <UnitList feInfo={feInfo} />
        <ListGroupSingleTimeZone
          {...{
            ...feInfo,
            childName: "upfrontCostListGroup",
            themeName: "property",
            btnText: "+ Upfront Costs",
            titleText: "Upfront Costs",
          }}
        />
        <ListGroupOngoingZone
          {...{
            ...feInfo,
            childName: "ongoingCostListGroup",
            themeName: "property",
            btnText: "+ Ongoing Costs",
            titleText: "Ongoing Costs",
          }}
        />
      </MainSectionBody>
    </MainSection>
  );
}
