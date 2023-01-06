import React from "react";
import styled from "styled-components";
import { useSetterSection } from "../../../../../sharedWithServer/stateClassHooks/useSetterSection";
import theme from "../../../../../theme/Theme";
import useHowMany from "../../../../appWide/customHooks/useHowMany";
import BasicSectionInfo from "../../../../appWide/GeneralSection/MainSection/MainSectionBody/BasicSectionInfo";
import { NumObjEntityEditor } from "../../../../inputs/NumObjEntityEditor";

type Props = { feId: string; className?: string };
export default function BasicPropertyInfo({ feId, className }: Props) {
  const property = useSetterSection({ sectionName: "property", feId });
  const varbNames = ["price", "taxesYearly", "homeInsYearly", "sqft"] as const;
  const unitIds = property.childFeIds("unit");
  const { areMultiple: isMultiFamily } = useHowMany(unitIds);
  return (
    <Styled
      {...{
        className: `BasicPropertyInfo-root ${className}`,
        sectionName: "property",
      }}
    >
      <div>
        {varbNames.map((varbName, idx) => (
          <NumObjEntityEditor
            key={varbName}
            className={`BasicPropertyInfo-numObjEditor ${
              idx !== 0 && "BasicPropertyInfo-marginEditor"
            }`}
            feVarbInfo={property.varbInfo(varbName)}
          />
        ))}
      </div>
    </Styled>
  );
}

const Styled = styled(BasicSectionInfo)`
  .BasicPropertyInfo-marginEditor {
    margin-top: ${theme.s25};
  }
  .MuiFormControl-root.labeled {
    min-width: 127px;
  }
`;
