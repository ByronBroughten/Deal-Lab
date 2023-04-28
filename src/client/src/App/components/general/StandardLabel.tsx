import { FormLabel, SxProps } from "@mui/material";
import { nativeTheme } from "../../theme/nativeTheme";
import { arrSx } from "../../utils/mui";
import { StandardProps } from "../general/StandardProps";

type Props = StandardProps & { sx?: SxProps; id?: string };
export default function StandardLabel({ sx, className, ...props }: Props) {
  return (
    <FormLabel
      {...{
        className,
        sx: [
          {
            m: 0,
            p: 0,
            color: nativeTheme.primary.main,
            fontSize: 20,
          },
          ...arrSx(sx),
        ],
        ...props,
      }}
    />
  );
}
