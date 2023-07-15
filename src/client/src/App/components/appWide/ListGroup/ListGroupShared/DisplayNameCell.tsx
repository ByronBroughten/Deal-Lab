import React from "react";
import {
  useVariableLabels,
  VarbFinderProps,
  variableNotFoundLabel,
} from "../../../../sharedWithServer/StateGetters/useVariableLabels";
import { nativeTheme } from "../../../../theme/nativeTheme";
import { SectionTitle } from "../../SectionTitle";

export function EntityDisplayNameCell(props: VarbFinderProps) {
  const { variableLabel } = useVariableLabels(props);
  return <DisplayNameCellStyled {...{ displayName: variableLabel }} />;
}

interface StyledProps {
  displayName: string;
}

export function DisplayNameNotFoundCell() {
  return <DisplayNameCellStyled {...{ displayName: variableNotFoundLabel }} />;
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
