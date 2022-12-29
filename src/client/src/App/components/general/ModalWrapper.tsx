import styled, { css } from "styled-components";
import { StandardProps } from "./StandardProps";

export interface ModalWrapperProps extends StandardProps {
  show: boolean;
}
export function ModalWrapper({ children, className, show }: ModalWrapperProps) {
  return (
    <Styled
      $show={show}
      className={`ModalWrapper-root ${show ? "ModalWrapper-show" : ""} ${
        className ?? ""
      }`}
    >
      <div className="ModalWrapper-content">{children}</div>
    </Styled>
  );
}

const Styled = styled.div<{ $show: boolean }>`
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

  .ModalWrapper-content {
    transform: translateY(-200px);
    transition: all 0.3s ease-in-out;
  }

  ${({ $show }) =>
    $show &&
    css`
      opacity: 1;
      pointer-events: visible;
      .ModalWrapper-content {
        transform: translateY(0);
      }
    `}
`;
