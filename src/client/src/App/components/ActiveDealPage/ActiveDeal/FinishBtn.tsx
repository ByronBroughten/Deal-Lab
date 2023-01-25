import { toast } from "react-toastify";
import styled, { css } from "styled-components";
import theme from "../../../theme/Theme";
import { HollowBtn } from "../../appWide/HollowBtn";
import { StandardBtnProps } from "../../general/StandardProps";

interface Props extends StandardBtnProps {
  styleDisabled: boolean;
  warningText: string;
  btnText: string;
}

function disabledWarning(warningText: string) {
  toast.info(warningText);
}

export function FinishBtn({
  styleDisabled,
  onClick,
  className,
  btnText,
  warningText,
}: Props) {
  return (
    <Styled
      {...{
        className: `FinishBtn-btn ${className ?? ""}`,
        $styleDisabled: styleDisabled,
        text: btnText,
        onClick: styleDisabled ? () => disabledWarning(warningText) : onClick,
      }}
    />
  );
}

const Styled = styled(HollowBtn)<{ $styleDisabled?: boolean }>`
  height: 50px;
  width: 100%;
  margin-top: ${theme.s3};
  font-size: ${theme.titleSize};

  ${({ $styleDisabled }) =>
    $styleDisabled &&
    css`
      border-color: ${theme["gray-400"]};
      color: ${theme["gray-500"]};
      :hover {
        background: ${theme.light};
        border-color: ${theme["gray-400"]};
        color: ${theme["gray-500"]};
      }
    `}
`;
