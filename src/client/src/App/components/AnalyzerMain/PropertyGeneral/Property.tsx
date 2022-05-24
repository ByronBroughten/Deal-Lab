import React from "react";
import MainSection from "../../appWide/GeneralSection/MainSection";
import MainSectionBody from "../../appWide/GeneralSection/MainSection/MainSectionBody";
import MainSectionTitleRow from "../../appWide/GeneralSection/MainSection/MainSectionTitleRow";
import ListGroup from "../general/ListGroup";
import BasicPropertyInfo from "./Property/BasicPropertyInfo";

export default function Property({ id }: { id: string }) {
  const sectionName = "property";
  const feInfo = { sectionName, id, idType: "feId" } as const;
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
              <BasicPropertyInfo feInfo={feInfo} className="ListGroup-root" />
              {/* <UnitList feInfo={feInfo} className="ListGroup-root" /> */}
            </div>
          </div>
        </div>
        <ListGroup
          feInfo={feInfo}
          listSectionName="ongoingCostList"
          titleText="Ongoing Costs"
          totalVarbName="ongoingExpenses"
        />
        <ListGroup
          feInfo={feInfo}
          listSectionName="upfrontCostList"
          titleText="Upfront Costs"
          totalVarbName="upfrontExpenses"
        />
      </MainSectionBody>
    </MainSection>
  );
}
