import React from "react";
import styled from "styled-components";
import { useSetterSection } from "../../../../sharedWithServer/StateHooks/useSetterSection";
import theme from "../../../../theme/Theme";
import BasicSectionInfo from "../../../appWide/GeneralSection/MainSection/MainSectionBody/BasicSectionInfo";
import { NumObjEditorNext } from "../../../inputs/NumObjEditorNext";
import { UnitListNext } from "./UnitListNext";

type Props = { feId: string; className?: string };
export default function BasicPropertyInfo({ feId, className }: Props) {
  const property = useSetterSection({ sectionName: "property", feId });
  const varbNames = ["price", "taxesYearly", "homeInsYearly", "sqft"] as const;
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
              {varbNames.map((varbName) => (
                <NumObjEditorNext
                  key={varbName}
                  feVarbInfo={property.varbInfo(varbName)}
                />
              ))}
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
