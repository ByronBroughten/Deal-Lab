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
      <MainSectionTitleRow {...{ feInfo, pluralName: "properties" }} />
      <MainSectionBody>
        <div className="ListGroup-root">
          <div className="ListGroup-viewable">
            {/* <div className="ListGroup-titleRow">
              <h6 className="ListGroup-titleText">Basic Info</h6>
            </div> */}
            <div className="ListGroup-lists">
              <BasicPropertyInfo feId={feId} className="ListGroup-root" />
              {/* <UnitList feInfo={feInfo} className="ListGroup-root" /> */}
            </div>
          </div>
        </div>
        <ListGroupOngoing
          parentInfo={feInfo}
          sectionName="ongoingCostList"
          itemName="ongoingItem"
          totalVarbNameBase="ongoingExpenses"
          titleText="Ongoing Costs"
          themeName="property"
        />
        <ListGroupSingleTime
          parentInfo={feInfo}
          sectionName="upfrontCostList"
          itemName="singleTimeItem"
          totalVarbName="upfrontExpenses"
          titleText="Upfront Costs"
          themeName="property"
        />
      </MainSectionBody>
    </MainSection>
  );
}
