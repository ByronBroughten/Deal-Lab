import React from "react";
import NumObjEditor from "../../../inputs/NumObjEditor";
import BasicSectionInfo from "../../../appWide/GeneralSection/MainSection/MainSectionBody/BasicSectionInfo";
import {
  FeInfo,
  Inf,
} from "../../../../sharedWithServer/Analyzer/SectionMetas/Info";
import UnitList from "./UnitList";
import styled from "styled-components";
import theme from "../../../../theme/Theme";

type Props = { feInfo: FeInfo; className?: string };
export default function BasicPropertyInfo({ feInfo, className }: Props) {
  const varbInfo = Inf.feVarbMaker(feInfo);
  return (
    <Styled
      {...{
        className: `BasicPropertyInfo-root ${className}`,
        sectionName: "property",
      }}
    >
      <div className="BasicSectionInfo-viewable viewable">
        {/* <h6 className="title-text">Basic Info</h6> */}
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
        <UnitList feInfo={feInfo as any} />
      </div>
    </Styled>
  );
}

const Styled = styled(BasicSectionInfo)`
  .UnitList-root {
    margin-left: ${theme.s3};
  }
  .MuiFormControl-root.labeled {
    min-width: 127px;
  }
`;
