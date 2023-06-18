import { Box, SxProps } from "@mui/material";
import React from "react";
import {
  FeSectionInfo,
  FeVarbInfo,
  FeVarbInfoNext,
} from "../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { useGetterSection } from "../../sharedWithServer/stateClassHooks/useGetterSection";
import { useGetterSections } from "../../sharedWithServer/stateClassHooks/useGetterSections";
import { nativeTheme } from "../../theme/nativeTheme";
import { arrSx } from "../../utils/mui";
import { useVarbInfoText } from "../customHooks/useVarbInfoText";
import { MuiRow } from "../general/MuiRow";
import { useInfoModal } from "./../Modals/InfoModalProvider";
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

  const { inputLabel, info, title } = useVarbInfoText(
    finder[0] as FeVarbInfoNext
  );

  const { setModal } = useInfoModal();

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
          <MuiRow>
            {inputLabel}
            {info && title && (
              <InfoIcon
                {...{
                  infoText: info,
                  title,
                }}
              />
            )}
          </MuiRow>
        ),
        displayVarb: toDisplay,
        labelId: inputLabel,
        ...rest,
      }}
    />
  );
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

export interface LoadedVarbProps extends LabeledVarbNotFoundProps {
  feInfo: FeSectionInfo;
}
export function LoadedVarb({ feInfo, ...rest }: LoadedVarbProps) {
  const section = useGetterSection(feInfo);
  const { virtualVarb } = section;
  const { entityId } = section.valueEntityInfo();
  return (
    <StyledLabeledVarb
      {...{
        labelText: virtualVarb.displayName,
        displayVarb: virtualVarb.displayVarb(),
        labelId: entityId,
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
