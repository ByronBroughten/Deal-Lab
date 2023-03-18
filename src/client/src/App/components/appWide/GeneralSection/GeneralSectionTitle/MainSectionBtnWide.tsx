import { SxProps } from "@mui/material";
import styled from "styled-components";
import theme from "../../../../theme/Theme";
import { StandardBtnProps } from "../../../general/StandardProps";
import { MainSectionBtn } from "./MainSectionBtn";

interface Props extends StandardBtnProps {
  sx?: SxProps;
  text: React.ReactNode;
  icon?: React.ReactElement;
}
export function MainSectionBtnWide({ sx, text, icon }: Props) {
  return (
    <Styled
      {...{
        sx: {
          ...sx,
        },
        middle: text,
        right: icon,
      }}
    />
  );
}
const Styled = styled(MainSectionBtn)`
  height: 80px;
  width: 100%;

  :hover {
    background-color: ${theme.secondary};
    color: ${theme.light};
    box-shadow: none;
  }

  .MainSectionTitleBtn-icon {
    display: flex;
    align-items: center;
    margin-left: ${theme.s3};
  }
`;
