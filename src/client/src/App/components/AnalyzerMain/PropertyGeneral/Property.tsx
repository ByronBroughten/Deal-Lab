import React from "react";
import MainSection from "../../appWide/GeneralSection/MainSection";
import MainSectionBody from "../../appWide/GeneralSection/MainSection/MainSectionBody";
import { MainSectionTitleRowNext } from "../../appWide/GeneralSection/MainSection/MainSectionTitleRowNext";
import { ListGroupNext } from "../general/ListGroupNext";
import BasicPropertyInfo from "./Property/BasicPropertyInfo";

export default function Property({ feId }: { feId: string }) {
  const feInfo = {
    sectionName: "property",
    feId,
  } as const;
  return (
    <MainSection>
      <MainSectionTitleRowNext {...{ feInfo, pluralName: "properties" }} />
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
        <ListGroupNext
          feInfo={feInfo}
          listSectionName="ongoingCostList"
          titleText="Ongoing Costs"
          totalVarbName="ongoingExpenses"
        />
        <ListGroupNext
          feInfo={feInfo}
          listSectionName="upfrontCostList"
          titleText="Upfront Costs"
          totalVarbName="upfrontExpenses"
        />
      </MainSectionBody>
    </MainSection>
  );
}
