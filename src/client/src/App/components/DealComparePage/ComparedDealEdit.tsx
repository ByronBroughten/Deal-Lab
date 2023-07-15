import { Box, SxProps } from "@mui/material";
import { useGetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useGetterSection";
import { nativeTheme } from "../../theme/nativeTheme";
import { arrSx } from "../../utils/mui";
import { RemoveSectionXBtn } from "../appWide/RemoveSectionXBtn";
import { MuiRow } from "../general/MuiRow";
import { icons } from "../Icons";

type Props = {
  feId: string;
  sx?: SxProps;
};
export function ComparedDealEdit({ feId, sx }: Props) {
  const cache = useGetterSectionOnlyOne("dealCompareCache");
  const dealSystem = cache.child({ childName: "comparedDealSystem", feId });

  const deal = dealSystem.onlyChild("deal");
  const displayName = deal.valueNext("displayName").mainText;
  return (
    <Box
      sx={[
        {
          ...nativeTheme.subSection.borderLines,
          minWidth: nativeTheme.comparedDeal.width,
          borderRadius: nativeTheme.muiBr0,
          padding: nativeTheme.s25,
          width: "300px",
        },
        ...arrSx(sx),
      ]}
    >
      <Box>
        <Box>
          <MuiRow
            sx={{
              justifyContent: "flex-end",
            }}
          >
            <RemoveSectionXBtn {...dealSystem.feInfo} />
          </MuiRow>
          <MuiRow>
            {icons[deal.valueNext("dealMode")]({
              size: 25,
              style: {
                marginLeft: nativeTheme.s2,
                color: nativeTheme.darkBlue.main,
              },
            })}
            <MuiRow sx={{ marginLeft: nativeTheme.s2 }}>
              <Box
                sx={{
                  fontSize: nativeTheme.fs20,
                  color: nativeTheme.primary.main,
                  ...(!displayName && {
                    fontStyle: "italic",
                    paddingRight: nativeTheme.s2,
                  }),
                }}
              >
                {displayName || "Untitled"}
              </Box>
            </MuiRow>
          </MuiRow>
        </Box>
      </Box>
    </Box>
  );
}
