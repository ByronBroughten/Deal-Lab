import { FormLabel } from "@mui/material";
import { nativeTheme } from "../../theme/nativeTheme";
import { StandardProps } from "../general/StandardProps";

type Props = StandardProps & { $active?: boolean; id?: string };
export default function StandardLabel({ className, ...props }: Props) {
  return (
    <FormLabel
      sx={{
        m: 0,
        p: 0,
        color: nativeTheme.primary.main,
        fontSize: 20,
      }}
      className={`StandardLabel-root ${className ?? ""}`}
      {...props}
    />
  );
}
