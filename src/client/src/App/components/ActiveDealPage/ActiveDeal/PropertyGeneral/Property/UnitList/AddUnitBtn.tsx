import { AiOutlinePlus } from "react-icons/ai";
import styled from "styled-components";
import theme from "../../../../../../theme/Theme";
import { SectionBtn } from "../../../../../appWide/SectionBtn";
import { StandardBtnProps } from "../../../../../general/StandardProps";
import { unitItemHeight, unitItemWidth } from "./UnitItem";

type Props = StandardBtnProps;
export function AddUnitBtn(props: Props) {
  return (
    <div className="UnitItem-root">
      <Styled
        className="AddUnitBtn-btn"
        {...{
          ...props,
          middle: <AiOutlinePlus />,
        }}
      />
    </div>
  );
}

const Styled = styled(SectionBtn)`
  height: ${unitItemHeight};
  width: ${unitItemWidth};
  box-shadow: none;
  font-size: ${theme.titleSize};
`;
