import { Box, SxProps } from "@mui/material";
import styled, { css } from "styled-components";
import { StandardProps } from "./StandardProps";

export interface ModalWrapperProps extends StandardProps {
  show: boolean;
  sx?: SxProps;
}
export function ModalWrapper({
  children,
  className,
  show,
  sx,
}: ModalWrapperProps) {
  return (
    <Styled
      $show={show}
      sx={sx}
      // position: "fixed",
      // top: 0,
      // bottom: 0,
      // left: 0,i
      // right: 0,
      // display: "flex",
      // backgroundColor: "rgba(0, 0, 0, 0.5)",
      // alignItems: "center",
      // justifyContent: "center",
      // zIndex: 10,
      // opacity: 0,
      // transition: "all 0.3s ease-in-out",
      // pointerEvents: "none",
      // ...(show && { opacity: 1, pointerEvents: "visible" }),
      className={className}
    >
      <Box
        sx={{
          transform: show ? "translateY(0)" : "translateY(-200px)",
          transition: "all 0.3s ease-in-out",
        }}
      >
        {children}
      </Box>
    </Styled>
  );
}

const Styled = styled(Box)<{ $show: boolean }>`
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  opacity: 0;
  transition: all 0.3s ease-in-out;
  pointer-events: none;

  ${({ $show }) =>
    $show &&
    css`
      opacity: 1;
      pointer-events: visible;
    `}
`;
