import { FormLabel, SxProps } from "@mui/material";
import { arrSx } from "../../modules/utils/mui";
import { nativeTheme } from "../../theme/nativeTheme";
import { StandardProps } from "./StandardProps";

type Props = StandardProps & { sx?: SxProps; id?: string };
export default function ChunkTitle({ sx, className, ...props }: Props) {
  return (
    <FormLabel
      {...{
        className,
        sx: [
          {
            m: 0,
            p: 0,
            color: nativeTheme.primary.main,
            fontSize: nativeTheme.chunkTitleFs,
          },
          ...arrSx(sx),
        ],
        ...props,
      }}
    />
  );
}
