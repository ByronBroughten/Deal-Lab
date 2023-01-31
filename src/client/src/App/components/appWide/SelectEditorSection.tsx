import React from "react";
import { FormSectionLabeled } from "./FormSectionLabeled";
import { SelectEditor, SelectEditorProps } from "./SelectEditor";

export interface SelectEditorSectionProps extends SelectEditorProps {
  label: string;
}
export function SelectEditorSection({
  label,
  ...rest
}: SelectEditorSectionProps) {
  return (
    <FormSectionLabeled label={label}>
      <SelectEditor {...rest} />
    </FormSectionLabeled>
  );
}
