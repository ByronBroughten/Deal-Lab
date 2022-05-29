import React from "react";
import { useSectionsContext } from "../../../modules/useSections";
import MainSection from "../../appWide/GeneralSection/MainSection";
import MainSectionBody from "../../appWide/GeneralSection/MainSection/MainSectionBody";
import { MainSectionTitleRowNext } from "../../appWide/GeneralSection/MainSection/MainSectionTitleRowNext";
import ListGroup from "../general/ListGroup";
import BasicPropertyInfo from "./Property/BasicPropertyInfo";

export default function Property({ id }: { id: string }) {
  const sectionName = "property";
  const feInfo = { sectionName, id, idType: "feId" } as const;

  const { sections } = useSectionsContext();
  const { feId } = sections.rawSectionList("property")[0];
  const feSectionInfo = {
    sectionName,
    feId,
  } as const;

  // This is tricky.

  return (
    <MainSection>
      <MainSectionTitleRowNext
        {...{ feInfo, feSectionInfo, pluralName: "properties" }}
      />
      <MainSectionBody>
        <div className="ListGroup-root">
          <div className="ListGroup-viewable">
            {/* <div className="ListGroup-titleRow">
              <h6 className="ListGroup-titleText">Basic Info</h6>
            </div> */}
            <div className="ListGroup-lists">
              <BasicPropertyInfo
                feId={feId}
                feInfo={feInfo}
                className="ListGroup-root"
              />
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
