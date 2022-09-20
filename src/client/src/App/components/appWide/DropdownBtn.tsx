import styled from "styled-components";
import theme from "../../theme/Theme";
import ListMenuBtn from "./ListGroup/ListGroupShared/ListMenuSimple/ListMenuBtn";

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
      {icon && <span className="DropdownBtn-icon">{icon}</span>}
    </Styled>
  );
}

const Styled = styled(ListMenuBtn)<{ $active: boolean }>`
  height: ${theme.bigButtonHeight};
  .DropdownBtn-icon {
    margin-left: ${theme.s2};
    font-size: 17px;
    display: flex;
    align-items: center;
  }
  .DropdownBtn-caret {
    margin-right: ${theme.s1};
  }
`;
