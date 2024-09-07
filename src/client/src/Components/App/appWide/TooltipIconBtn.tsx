import { StandardBtnProps } from "../../general/StandardProps";
import BtnTooltip from "./BtnTooltip";
import { IconBtn } from "./IconBtn";

type Props = {
  title?: string;
  className?: string;
} & StandardBtnProps;

export default function TooltipIconBtn({
  title = "",
  className,
  ...rest
}: Props) {
  return (
    <BtnTooltip
      {...{ title, className: `TooltipIconBtn-root ${className ?? ""}` }}
    >
      <IconBtn {...rest} />
    </BtnTooltip>
  );
}
