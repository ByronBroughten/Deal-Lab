import { FormControlLabel, FormGroup, styled, Switch } from "@mui/material";
import React from "react";
import { nativeTheme } from "../../theme/nativeTheme";

type Props = {
  checked: boolean;
  label: React.ReactNode;
  onChange: () => void;
  name?: string;
  className?: string;
};

export const Toggler = styled(TogglerBase)({
  borderWidth: 0,
  ...nativeTheme.formSection,
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
  "& .MuiFormControlLabel-label": {
    width: 180,
  },
  "& .MuiFormControlLabel-label.MuiTypography-root": {
    lineHeight: 1.2,
    fontWeight: 500,
    color: nativeTheme.primary.main,
    fontSize: nativeTheme.inputLabel.fontSize,
    m: 0,
    p: 0,
  },
});

function TogglerBase({ label, className, ...rest }: Props) {
  return (
    <FormGroup
      sx={{
        ...nativeTheme.editorMargins,
        pt: nativeTheme.s3,
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
