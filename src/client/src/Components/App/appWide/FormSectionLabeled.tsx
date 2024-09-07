import { Box } from "@mui/material";
import React from "react";
import ChunkTitle from "../../general/ChunkTitle";
import { FormSection } from "./FormSection";

type Props = {
  className?: string;
  children: React.ReactNode;
  label: React.ReactNode;
};
export function FormSectionLabeled({ className, children, label }: Props) {
  return (
    <FormSection className={className}>
      <Box>
        <ChunkTitle>{label}</ChunkTitle>
        {children}
      </Box>
    </FormSection>
  );
}
