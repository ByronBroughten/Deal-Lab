import { Box, SxProps } from "@mui/material";
import { useGetterSectionOnlyOne } from "../../stateClassHooks/useGetterSection";
import { nativeTheme } from "../../theme/nativeTheme";
import { arrSx } from "../../utils/mui";
import { icons } from "../Icons";
import { RemoveSectionXBtn } from "../appWide/RemoveSectionXBtn";
import { MuiRow } from "../general/MuiRow";

type Props = {
  feId: string;
  sx?: SxProps;
};
export function ComparedDealEdit({ feId, sx }: Props) {
  const menu = useGetterSectionOnlyOne("dealCompareMenu");
  const comparedDeal = menu.child({ childName: "comparedDeal", feId });

  const session = useGetterSectionOnlyOne("sessionStore");
  const sessionDeal = session.childByDbId({
    childName: "dealMain",
    dbId: comparedDeal.dbId,
  });

  const displayName = sessionDeal.valueNext("displayName");
  const dealMode = sessionDeal.valueNext("dealMode");

  return (
    <Box
      sx={[
        {
          ...nativeTheme.subSection.borderLines,
          minWidth: nativeTheme.comparedDeal.width,
          padding: nativeTheme.s25,
          width: "300px",
        },
        ...arrSx(sx),
      ]}
    >
      <Box>
        <Box>
          <MuiRow sx={{ justifyContent: "flex-end" }}>
            <RemoveSectionXBtn {...comparedDeal.feInfo} />
          </MuiRow>
          <MuiRow>
            {icons[dealMode]({
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
