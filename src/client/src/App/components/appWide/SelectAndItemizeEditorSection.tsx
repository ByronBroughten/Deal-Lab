import React from "react";
import { FormSectionLabeled } from "./FormSectionLabeled";
import {
  SelectAndItemizeEditor,
  SelectAndItemizeEditorProps,
} from "./SelectAndItemizeEditor";

interface Props extends SelectAndItemizeEditorProps {
  label: string;
}

export function SelectAndItemizeEditorSection({ label, ...rest }: Props) {
  return (
    <FormSectionLabeled label={label}>
      <SelectAndItemizeEditor {...rest} />
    </FormSectionLabeled>
  );
}
