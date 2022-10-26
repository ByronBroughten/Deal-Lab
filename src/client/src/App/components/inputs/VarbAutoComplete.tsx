import { Popper, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { isEqual } from "lodash";
import React from "react";
import styled from "styled-components";
import useToggle from "../../modules/customHooks/useToggle";
import { useVariableSections } from "../../sharedWithServer/stateClassHooks/useVariableOptions";
import {
  SectionOption,
  VariableOption,
} from "../../sharedWithServer/StateEntityGetters/VariableGetterSections";
import ccs from "../../theme/cssChunks";
import theme from "../../theme/Theme";

type PopParams = Parameters<typeof Popper>;
type PopperProps = PopParams extends (infer T)[] ? T : never;

export type PopperRef = React.Ref<HTMLDivElement>;
const PopperCustom = React.forwardRef(
  (props: PopperProps, ref: React.Ref<HTMLDivElement>) => (
    <StyledPopper {...props} style={{}} ref={ref} /> // for some reason, style={{}} is necessary
  )
);

const StyledPopper = styled(Popper)`
  .MuiAutocomplete-paper {
    margin: 0;
    line-height: 1rem;
    font-size: 0.9rem;
  }

  .MuiAutocomplete-listbox {
    max-height: 30vh;
    width: auto;
    padding: 0;
    ${ccs.dropdown.scrollbar};
  }

  ul {
    li.MuiAutocomplete-option {
      padding: ${theme.s2};
      padding-left: calc(${theme.s4} + ${theme.s2});
      width: 300px;
      line-height: 1rem;
      min-height: 25px;
      :not(:first-child) {
        border-top: 1px solid ${theme["gray-400"]};
      }
    }
  }

  li {
    .MuiListSubheader-root {
      top: 0;
      padding: ${theme.s3};
      padding-bottom: ${theme.s2};
      line-height: 1rem;
      font-weight: 600;
      border-top: 1px solid ${theme["gray-400"]};
      border-bottom: 2px solid ${theme["gray-500"]};
      background-color: ${theme["gray-200"]};
    }
  }
`;

export type OnSelect =
  | ((value: VariableOption) => void)
  | ((value: SectionOption) => void);

type Props = {
  onSelect: OnSelect;
  className?: string;
  placeholder?: string;
  clearOnBlur?: boolean;
  value?: any;
  options?: VariableOption[] | SectionOption[];
};

const VarbAutoComplete = React.forwardRef(
  (
    {
      onSelect,
      className,
      placeholder,
      clearOnBlur = true,
      value,
      options,
    }: Props,
    ref: PopperRef
  ) => {
    const variableSections = useVariableSections();
    const autoCompleteOptions = React.useMemo(
      () => options ?? variableSections.variableOptions(),
      []
    );

    const [inputValue, setInputValue] = React.useState(
      value ? value.displayName : ""
    );
    const { value: keyBool, toggle: clearSelect } = useToggle();

    // const [open, setOpen] = React.useState(false);
    // const loading = open && autoCompleteOptions.length === 0;
    // https://mui.com/material-ui/react-autocomplete/#load-on-open
    return (
      <Styled className={`VarbAutoComplete-root ${className ?? ""}`}>
        <Autocomplete
          // open={open}
          // onOpen={() => setOpen(true)}
          // onClose={() => setOpen(false)}
          // loading={loading}
          PopperComponent={(props: PopperProps) => (
            <PopperCustom {...props} ref={ref} />
          )}
          getOptionSelected={(option, value) => {
            return isEqual(option, value);
          }}
          key={`${keyBool}`}
          id="VarbAutoComplete-autoComplete"
          onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
          options={autoCompleteOptions}
          {...{
            value,
            inputValue,
            ...("collectionName" in autoCompleteOptions[0] && {
              groupBy: (option: any) => option.collectionName,
            }),
          }}
          getOptionLabel={(option) => option.displayName}
          // getOptionSelected={(option, value) =>
          //   option.displayName === value.displayName
          // }
          renderInput={(params: any) => (
            <TextField
              {...params}
              placeholder={placeholder ?? "Variables"}
              variant="filled"
            />
          )}
          size="small"
          clearOnEscape
          clearOnBlur={clearOnBlur}
          openOnFocus
          // disableCloseOnSelect
          disableClearable // gets rid of the x icon
          // forcePopupIcon={false} // gets rid of the arrow
          noOptionsText="Not found"
          // interesting options:
          // fullWidth
          // blurOnSelect

          // open //debug option
          // disablePortal
          onChange={(_, value, reason) => {
            if (reason === "select-option" && value) {
              onSelect(value);
              if (clearOnBlur) clearSelect();
            }
          }}
        />
      </Styled>
    );
  }
);

export default VarbAutoComplete;

const minWidth = "110px";

const Styled = styled.div`
  .MuiInputBase-root {
    padding: 0;
    border-radius: 0;
    background-color: ${theme["gray-400"]};
    border: 1px solid ${theme["gray-500"]};

    input {
      padding-top: 5px;
      ::placeholder {
        position: relative;
        left: 7px;
        text-align: center;
        opacity: 0.8;
      }

      :hover {
        ::placeholder {
          opacity: 0.5;
        }
      }
    }
  }

  .MuiInputBase-root.Mui-focused {
    input {
      ::placeholder {
        opacity: 0.42;
      }
      :hover {
        ::placeholder {
          color: ${theme.dark};
          font-weight: 400;
          opacity: 0.42;
        }
      }
    }
  }

  .MuiAutocomplete-inputRoot[class*="MuiFilledInput-root"][class*="MuiFilledInput-marginDense"]
    .MuiAutocomplete-input {
    padding: ${theme.s1};
    padding-left: ${theme.s2};
    padding-bottom: 0;
  }
  .MuiAutocomplete-inputRoot[class*="MuiFilledInput-root"]
    .MuiAutocomplete-endAdornment {
    right: 0px;
  }
  .MuiAutocomplete-hasPopupIcon {
    .MuiInputBase-root {
      display: flex;
      width: ${minWidth};
      padding-right: 20px;
      .MuiIconButton-label {
        width: 22px;
        .MuiSvgIcon-root {
        }
      }
    }
  }
  .MuiAutocomplete-endAdornment {
    .MuiAutocomplete-clearIndicator {
      display: none;
    }
  }
`;
