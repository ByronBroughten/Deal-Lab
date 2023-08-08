import { Box, SxProps } from "@mui/material";
import React from "react";
import { arrSx } from "../../utils/mui";
import { MuiRow } from "../general/MuiRow";
import { IconProps } from "../Icons";
import { InfoIcon } from "./InfoIcon";

type Props = {
  label: React.ReactNode;
  id?: string;
  infoProps?: { title: React.ReactNode; info: string; moreInfoLink?: string };
  iconProps?: IconProps;
  sx?: SxProps;
  className?: string;
};
export function LabelWithInfo({
  className,
  id,
  label,
  infoProps,
  iconProps,
  sx,
}: Props) {
  return (
    <MuiRow className={className} sx={[{ flexWrap: "nowrap" }, ...arrSx(sx)]}>
      <Box component={"label"} id={id}>
        {label}
      </Box>
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
