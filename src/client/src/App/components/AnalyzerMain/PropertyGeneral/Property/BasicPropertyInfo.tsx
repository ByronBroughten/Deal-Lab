import React from "react";
import styled from "styled-components";
import { FeInfo, InfoS } from "../../../../sharedWithServer/SectionsMeta/Info";
import { useSetterSection } from "../../../../sharedWithServer/StateSetters/SetterSection";
import theme from "../../../../theme/Theme";
import BasicSectionInfo from "../../../appWide/GeneralSection/MainSection/MainSectionBody/BasicSectionInfo";
import NumObjEditor from "../../../inputs/NumObjEditor";
import { NumObjEditorNext } from "../../../inputs/NumObjEditorNext";
import { UnitListNext } from "./UnitListNext";

type Props = { feId: string; feInfo: FeInfo; className?: string };
export default function BasicPropertyInfo({ feId, feInfo, className }: Props) {
  const property = useSetterSection({ sectionName: "property", feId });
  const varbInfo = InfoS.feVarbMaker(feInfo);
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
              <NumObjEditorNext feVarbInfo={property.varbInfo("price")} />
              <NumObjEditor feVarbInfo={varbInfo("taxesYearly")} />
              <NumObjEditor feVarbInfo={varbInfo("homeInsYearly")} />
              <NumObjEditor feVarbInfo={varbInfo("sqft")} />
            </div>
          </div>
        </div>
        <UnitListNext feInfo={property.feSectionInfo} />
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
