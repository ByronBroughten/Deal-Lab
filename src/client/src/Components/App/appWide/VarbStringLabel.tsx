import { SxProps } from "@mui/material";
import React from "react";
import {
  getVarbLabels,
  VarbInfoTextProps,
} from "../../../modules/varbLabels/varbLabels";
import { SectionVarbNames } from "../../../sharedWithServer/StateGetters/Identifiers/FeInfo";
import { SectionName } from "../../../sharedWithServer/stateSchemas/schema2SectionNames";
import { IconProps } from "../Icons";
import { LabelWithInfo } from "./LabelWithInfo";

export interface Props<SN extends SectionName>
  extends Partial<VarbInfoTextProps> {
  names: SectionVarbNames<SN>;
  iconProps?: IconProps;
  label?: React.ReactNode;
  id?: string;
  sx?: SxProps;
}

export function VarbStringLabel<SN extends SectionName>({
  names,
  iconProps,
  label,
  ...rest
}: Props<SN>) {
  const labels = getVarbLabels(names.sectionName, names.varbName);
  if (!label) {
    const { inputLabel } = labels;
    if (typeof inputLabel !== "string") {
      throw new Error("This is not a string label varb.");
    }
  }

  const { title, info, moreInfoLink } = labels;
  return (
    <LabelWithInfo
      {...{
        iconProps,
        label: label || labels.inputLabel,
        ...(title && info && { infoProps: { title, info, moreInfoLink } }),
        ...rest,
      }}
    />
  );
}
