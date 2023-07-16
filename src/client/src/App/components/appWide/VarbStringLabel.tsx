import React from "react";
import { getVarbLabels, VarbInfoTextProps } from "../../../varbLabels";
import { SectionVarbNames } from "../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { SectionName } from "../../sharedWithServer/SectionsMeta/SectionName";
import { IconProps } from "../Icons";
import { LabelWithInfo } from "./LabelWithInfo";

export interface Props<SN extends SectionName>
  extends Partial<VarbInfoTextProps> {
  names: SectionVarbNames<SN>;
  iconProps?: IconProps;
  label?: React.ReactNode;
}

export function VarbStringLabel<SN extends SectionName>({
  names,
  iconProps,
  label,
}: Props<SN>) {
  const labels = getVarbLabels(names.sectionName, names.varbName);
  if (!label) {
    const { inputLabel } = labels;
    if (typeof inputLabel !== "string") {
      throw new Error("This is not a string label varb.");
    }
  }

  const { title, info } = labels;
  return (
    <LabelWithInfo
      {...{
        iconProps,
        label: label || labels.inputLabel,
        ...(title && info && { infoProps: { title, info } }),
      }}
    />
  );
}
