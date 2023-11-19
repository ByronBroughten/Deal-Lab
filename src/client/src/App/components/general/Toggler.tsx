import { FormControlLabel, FormGroup, Switch } from "@mui/material";
import React from "react";
import { nativeTheme } from "../../theme/nativeTheme";

type Props = {
  checked: boolean;
  label: React.ReactNode;
  onChange: () => void;
  name?: string;
  className?: string;
  editorMargins?: boolean;
};

export function Toggler({ label, className, editorMargins, ...rest }: Props) {
  return (
    <FormGroup
      sx={{
        borderWidth: 0,
        ...(editorMargins
          ? nativeTheme.editorMargins
          : {
              my: nativeTheme.s2,
              mr: nativeTheme.s4,
              ml: 0,
            }),
        "& .MuiFormControlLabel-labelPlacementStart": {
          margin: 0,
          padding: 0,
        },
        "& .MuiSwitch-colorPrimary": {
          color: nativeTheme["gray-500"],
        },
        "& .MuiSwitch-colorPrimary.Mui-checked": {
          color: nativeTheme.secondary.main,
        },
        "& .MuiFormControlLabel-label.MuiTypography-root": {
          lineHeight: 1.2,
          fontWeight: 500,
          color: nativeTheme.primary.main,
          fontSize: nativeTheme.inputLabel.fontSize,
          m: 0,
          p: 0,
        },
      }}
      className={className}
    >
      <div>
        <FormControlLabel
          control={
            <Switch
              {...{
                ...rest,
                size: "small",
                color: "primary",
                sx: { marginLeft: nativeTheme.s1 },
              }}
            />
          }
          label={label}
          labelPlacement="start"
        />
      </div>
    </FormGroup>
  );
}
