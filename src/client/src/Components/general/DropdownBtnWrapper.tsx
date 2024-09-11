import React from "react";
import useOnOutsideClickRef from "../../modules/utilityHooks/useOnOutsideClickRef";
import { useToggleView } from "../../modules/utilityHooks/useToggleView";
import { DropdownContainer } from "./DropdownContainer";
import { RefColumn } from "./RefColumn";

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
    <RefColumn ref={ref} sx={{ zIndex: 2 }}>
      {renderDropdownBtn(toggleDropdown, dropdownIsOpen)}
      {dropdownIsOpen && (
        <DropdownContainer>
          {renderDropdownContent({ closeDropdown })}
        </DropdownContainer>
      )}
    </RefColumn>
  );
}
