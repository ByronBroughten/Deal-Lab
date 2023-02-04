import React from "react";
import { FormSectionLabeled } from "./FormSectionLabeled";
import {
  SelectAndItemizeEditor,
  SelectAndItemizeEditorProps,
} from "./SelectAndItemizeEditor";

interface Props extends SelectAndItemizeEditorProps {
  label: React.ReactNode;
}

export function SelectAndItemizeEditorSection({
  className,
  label,
  ...rest
}: Props) {
  return (
    <FormSectionLabeled
      className={`SelectAndItemizeEditorSection ${className ?? ""}`}
      label={label}
    >
      <SelectAndItemizeEditor {...rest} />
    </FormSectionLabeled>
  );
}
