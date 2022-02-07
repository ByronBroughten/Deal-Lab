import { MenuItem } from "@material-ui/core";
import styled from "styled-components";
import theme from "../../theme/Theme";

export type SimpleMuiMenuItem = {
  displayValue: string;
  onClick: () => void;
  switchValue?: string;
};

type Props = {
  items: SimpleMuiMenuItem[];
  selectedValue?: string;
  className?: string;
  closeMenu?: () => void;
};
export default function SimpleMuiMenu({
  items,
  selectedValue,
  className,
}: Props) {
  return (
    <Styled className={`SimpleMuiMenu-root ${className ?? ""}`}>
      {items.map(({ switchValue, displayValue, onClick }) => (
        <MenuItem
          onClick={onClick}
          className={`SimpleMuiMenu-menuItem ${
            switchValue === selectedValue ? "selected" : ""
          }`}
        >
          {displayValue}
        </MenuItem>
      ))}
    </Styled>
  );
}

const Styled = styled.div`
  position: absolute;
  z-index: 2;
  font-size: 0.85rem;
  background: ${theme.light};
  border-radius: ${theme.br1};
  box-shadow: ${theme.boxShadow1};

  .MuiMenuItem-root {
    font-size: 0.85rem;
    padding: ${theme.s2};
  }

  .MuiMenuItem-root.selected {
    background-color: ${theme["gray-300"]};
  }
`;
