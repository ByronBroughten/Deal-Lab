import { BsCircle } from "react-icons/bs";
import { IoMdCheckmarkCircle } from "react-icons/io";
import styled from "styled-components";
import theme from "../../theme/Theme";

type Props = { checked: boolean; className?: string };
export function CheckMarkCircle({ checked, className }: Props) {
  return (
    <Styled className={`CheckMarkCircle-root ${className ?? ""}`}>
      <BsCircle size={21} color={theme.primaryNext} />
      {checked && (
        <div className="CheckMarkCircle-markWrapper">
          <IoMdCheckmarkCircle size={19} color={theme.secondary} />
        </div>
      )}
    </Styled>
  );
}

const Styled = styled.span`
  display: flex;
  align-items: center;
  position: relative;
  margin-right: ${theme.s25};

  .CheckMarkCircle-markWrapper {
    position: absolute;
    top: 1px;
    left: 1px;
  }
`;
