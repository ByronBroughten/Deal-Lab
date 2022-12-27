import { AiOutlineInfoCircle } from "react-icons/ai";
import styled from "styled-components";
import theme from "../../theme/Theme";
import { StandardProps } from "../general/StandardProps";

type Props = StandardProps;
export function InfoBlurb({ className, children }: Props) {
  return (
    <Styled className={`InfoBlurb-root ${className}`}>
      <AiOutlineInfoCircle size={18} className="InfoBlurb-icon" />
      {children}
    </Styled>
  );
}
const Styled = styled.div`
  display: flex;
  align-items: center;
  padding: ${theme.s2} ${theme.s3};
  font-size: ${theme.infoSize};
  border-radius: ${theme.br0};
  color: ${theme.dark};
  background: ${theme.info.light};
  .InfoBlurb-icon {
    margin-right: ${theme.s2};
  }
`;
