import styled from "styled-components";
import ccs from "../../../../../theme/cssChunks";
import theme from "../../../../../theme/Theme";
import PlusBtn from "../../../../appWide/PlusBtn";
import { StandardBtnProps } from "../../../../general/StandardProps";
import { unitItemWidth } from "./UnitItem";

type Props = StandardBtnProps;
export function AddUnitBtn(props: Props) {
  return <Styled {...props}>Add Unit</Styled>;
}

const Styled = styled(PlusBtn)`
  min-width: ${unitItemWidth};
  ${ccs.mainColorSection("property")};
  box-shadow: ${theme.boxShadow1};
  border: none;
  :hover,
  :active {
    background-color: ${theme.property.dark};
    border: 1px solid ${theme.property.main};
  }

  font-weight: 700;
  font-size: 0.9rem;
  line-height: 1.2rem;
  height: 26px;
  box-shadow: ${theme.boxShadow1};
`;
