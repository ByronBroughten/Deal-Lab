import { Button } from "@material-ui/core";
import styled from "styled-components";
import ccs from "../../theme/cssChunks";
import theme from "../../theme/Theme";

type Props = {
  title: string;
  isDropped: boolean;
  toggleDropped: () => void;
  icon?: React.ReactNode;
};
export function DropdownBtn({ title, isDropped, toggleDropped, icon }: Props) {
  return (
    <Styled
      {...{
        onClick: toggleDropped,
        $active: isDropped,
        className: "DropdownBtn-root",
      }}
    >
      <span>{title}</span>
      {icon && <span className="DbDropdownBtn-menu">{icon}</span>}
    </Styled>
  );
}

const Styled = styled(Button)<{ $active: boolean }>`
  box-shadow: ${theme.boxShadow1};
  height: ${theme.bigButtonHeight};
  :hover {
    background-color: ${theme.transparentGrayDark};
  }

  ${({ $active }) => ccs.coloring.button.lightNeutral($active)};
  .DbDropdownBtn-menu {
    margin-left: ${theme.s2};
    font-size: 17px;
    display: flex;
    align-items: center;
  }
  .DropdownBtn-caret {
    margin-right: ${theme.s1};
  }
`;
