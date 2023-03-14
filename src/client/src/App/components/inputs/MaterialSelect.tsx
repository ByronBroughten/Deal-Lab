import {
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { ReactNode } from "react";
import styled, { css } from "styled-components";
import theme from "../../theme/Theme";

type Props = {
  name: string;
  value: string;
  onChange:
    | ((event: SelectChangeEvent<string>, child: ReactNode) => void)
    | undefined;
  children: ReactNode;
  label?: string;
  className?: string;
};

export default function MaterialSelect({
  name,
  value,
  onChange,
  children,
  label,
  className,
}: Props) {
  return (
    <FormControl className={className} hiddenLabel={!label}>
      {label && <InputLabel>{label}</InputLabel>}
      <Select {...{ name, value, onChange }}>{children}</Select>
    </FormControl>
  );
}

const Styled = styled(FormControl)`
  .MuiSelect-root {
    padding-right: 20px;
    padding: ${theme.s1} ${theme.s2} 0 ${theme.s2};
    border-radius: ${theme.br0};
    min-width: 0.7rem;
  }
  .MuiSelect-iconFilled {
    right: 0px;
  }
`;

const oldMuiStuff = (label?: string) => css`
  display: inline-block;
  .MaterialDraftEditor-wrapper {
    display: inline-block;
    border-top-left-radius: ${theme.br0};
    border-top-right-radius: ${theme.br0};
    border: 1px solid ${theme.primaryBorder};
    /* border-bottom: 1px solid transparent; */
    background-color: ${theme.light};
  }

  .MuiFilledInput-adornedStart {
    padding-left: 0;
  }
  .MuiFilledInput-adornedEnd {
    padding-right: 0;
  }

  .MuiInputBase-root {
    padding: ${theme.s1} ${theme.s2} 0 ${theme.s2};
    border-radius: ${theme.br0};
    display: inline-block;
    white-space: nowrap;
    background: ${theme.light};
  }

  .DraftEditor-root {
    display: inline-block;
  }
  .DraftEditor-editorContainer {
  }

  .public-DraftEditor-content {
    display: inline-block;
    white-space: nowrap;
    color: ${theme.dark};
  }

  .public-DraftStyleDefault-block {
    display: flex;
    flex-wrap: nowrap;
    white-space: nowrap;
  }

  ${label &&
  css`
    .MuiFilledInput-root {
      padding-left: ${theme.s2};
      padding-right: ${theme.s2};
      padding-top: 1.2rem;
      padding-bottom: 2px;
      /* min-width: 75px; */
    }

    .MuiFormLabel-root {
      color: ${theme["gray-600"]};
      white-space: nowrap;
    }
    .MuiFormLabel-root.Mui-focused {
      color: ${theme.next.dark};
    }

    // label location without text
    .MuiInputLabel-filled {
      transform: translate(${theme.s2}, 17px) scale(1);
    }
    // label location while shrunk
    .MuiInputLabel-filled.MuiInputLabel-shrink {
      transform: translate(${theme.s2}, ${theme.s2}) scale(0.85);
    }
  `}
`;
