import styled from "styled-components";
import theme from "../../theme/Theme";
import { ListMenuBtn } from "./ListGroup/ListGroupShared/ListMenuSimple/ListMenuBtn";

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
        text: title,
        icon,
      }}
    />
  );
}

const Styled = styled(ListMenuBtn)<{ $active: boolean }>`
  height: ${theme.bigButtonHeight};
  .DropdownBtn-caret {
    margin-right: ${theme.s1};
  }
`;
