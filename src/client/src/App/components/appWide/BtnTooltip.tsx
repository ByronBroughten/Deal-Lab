import StandardToolTip from "./StandardTooltip";

type Props = {
  children: React.ReactElement;
  title: string | React.ReactElement;
  className?: string;
};
export default function BtnTooltip({ title, children, className }: Props) {
  return (
    <div className={`BtnTooltip-root ${className ?? ""}`}>
      <StandardToolTip title={title} className={`BtnTooltip-tooltip`}>
        <div className={`BtnTooltip-disabledBtnDiv`}>{children}</div>
      </StandardToolTip>
    </div>
  );
}
