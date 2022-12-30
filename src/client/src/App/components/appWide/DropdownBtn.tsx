import styled from "styled-components";
import theme from "../../theme/Theme";
import { ListMenuBtn } from "./ListGroup/ListGroupShared/ListMenuSimple/ListMenuBtn";

type Props = {
  title: string;
  toggleDropped: () => void;
  isDropped?: boolean;
  icon?: React.ReactNode;
  className: string;
};
export function DropdownBtn({
  title,
  isDropped,
  toggleDropped,
  icon,
  className,
}: Props) {
  return (
    <Styled
      {...{
        onClick: toggleDropped,
        $active: isDropped,
        className: `DropdownBtn-root ${className ?? ""}`,
        text: title,
        icon,
      }}
    />
  );
}

const Styled = styled(ListMenuBtn)<{ $active?: boolean }>`
  height: ${theme.bigButtonHeight};
  .DropdownBtn-caret {
    margin-right: ${theme.s1};
  }
`;
