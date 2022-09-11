import { Button } from "@material-ui/core";
import { transparentize } from "polished";
import React from "react";
import styled, { css } from "styled-components";
import theme from "../../theme/Theme";

type Props = {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
};
export function LabeledIconBtn({
  label,
  icon,
  onClick,
  className,
  disabled,
}: Props) {
  return (
    <Styled
      {...{
        onClick,
        className: "LabeledIconBtn-root " + className ?? "",
        disabled,
      }}
    >
      <span className="LabeledIconBtn-iconSpan">{icon}</span>
      <span className="LabeledIconBtn-label">{label}</span>
    </Styled>
  );
}

const Styled = styled(Button)`
  display: flex;
  justify-content: flex-start;
  border-radius: 0;
  box-shadow: ${theme.boxShadow1};
  background-color: ${transparentize(0.05, theme["gray-300"])};
  color: ${theme.softDark};
  line-height: 1rem;
  font-size: 1rem;
  white-space: nowrap;
  height: 30px;

  :disabled {
    color: ${transparentize(0.4, theme.softDark)};
    background-color: ${transparentize(0.05, theme.error.light)};
  }

  .LabeledIconBtn-iconSpan {
    display: flex;
    justify-content: flex-start;
    min-width: 40px;
  }
  .LabeledIconBtn-label {
    margin-left: ${theme.s3};
  }
  :hover {
    background-color: ${theme["gray-500"]};
  }

  /* ${({ disabled }) =>
    disabled &&
    css`
      background-color: ${transparentize(0.13, theme.error.main)};
    `} */
`;
