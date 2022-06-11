import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import React from "react";
import styled from "styled-components";
import useToggle from "../../modules/customHooks/useToggle";
import theme from "../../theme/Theme";
import { PopperCustom, PopperProps } from "./GenericAutoComplete/CustomPopper";

type OnSelectNext<O> = (value: O) => void;
type Props<O = any> = {
  onSelect: OnSelectNext<O>;
  options: O[];
  className?: string;
  placeholder?: string;
  clearOnBlur?: boolean;
  value?: string;
};

export type PopperRef = React.Ref<HTMLDivElement>;
export const GenericAutoComplete = React.forwardRef(
  (
    {
      onSelect,
      options,
      className,
      placeholder,
      clearOnBlur = true,
      value,
    }: Props,
    ref: PopperRef
  ) => {
    // inputValue is the state of the text doing the search.
    // value is the selected value
    const [inputValue, setInputValue] = React.useState(value ?? "");
    const { value: keyBoolean, toggle: clearSelect } = useToggle();
    return (
      <Styled className={`VarbAutoComplete-root ${className ?? ""}`}>
        <Autocomplete
          PopperComponent={(props: PopperProps) => (
            <PopperCustom {...props} ref={ref} />
          )}
          key={`${keyBoolean}`}
          id="VarbAutoComplete-autoComplete"
          onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
          {...{
            value,
            options,
            inputValue,
            ...("collectionName" in options[0] && {
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
