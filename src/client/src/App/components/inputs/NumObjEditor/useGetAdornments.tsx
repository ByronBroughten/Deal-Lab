import React from "react";

export type Adornment = React.ReactElement<any, any> | string;
export type Adornments = {
  startAdornment: Adornment;
  endAdornment: Adornment;
};
export type PropAdornments = Partial<Adornments>;

interface GetAdornmentsProps {
  startAdornment: Adornment;
  endAdornment: Adornment;
  editorTextStatus: string;
  displayValue: string;
  doEquals: boolean;
}

export function getEntityEditorAdornments({
  startAdornment,
  endAdornment,
  editorTextStatus,
  displayValue,
  doEquals,
}: GetAdornmentsProps): Adornments {
  if (editorTextStatus === "solvableText" && doEquals) {
    startAdornment = "";
    endAdornment = (
      <span className="NumObjEntityEditor-equalsAdornment">
        <span className="NumObjEntityEditor-equals">=</span>
        {startAdornment}
        {displayValue}
        {endAdornment}
      </span>
    );
  }
  return { startAdornment, endAdornment };
}
