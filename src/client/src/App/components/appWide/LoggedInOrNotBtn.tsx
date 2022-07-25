import { auth } from "../../modules/services/authService";
import { StandardBtnProps } from "../general/StandardProps";
import BtnTooltip from "./BtnTooltip";
import { IconBtn } from "./IconBtn";

type TooltipProps = {
  title?: string;
  className?: string;
};
type ScenarioProps = {
  btnProps?: StandardBtnProps;
  tooltipProps?: TooltipProps;
};
type Scenarios = "loggedIn" | "loggedOut" | "shared";
type Props = {
  [S in Scenarios]: ScenarioProps;
};

export function LoggedInOrOutIconBtn({ loggedIn, loggedOut, shared }: Props) {
  return auth.isToken ? (
    <BtnTooltip
      {...{ title: "", ...loggedIn.tooltipProps, ...shared.tooltipProps }}
    >
      <IconBtn {...{ ...loggedIn.btnProps, ...shared.btnProps }} />
    </BtnTooltip>
  ) : (
    <BtnTooltip
      {...{ title: "", ...loggedOut.tooltipProps, ...shared.tooltipProps }}
    >
      <IconBtn {...{ ...loggedOut.btnProps, ...shared.btnProps }} />
    </BtnTooltip>
  );
}
