import { toast } from "react-toastify";
import styled, { css } from "styled-components";
import theme from "../../../theme/Theme";
import BtnTooltip from "../../appWide/BtnTooltip";
import { HollowBtn } from "../../appWide/HollowBtn";
import { StandardBtnProps } from "../../general/StandardProps";

interface Props extends StandardBtnProps {
  styleDisabled: boolean;
  btnText: string;
  tooltipText: string;
}

function warnOfMissingInfo() {
  toast.info("Please fill in the missing information.");
}

export function FinishBtn({
  styleDisabled,
  onClick,
  className,
  btnText,
  tooltipText,
}: Props) {
  return (
    <BtnTooltip
      {...{
        className: `FinishBtn-root ${className ?? ""}`,
        title: styleDisabled ? tooltipText : "",
        onClick: styleDisabled ? warnOfMissingInfo : undefined,
      }}
    >
      <Styled
        {...{
          className: "FinishBtn-btn",
          $styleDisabled: styleDisabled,
          text: btnText,
          onClick: styleDisabled ? undefined : onClick,
        }}
      />
    </BtnTooltip>
  );
}

const Styled = styled(HollowBtn)<{ $styleDisabled?: boolean }>`
  .FinishBtn-btn {
    height: 50px;
    width: 100%;
    margin: ${theme.flexElementSpacing};
    margin-top: ${theme.s3};
    font-size: ${theme.titleSize};

    ${({ $styleDisabled }) =>
      $styleDisabled &&
      css`
        border-color: ${theme["gray-400"]};
        color: ${theme["gray-500"]};
        :hover {
          cursor: default;
          background: ${theme.light};
          border-color: ${theme["gray-400"]};
          color: ${theme["gray-500"]};
        }
      `}
  }
`;
