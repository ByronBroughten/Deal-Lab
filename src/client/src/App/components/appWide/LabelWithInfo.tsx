import { Box } from "@mui/material";
import React from "react";
import { MuiRow } from "../general/MuiRow";
import { InfoIcon } from "./InfoIcon";

type Props = {
  label: React.ReactNode;
  infoTitle?: React.ReactNode;
  infoText: string;
  className?: string;
};
export function LabelWithInfo({
  className,
  label,
  infoTitle = label,
  infoText,
}: Props) {
  return (
    <MuiRow
      className={className}
      sx={{
        flexWrap: "nowrap",
        zIndex: 10,
      }}
    >
      <Box>{label}</Box>
      <InfoIcon
        {...{
          title: infoTitle,
          infoText,
        }}
      />
    </MuiRow>
  );
}
