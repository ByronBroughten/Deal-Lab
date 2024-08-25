import { Box, SxProps } from "@mui/material";
import React from "react";
import { FeVarbInfo } from "../../../sharedWithServer/StateGetters/Identifiers/FeInfo";
import { VarbNames } from "../../../sharedWithServer/StateGetters/Identifiers/VarbInfoBase";
import { getVarbLabels } from "../../../varbLabels/varbLabels";
import { useGetterSections } from "../../stateClassHooks/useGetterSections";
import { useGetterVarb } from "../../stateClassHooks/useGetterVarb";
import { nativeTheme } from "../../theme/nativeTheme";
import { arrSx } from "../../utils/mui";
import { MuiRow } from "../general/MuiRow";
import { InfoIcon } from "./InfoIcon";

export type LabeledVarbFinder = FeVarbInfo | FeVarbInfo<any>[];

export interface LabeledVarbProps extends LabeledVarbNotFoundProps {
  finder: FeVarbInfo | FeVarbInfo[];
  sx?: SxProps;
}
export function LabeledVarbNext({ finder, ...rest }: LabeledVarbProps) {
  if (!Array.isArray(finder)) {
    finder = [finder];
  }

  if (finder.length === 0) {
    throw new Error("finder is empty");
  }

  const mainFinder = finder[0];
  const varb = useGetterVarb(mainFinder);
  const { inputLabel } = varb;

  let toDisplay = "";
  const sections = useGetterSections();
  for (let i = 0; i < finder.length; i++) {
    const varb = sections.varb(finder[i]);
    if (i > 0) {
      toDisplay += " | ";
    }
    toDisplay += varb.displayVarb();
  }

  return (
    <StyledLabeledVarb
      {...{
        labelText: (
          <LabelText
            {...{
              label: inputLabel,
              ...mainFinder,
            }}
          />
        ),
        displayVarb: toDisplay,
        labelId: inputLabel,
        ...rest,
      }}
    />
  );
}

export function LabelText({
  label,
  ...rest
}: VarbNames<any> & { label: React.ReactNode }) {
  return (
    <MuiRow sx={{ flexWrap: "nowrap" }}>
      {label}
      <InfoIconIfExists {...rest} />
    </MuiRow>
  );
}

export function InfoIconIfExists({ sectionName, varbName }: VarbNames<any>) {
  const { info, title, moreInfoLink } = getVarbLabels(sectionName, varbName);
  if (info && title) {
    return (
      <InfoIcon
        {...{
          info,
          title,
          moreInfoLink,
        }}
      />
    );
  } else {
    return null;
  }
}

interface LabeledVarbNotFoundProps {
  className?: string;
  onXBtnClick?: () => void;
}
export function LabeledVarbNotFound({ ...rest }: LabeledVarbNotFoundProps) {
  return (
    <StyledLabeledVarb
      {...{
        labelId: "variable not found",
        labelText: "Variable not found",
        displayVarb: "?",
        ...rest,
      }}
    />
  );
}

interface StyledLabeledVarbProps extends LabeledVarbNotFoundProps {
  labelText: React.ReactNode;
  displayVarb: string;
  labelId: string;
  sx?: SxProps;
}
export function StyledLabeledVarb({
  labelId,
  className,
  labelText,
  displayVarb,
  sx,
}: StyledLabeledVarbProps) {
  return (
    <Box
      {...{
        className: `LabeledVarb-root ${className ?? ""}`,
        sx: [
          {
            position: "relative",
            zIndex: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "transparent",
            border: `solid 1px ${nativeTheme["gray-300"]}`,
            boxShadow: "none",
            borderRadius: nativeTheme.muiBr0,
            padding: nativeTheme.s3,
            fontSize: nativeTheme.inputLabel.fontSize,
          },
          ...arrSx(sx),
        ],
      }}
    >
      <div>
        <Box
          component="label"
          sx={{ whiteSpace: "nowrap", color: nativeTheme.darkBlue.main }}
          htmlFor={labelId}
        >
          {labelText}
        </Box>
        {/* {onXBtnClick && (
          <PlainBtn className="LabeledVarb-xBtn" onClick={onXBtnClick}>
            <AiOutlineCloseCircle className="icon" />
          </PlainBtn>
        )} */}
      </div>
      <Box
        component="output"
        id={labelId}
        sx={{ marginTop: nativeTheme.s2, color: nativeTheme.dark }}
      >{`${displayVarb}`}</Box>
    </Box>
  );
}
