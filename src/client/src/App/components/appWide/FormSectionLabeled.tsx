import React from "react";
import StandardLabel from "./../general/StandardLabel";
import { FormSection } from "./FormSection";

type Props = {
  className?: string;
  children: React.ReactNode;
  label: React.ReactNode;
};
export function FormSectionLabeled({ className, children, label }: Props) {
  return (
    <FormSection className={`FormSectionLabeled-root ${className ?? ""}`}>
      <div>
        <StandardLabel>{label}</StandardLabel>
        {children}
      </div>
    </FormSection>
  );
}
