import { Box, SxProps } from "@mui/material";
import React from "react";
import styled from "styled-components";
import { CheckboxLabeled } from "../../../../../general/CheckboxLabeled";

type Props = { className?: string; checkboxProps: ItemProps[]; sx?: SxProps };
export function CheckboxList({ className, checkboxProps, sx }: Props) {
  return (
    <Styled sx={sx} className={className}>
      {checkboxProps.map((props) => (
        <CheckboxLabeled
          {...{
            className: "CheckboxList-checkBox",
            key: props.name,
            ...props,
          }}
        />
      ))}
    </Styled>
  );
}

const Styled = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  max-width: 480px;
  .CheckboxList-checkBox {
    width: 160px;
    white-space: nowrap;
  }
`;

type ItemProps = {
  checked: boolean;
  onChange: () => void;
  name: string;
  label?: React.ReactNode;
};
