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
      {dealSystemIds.map((feId) => (
        <ComparedDealEdit
          {...{
            key: feId,
            feId,
            sx: { borderBottom: "none" },
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
