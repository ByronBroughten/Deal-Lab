import React from "react";
import MainSection from "../../appWide/GeneralSection/MainSection";
import MainSectionBody from "../../appWide/GeneralSection/MainSection/MainSectionBody";
import { MainSectionTitleRow } from "../../appWide/GeneralSection/MainSection/MainSectionTitleRow";
import { ListGroupOngoing } from "../../appWide/ListGroup/ListGroupOngoing";
import { ListGroupSingleTime } from "../../appWide/ListGroup/ListGroupSingleTime";
import BasicPropertyInfo from "./Property/BasicPropertyInfo";

export default function Property({ feId }: { feId: string }) {
  const feInfo = {
    sectionName: "property",
    feId,
  } as const;
  return (
    <MainSection>
      <MainSectionTitleRow {...{ ...feInfo, pluralName: "properties" }} />
      <MainSectionBody themeName="property">
        <div className="ListGroup-lists">
          <BasicPropertyInfo feId={feId} className="ListGroup-root" />
        </div>

        {/* 
          change AddUnit to dark yellow
          change the units to dark yellow
        */}

        <ListGroupOngoing
          listParentInfo={feInfo}
          listAsChildName="ongoingCostList"
          totalVarbNameBase="expenses"
          titleText="Ongoing Costs"
          themeName="property"
        />
        <ListGroupSingleTime
          listParentInfo={feInfo}
          listAsChildName="upfrontCostList"
          totalVarbName="upfrontExpenses"
          titleText="Upfront Costs"
          themeName="property"
        />
      </MainSectionBody>
    </MainSection>
  );
}
