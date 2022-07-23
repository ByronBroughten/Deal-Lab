import { Button } from "@material-ui/core";
import { AiOutlineMenu } from "react-icons/ai";
import styled from "styled-components";
import ccs from "../../theme/cssChunks";
import theme from "../../theme/Theme";

type Props = { title: string; isDropped: boolean; toggleDropped: () => void };
export function DropdownBtn({ title, isDropped, toggleDropped }: Props) {
  return (
    <Styled
      {...{
        onClick: toggleDropped,
        $active: isDropped,
      }}
    >
      <span>{title}</span>
      <AiOutlineMenu className="DbDropdownBtn-menu" />
    </Styled>
  );
}

const Styled = styled(Button)<{ $active: boolean }>`
  box-shadow: ${theme.boxShadow1};
  ${({ $active }) => ccs.coloring.button.lightNeutral($active)};
  .DbDropdownBtn-menu {
    margin-left: ${theme.s2};
    font-size: 17px;
  }
  .DropdownBtn-caret {
    margin-right: ${theme.s1};
  }
`;
