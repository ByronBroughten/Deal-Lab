import React from "react";
import useOnOutsideClickRef from "../../modules/customHooks/useOnOutsideClickRef";
import { useToggleView } from "../../modules/customHooks/useToggleView";
import { Column } from "../App/ReactNative/Column";
import { DropdownContainer } from "./DropdownContainer";

interface Props {
  renderDropdownBtn: (
    toggleDropdown: () => void,
    dropdownIsOpen: boolean
  ) => React.ReactNode;
  renderDropdownContent: (props: {
    closeDropdown: () => void;
  }) => React.ReactNode;
}
export function DropdownBtnWrapper({
  renderDropdownBtn,
  renderDropdownContent,
}: Props) {
  const { dropdownIsOpen, toggleDropdown, closeDropdown, openDropdown } =
    useToggleView("dropdown", false);

  const ref = useOnOutsideClickRef(closeDropdown) as React.ForwardedRef<any>;
  return (
    <Column ref={ref} style={{ zIndex: 2 }}>
      {renderDropdownBtn(toggleDropdown, dropdownIsOpen)}
      {dropdownIsOpen && (
        <DropdownContainer>
          {renderDropdownContent({ closeDropdown })}
        </DropdownContainer>
      )}
    </Column>
  );
}
