import { Box, SxProps } from "@mui/material";
import { nativeTheme } from "../../theme/nativeTheme";
import { arrSx } from "../../utils/mui";
import { AddCompareDealBtnNext } from "./AddCompareDealBtnNext";
import { ComparedDealEdit } from "./ComparedDealEdit";

type Props = {
  dealSystemIds: string[];
  sx?: SxProps;
};
export function CompareDealsEdit({ dealSystemIds, sx }: Props) {
  return (
    <Box sx={[{ marginRight: nativeTheme.s5 }, ...arrSx(sx)]}>
      {dealSystemIds.map((feId, idx) => (
        <ComparedDealEdit
          {...{
            key: feId,
            feId,
            sx: {
              borderBottom: "none",
              ...(idx === 0 && {
                borderTopRightRadius: nativeTheme.br0,
                borderTopLeftRadius: nativeTheme.br0,
              }),
            },
          }}
        />
      ))}
      <AddCompareDealBtnNext
        {...{
          dealCount: dealSystemIds.length,
        }}
      />
    </Box>
  );
}
