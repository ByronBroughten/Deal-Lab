import React from "react";
import styled from "styled-components";
import useOnOutsideClickRef from "../../modules/customHooks/useOnOutsideClickRef";
import useToggleView from "../../modules/customHooks/useToggleView";
import theme from "../../theme/Theme";
import { StandardProps } from "../general/StandardProps";
import NavBtn from "./NavBtn";

interface Props extends StandardProps {
  btnText: string | React.ReactNode;
  btnIcon?: React.ReactNode;
}
export default function NavDropDown({
  btnText,
  children,
  className,
  btnIcon,
}: Props) {
  const { viewIsOpen, toggleView, closeView } = useToggleView({
    initValue: false,
  });
  const closeIfClickOutsideRef = useOnOutsideClickRef(closeView);

  return (
    <Styled
      className={`NavDropDown-root ${className}`}
      ref={closeIfClickOutsideRef}
    >
      <NavBtn
        onClick={toggleView}
        className="NavDropDown-navBtn"
        $isactive={viewIsOpen}
        text={btnText}
        icon={btnIcon}
      />
      {viewIsOpen && (
        <div className="NavDropDown-dropdownPosition">
          <div className="NavDropDown-viewable">{children}</div>
        </div>
      )}
    </Styled>
  );
}
const Styled = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  height: 100%;

  .NavBtn {
    height: 100%;
    position: relative;
    z-index: 2;
  }

  .NavDropDown-dropdownPosition {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: row-reverse;
    .NavDropDown-viewable {
      position: absolute;
      border-top: none;
      border-radius: 0 0 ${theme.br1} ${theme.br1};
      background-color: ${theme["gray-200"]};
      border-top: none;
      box-shadow: ${theme.boxShadow4};
    }
  }
`;
