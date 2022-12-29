import { Button } from "@material-ui/core";
import { transparentize } from "polished";
import React from "react";
import styled from "styled-components";
import theme from "../../theme/Theme";

interface Props {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
  key?: string;
}
export function LabeledIconBtn({ label, icon, className, ...rest }: Props) {
  return (
    <Styled
      {...{
        ...rest,
        className: "LabeledIconBtn-root " + className ?? "",
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
  padding: ${theme.s15} ${theme.s3};

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
`;
