import { Box, SxProps } from "@mui/material";
import { useGetterSectionOnlyOne } from "../../../modules/stateHooks/useGetterSection";
import { arrSx } from "../../../modules/utils/mui";
import { nativeTheme } from "../../../theme/nativeTheme";
import { Column } from "../../general/Column";
import { MuiRow } from "../../general/MuiRow";
import { TextNext } from "../../general/TextNext";
import { icons } from "../Icons";

type Props = {
  feId: string;
  sx?: SxProps;
};
export function ComparedDealDisplay({ feId, sx }: Props) {
  const menu = useGetterSectionOnlyOne("dealCompareMenu");
  const cache = useGetterSectionOnlyOne("dealCompareCache");

  const dealSystem = cache.child({ childName: "comparedDealSystem", feId });
  const outputList = menu.onlyChild("outputList");
  const compareValues = outputList.children("outputItem");
  const deal = dealSystem.onlyChild("deal");
  const displayName = deal.valueNext("displayName").mainText;
  return (
    <Box
      sx={[
        {
          ...nativeTheme.subSection.borderLines,
          minWidth: nativeTheme.comparedDeal.width,
          minHeight: 400,
          padding: nativeTheme.s4,
          paddingBottom: 0,
          borderRadius: nativeTheme.br0,
          boxShadow: nativeTheme.oldShadow1,
        },
        ...arrSx(sx),
      ]}
    >
      <Box sx={{ height: 85 }}>
        <MuiRow
          sx={{
            alignItems: "flex-start",
            flexWrap: "nowrap",
            maxWidth: 200,
          }}
        >
          {icons[deal.valueNext("dealMode")]({
            size: 25,
            style: {
              marginLeft: nativeTheme.s2,
              color: nativeTheme.darkBlue.main,
            },
          })}
          <MuiRow
            sx={{
              marginLeft: nativeTheme.s4,
              flex: 1,
            }}
          >
            <Box
              sx={{
                fontSize: nativeTheme.fs20,
                color: nativeTheme.primary.main,
                paddingRight: nativeTheme.s3,
                ...(!displayName && {
                  fontStyle: "italic",
                }),
              }}
            >
              {displayName || "Untitled"}
            </Box>
          </MuiRow>
        </MuiRow>
      </Box>
      {compareValues.map((compareValue) => {
        const info = compareValue.valueEntityInfo();
        const varb = dealSystem.varbByFocalMixed(info);
        return (
          <Box
            key={compareValue.feId}
            style={{
              height: nativeTheme.comparedDealValue.height,
              padding: nativeTheme.s2,
              paddingTop: nativeTheme.s4,
              paddingBottom: nativeTheme.s4,
              ...nativeTheme.formSection,
            }}
          >
            <Column sx={{ alignItems: "center" }}>
              <TextNext
                // numberOfLines={1}
                sx={{ color: nativeTheme.primary.main, fontSize: 16 }}
              >
                {varb.inputLabel}
              </TextNext>
            </Column>
            <Column sx={{ alignItems: "center" }}>
              <TextNext sx={{ fontSize: 16 }}>
                {varb.displayValue === "N/A" ? "N/A" : varb.displayVarb()}
              </TextNext>
            </Column>
          </Box>
        );
      })}
    </Box>
  );
}
