import { Box } from "@mui/material";
import React from "react";
import { MuiRow } from "../general/MuiRow";
import { IconProps } from "../Icons";
import { InfoIcon } from "./InfoIcon";

type Props = {
  label: React.ReactNode;
  infoProps?: { title: React.ReactNode; info: string };
  iconProps?: IconProps;
  className?: string;
};
export function LabelWithInfo({
  className,
  label,
  infoProps,
  iconProps,
}: Props) {
  return (
    <MuiRow className={className} sx={{ flexWrap: "nowrap" }}>
      <Box>{label}</Box>
      {infoProps && (
        <InfoIcon
          {...{
            iconProps,
            ...infoProps,
          }}
        />
      )}
    </MuiRow>
  );
}
