import styled from "styled-components";
import { StandardProps } from "./StandardProps";

export function ModalWrapper({ children, className }: StandardProps) {
  return (
    <Styled className={`Modal-root ${className ?? ""}`}>
      <div className="Modal-content">{children}</div>
    </Styled>
  );
}

const Styled = styled.div`
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
`;
