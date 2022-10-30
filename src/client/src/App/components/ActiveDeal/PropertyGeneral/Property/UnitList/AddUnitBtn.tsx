import styled from "styled-components";
import ccs from "../../../../../theme/cssChunks";
import theme from "../../../../../theme/Theme";
import PlusBtn from "../../../../appWide/PlusBtn";
import { StandardBtnProps } from "../../../../general/StandardProps";

type Props = StandardBtnProps;
export function AddUnitBtn(props: Props) {
  return <Styled {...props}>+ Unit</Styled>;
}

const Styled = styled(PlusBtn)`
  ${ccs.mainColorSection("property")};
  min-width: 80px;
  min-height: 50px;
  box-shadow: ${theme.boxShadow1};
  :hover,
  :active {
    background-color: ${theme.property.dark};
  }

  font-weight: 700;
  font-size: 0.9rem;
  line-height: 1.2rem;
  height: 26px;
  box-shadow: ${theme.boxShadow1};
`;
