import React from "react";
import UnitList from "./Property/UnitList";
import BasicPropertyInfo from "./Property/BasicPropertyInfo";
import MainSectionBody from "../../appWide/GeneralSection/MainSection/MainSectionBody";
import MainSection from "../../appWide/GeneralSection/MainSection";
import MainSectionTitleRow from "../../appWide/GeneralSection/MainSection/MainSectionTitleRow";
import ListGroup from "../general/ListGroup";

const sectionName = "property";
export default function Property({ id }: { id: string }) {
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
          listSectionName="upfrontCostList"
          titleText="Upfront Costs"
          totalVarbName="upfrontExpenses"
        />
        <ListGroup
          feInfo={feInfo}
          listSectionName="ongoingCostList"
          titleText="Ongoing Costs"
          totalVarbName="ongoingExpenses"
        />
      </MainSectionBody>
    </MainSection>
  );
}
