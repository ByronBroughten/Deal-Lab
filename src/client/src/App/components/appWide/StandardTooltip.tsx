import { Tooltip } from "@material-ui/core";

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
        typeof title === "string" ? (
          <span style={{ fontSize: ".8rem" }} className="StandardToolTip-title">
            {title}
          </span>
        ) : (
          title
        )
      }
      placement="top-end"
      PopperProps={{
        popperOptions: {
          modifiers: {
            flip: { enabled: false },
            offset: {
              enabled: true,
              offset: "0px, -12px",
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
