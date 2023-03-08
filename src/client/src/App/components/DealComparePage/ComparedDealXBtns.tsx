import { View } from "react-native";
import { nativeTheme } from "../../theme/nativeTheme";
import theme from "../../theme/Theme";
import { CompareDealRmBtn } from "./CompareDealRmBtn";

type Props = { compareValueFeIds: string[] };
export function ComparedDealXBtns({ compareValueFeIds }: Props) {
  return (
    <View
      style={{
        paddingTop: nativeTheme.comparedDealRoot.padding,
      }}
    >
      <View style={{ height: nativeTheme.comparedDealHead.height }} />
      <View style={{ paddingRight: nativeTheme.s2, paddingTop: 1 }}>
        {compareValueFeIds.map((feId) => (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              height: nativeTheme.comparedDealValue.height,
              paddingTop: nativeTheme.s2,
            }}
          >
            <CompareDealRmBtn
              {...{
                sectionName: "compareValue",
                feId,
                style: {
                  border: 0,
                  flex: 1,
                  boxShadow: theme.boxShadow1,
                },
              }}
            />
          </View>
        ))}
      </View>
    </View>
  );
}
