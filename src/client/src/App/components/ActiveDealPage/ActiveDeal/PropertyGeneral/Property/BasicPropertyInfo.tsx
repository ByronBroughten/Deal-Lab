import React from "react";
import styled from "styled-components";
import { useSetterSection } from "../../../../../sharedWithServer/stateClassHooks/useSetterSection";
import theme from "../../../../../theme/Theme";
import { FormSection } from "../../../../appWide/FormSection";
import StandardLabel from "../../../../general/StandardLabel";
import { NumObjEntityEditor } from "../../../../inputs/NumObjEntityEditor";

type Props = { feId: string; className?: string };
export default function BasicPropertyInfo({ feId, className }: Props) {
  const property = useSetterSection({ sectionName: "property", feId });
  const varbNames = [
    "price",
    "taxesOngoingEditor",
    "homeInsOngoingEditor",
    "sqft",
  ] as const;
  return (
    <Styled
      {...{
        className: `BasicPropertyInfo-root ${className}`,
        sectionName: "property",
      }}
    >
      <div>
        <StandardLabel>Basic Info</StandardLabel>
        <div className="BasicPropertyInfo-editors">
          {varbNames.map((varbName, idx) => (
            <NumObjEntityEditor
              key={varbName}
              className={`BasicPropertyInfo-numObjEditor ${
                idx == 0 && "BasicPropertyInfo-marginEditor"
              }`}
              feVarbInfo={property.varbInfo(varbName)}
            />
          ))}
        </div>
      </div>
    </Styled>
  );
}

const Styled = styled(FormSection)`
  padding-bottom: ${theme.s1};
  .BasicPropertyInfo-editors {
    display: flex;
    flex-wrap: wrap;
    margin-top: ${theme.s25};
  }
  .BasicPropertyInfo-numObjEditor {
    margin: ${theme.s3};
    margin-left: 0;
    margin-right: ${theme.s4};
  }
  .MuiFormControl-root.labeled {
    min-width: 127px;
  }
`;
