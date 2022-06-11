import { Popper } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import ccs from "../../../theme/cssChunks";
import theme from "../../../theme/Theme";

type PopParams = Parameters<typeof Popper>;
export type PopperProps = PopParams extends (infer T)[] ? T : never;
export const PopperCustom = React.forwardRef(
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
      width: 210px;
      line-height: 1rem;
      min-height: 30px;
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
