import { Box } from "@mui/material";
import React from "react";
import { MuiRow } from "../general/MuiRow";
import { IconProps } from "../Icons";
import { InfoIcon } from "./InfoIcon";

type Props = {
  label: React.ReactNode;
  infoTitle?: React.ReactNode;
  iconProps?: IconProps;
  infoText: string;
  className?: string;
};
export function LabelWithInfo({
  className,
  label,
  infoTitle = label,
  infoText,
  iconProps,
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
          iconProps,
          title: infoTitle,
          infoText,
        }}
      />
    </MuiRow>
  );
}
