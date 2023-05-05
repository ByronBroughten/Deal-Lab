import { AiOutlinePlus } from "react-icons/ai";
import styled from "styled-components";
import theme from "../../../../../../theme/Theme";
import { SectionBtn } from "../../../../../appWide/SectionBtn";
import { MuiBtnPropsNext } from "../../../../../general/StandardProps";
import { unitItemHeight, unitItemWidth } from "./UnitItem";

type Props = MuiBtnPropsNext;
export function AddUnitBtn({ sx, ...rest }: Props) {
  return (
    <div className="UnitItem-root">
      <Styled
        className="AddUnitBtn-btn"
        {...{
          sx: {
            height: unitItemHeight,
            width: unitItemWidth,
            ...sx,
          },
          ...rest,
          middle: <AiOutlinePlus />,
        }}
      />
    </div>
  );
}

const Styled = styled(SectionBtn)`
  box-shadow: none;
  font-size: ${theme.titleSize};
`;
