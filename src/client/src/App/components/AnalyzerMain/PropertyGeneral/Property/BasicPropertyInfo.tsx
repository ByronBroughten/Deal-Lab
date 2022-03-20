import React from "react";
import NumObjEditor from "../../../inputs/NumObjEditor";
import BasicSectionInfo from "../../../appWide/MainSection/MainSectionEntry/MainEntryBody/BasicSectionInfo";
import {
  FeInfo,
  Inf,
} from "../../../../sharedWithServer/Analyzer/SectionMetas/Info";

type Props = { feInfo: FeInfo; className?: string };
export default function BasicPropertyInfo({ feInfo, className }: Props) {
  const varbInfo = Inf.feVarbMaker(feInfo);
  return (
    <BasicSectionInfo
      {...{
        className: `BasicPropertyInfo-root ${className}`,
        sectionName: "property",
      }}
    >
      <div className="BasicPropertyInfo-viewable viewable">
        <h6 className="title-text">Basic Info</h6>
        <div className="BasicSectionInfo-subSections">
          <div className="BasicSectionInfo-subSection">
            <div className="BasicSectionInfo-subSection-viewable">
              <NumObjEditor feVarbInfo={varbInfo("price")} />
              <NumObjEditor feVarbInfo={varbInfo("taxesYearly")} />
              <NumObjEditor feVarbInfo={varbInfo("homeInsYearly")} />
              <NumObjEditor feVarbInfo={varbInfo("sqft")} />
            </div>
          </div>
        </div>
      </div>
    </BasicSectionInfo>
  );
}
