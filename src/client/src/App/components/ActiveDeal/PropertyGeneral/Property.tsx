import React from "react";
import { MainSection } from "../../appWide/GeneralSection/MainSection";
import MainSectionBody from "../../appWide/GeneralSection/MainSection/MainSectionBody";
import { MainSectionTitleRow } from "../../appWide/GeneralSection/MainSection/MainSectionTitleRow";
import { ListGroupOngoingZone } from "../general/ListGroupOngoingZone";
import { ListGroupSingleTimeZone } from "../general/ListGroupSingleTimeZone";
import BasicPropertyInfo from "./Property/BasicPropertyInfo";

export function Property({ feId }: { feId: string }) {
  const feInfo = { sectionName: "property", feId } as const;
  return (
    <MainSection>
      <MainSectionTitleRow {...{ ...feInfo, pluralName: "properties" }} />
      <MainSectionBody themeName="property">
        <div className="ListGroup-lists">
          <BasicPropertyInfo feId={feId} className="ListGroup-root" />
        </div>
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
