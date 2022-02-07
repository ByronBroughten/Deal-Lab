import React from "react";
import { useAnalyzerContext } from "../../modules/usePropertyAnalyzer";
import { Autocomplete } from "@material-ui/lab";
import { TextField } from "@material-ui/core";
import useToggle from "../../modules/customHooks/useToggle";
import theme from "../../theme/Theme";
import ccs from "../../theme/cssChunks";
import styled from "styled-components";
import {
  SectionOption,
  VariableOption,
} from "../../sharedWithServer/Analyzer/methods/entitiesVariables";

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
export default function VarbAutoComplete({
  onSelect,
  className,
  placeholder,
  clearOnBlur = true,
  value,
  options,
}: Props) {
  const { analyzer } = useAnalyzerContext();
  options = options ?? analyzer.variableOptions();
  const [inputValue, setInputValue] = React.useState(
    value ? value.displayName : ""
  );
  const { value: keyBool, toggle: clearSelect } = useToggle();

  return (
    <Styled className={`VarbAutoComplete-root ${className}`}>
      <Autocomplete
        key={`${keyBool}`}
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
        // groupBy={(option) => option.collectionName}
        getOptionLabel={(option) => option.displayName}
        renderInput={(params: any) => (
          <TextField
            {...params}
            placeholder={placeholder ?? "Search variables"}
            variant="filled"
            popoverProps={{ canAutoPosition: true }}
          />
        )}
        size="small"
        clearOnEscape
        clearOnBlur={clearOnBlur}
        openOnFocus
        disableClearable // gets rid of the x icon
        noOptionsText="Not found"
        // interesting options
        // fullWidth
        // blurOnSelect

        // open //debug option
        disablePortal
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

const minWidth = "180px";

const Styled = styled.div`
  .MuiInputBase-root {
    padding: 0;
    border-radius: 0;
    margin-top: ${theme.s1};
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

  .MuiAutocomplete-popper {
    width: auto !important;
    .MuiAutocomplete-listbox {
      max-height: 30vh;
    }

    .MuiAutocomplete-paper {
      margin: 0;
      line-height: 1rem;
      font-size: 0.9rem;
    }

    .MuiAutocomplete-listbox {
      padding: 0;
      ${ccs.dropdown.scrollbar};

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

        ul {
          li.MuiAutocomplete-option {
            padding: ${theme.s2};
            padding-left: calc(${theme.s4} + ${theme.s2});
            width: 200px;
            line-height: 1rem;
            min-height: 30px;
            :not(:first-child) {
              border-top: 1px solid ${theme["gray-400"]};
            }
          }
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
