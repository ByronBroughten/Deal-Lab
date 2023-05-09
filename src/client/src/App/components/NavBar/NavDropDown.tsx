import React from "react";
import styled from "styled-components";
import useOnOutsideClickRef from "../../modules/customHooks/useOnOutsideClickRef";
import { useToggleView } from "../../modules/customHooks/useToggleView";
import { nativeTheme } from "../../theme/nativeTheme";
import theme from "../../theme/Theme";
import { StandardProps } from "../general/StandardProps";
import { NavBtn } from "./NavBtn";

interface Props extends StandardProps {
  btnText?: string | React.ReactNode;
  btnIcon?: React.ReactNode;
  dropDirection?: "left" | "right";
  doCloseViewToggle?: boolean;
}
export function NavDropDown({
  btnText,
  children,
  className,
  btnIcon,
  dropDirection = "left",
  doCloseViewToggle = false,
}: Props) {
  const { viewIsOpen, toggleView, closeView } = useToggleView("view", false);
  const closeIfClickOutsideRef = useOnOutsideClickRef(closeView);

  // this is complicated.

  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      closeView();
    }
  }, [doCloseViewToggle, closeView]);

  return (
    <Styled
      className={`NavDropDown-root ${className}`}
      ref={closeIfClickOutsideRef}
      $dropDirection={dropDirection}
    >
      <NavBtn
        className="NavDropDown-navBtn"
        sx={{ ml: nativeTheme.s35 }}
        onClick={toggleView}
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
const Styled = styled.div<{ $dropDirection: "left" | "right" }>`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  height: 100%;

  .NavBtn-root {
    height: 100%;
    position: relative;
    z-index: 2;
  }

  .NavDropDown-dropdownPosition {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: ${({ $dropDirection }) =>
      $dropDirection === "left" ? "row-reverse" : "row"};
    .NavDropDown-viewable {
      position: absolute;
      border-top: none;
      border-radius: 0 0 ${theme.br0} ${theme.br0};
      background-color: ${theme["gray-200"]};
      border-top: none;
      /* box-shadow: ${theme.boxShadow4}; */
    }
  }
`;
