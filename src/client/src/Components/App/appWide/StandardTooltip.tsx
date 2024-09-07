import { Tooltip } from "@mui/material";
import theme from "../../../theme/Theme";

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
          modifiers: [
            {
              name: "flip",
              enabled: false,
            },
            {
              name: "offset",
              offset: "0px, -10px",
              enabled: true,
            },
          ],
        },
      }}
      arrow
    >
      {children}
    </Tooltip>
  );
}
