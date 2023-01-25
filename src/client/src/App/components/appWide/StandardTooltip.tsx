import { Tooltip } from "@material-ui/core";
import theme from "../../theme/Theme";

export default function StandardToolTip({
  children,
  title,
  className,
}: {
  children: React.ReactElement;
  title: string | React.ReactElement;
  className?: string;
}) {
  return (
    <Tooltip
      className={`StandardToolTip-root ${className ?? ""}`}
      style={{ margin: "1px" }}
      title={
        title ? (
          <span
            style={{ fontSize: theme.infoSize }}
            className="StandardToolTip-title"
          >
            {title}
          </span>
        ) : (
          title
        )
      }
      placement="top"
      PopperProps={{
        popperOptions: {
          modifiers: {
            flip: { enabled: false },
            offset: {
              enabled: true,
              offset: "0px, -10px",
            },
          },
        },
      }}
      arrow
    >
      {children}
    </Tooltip>
  );
}
