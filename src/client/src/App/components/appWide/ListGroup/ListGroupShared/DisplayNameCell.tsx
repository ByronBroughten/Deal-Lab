import React from "react";
import { FeSectionInfo } from "../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { useGetterSection } from "../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { ValueInEntityInfo } from "../../../../sharedWithServer/StateEntityGetters/ValueInEntityInfo";
import { nativeTheme } from "../../../../theme/nativeTheme";
import { SectionTitle } from "../../SectionTitle";

interface EntityProps {
  focalInfo: FeSectionInfo;
  varbInfo: ValueInEntityInfo;
}
export function EntityDisplayNameCell({ focalInfo, varbInfo }: EntityProps) {
  const section = useGetterSection(focalInfo);
  const hasVarb = section.hasVarbByFocalMixed(varbInfo);
  if (hasVarb) {
    const varb = section.varbByFocalMixed(varbInfo);
    return <DisplayNameCellStyled {...{ displayName: varb.displayNameFull }} />;
  } else {
    return <DisplayNameNotFoundCell />;
  }
}

interface StyledProps {
  displayName: string;
}

export function DisplayNameNotFoundCell() {
  return <DisplayNameCellStyled {...{ displayName: "Variable not found" }} />;
}

export function DisplayNameCellStyled({ displayName }: StyledProps) {
  return (
    <td className="VarbListTable-nameCell">
      <SectionTitle
        {...{
          text: displayName,
          sx: { fontSize: nativeTheme.inputLabel.fontSize },
        }}
      />
    </td>
  );
}
