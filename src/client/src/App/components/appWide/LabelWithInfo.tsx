import { Box } from "@mui/material";
import React from "react";
import { MuiRow } from "../general/MuiRow";
import { IconProps } from "../Icons";
import { InfoIcon } from "./InfoIcon";

type Props = {
  label: React.ReactNode;
  infoTitle?: React.ReactNode;
  infoText?: string;
  iconProps?: IconProps;
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
    <MuiRow className={className} sx={{ flexWrap: "nowrap" }}>
      <Box>{label}</Box>
      {infoTitle && infoText && (
        <InfoIcon
          {...{
            iconProps,
            title: infoTitle,
            infoText,
          }}
        />
      )}
    </MuiRow>
  );
}
