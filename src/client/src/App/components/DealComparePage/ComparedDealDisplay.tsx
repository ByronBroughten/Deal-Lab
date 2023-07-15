import { Box, SxProps } from "@mui/material";
import { Text, View } from "react-native";
import { outputListName } from "../../sharedWithServer/defaultMaker/makeDefaultOutputSection";
import { useGetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useGetterSection";
import { nativeTheme } from "../../theme/nativeTheme";
import { arrSx } from "../../utils/mui";
import { MuiRow } from "../general/MuiRow";
import { icons } from "../Icons";

type Props = {
  feId: string;
  sx?: SxProps;
};
export function ComparedDealDisplay({ feId, sx }: Props) {
  const menu = useGetterSectionOnlyOne("dealCompareMenu");
  const cache = useGetterSectionOnlyOne("dealCompareCache");

  const dealSystem = cache.child({ childName: "comparedDealSystem", feId });

  const dealMode = menu.valueNext("dealMode");
  const listName = outputListName(dealMode);
  const outputList = menu.onlyChild(listName);
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
          padding: nativeTheme.comparedDealRoot.padding,
          paddingBottom: 0,
          borderRadius: nativeTheme.br0,
        },
        ...arrSx(sx),
      ]}
    >
      <View style={{ height: nativeTheme.comparedDealHead.height }}>
        <View
          style={{
            flex: 1,
            paddingTop: nativeTheme.s3,
            paddingBottom: nativeTheme.s25,
            alignItems: "center",
            justifyContent: "flex-start",
            maxWidth: 200,
          }}
        >
          <MuiRow
            sx={{ flexDirection: "column", justifyContent: "space-between" }}
          >
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
            {icons[deal.valueNext("dealMode")]({
              size: 25,
              style: {
                marginLeft: nativeTheme.s2,
                color: nativeTheme.darkBlue.main,
              },
            })}
          </MuiRow>
        </View>
      </View>
      {compareValues.map((compareValue) => {
        const info = compareValue.valueEntityInfo();
        const varb = dealSystem.varbByFocalMixed(info);
        return (
          <View
            key={compareValue.feId}
            style={{
              height: nativeTheme.comparedDealValue.height,
              padding: nativeTheme.s2,
              paddingTop: nativeTheme.s4,
              paddingBottom: nativeTheme.s4,
              ...nativeTheme.formSection,
            }}
          >
            <View style={{ alignItems: "center" }}>
              <Text
                numberOfLines={1}
                style={{ color: nativeTheme.primary.main, fontSize: 16 }}
              >
                {varb.inputLabel}
              </Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text numberOfLines={1} style={{ fontSize: 16 }}>
                {varb.displayVarb()}
              </Text>
            </View>
          </View>
        );
      })}
    </Box>
  );
}
