import { View } from "react-native";
import { nativeTheme } from "../../theme/nativeTheme";
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
      <View>
        {compareValueFeIds.map((feId, idx) => (
          <CompareDealRmBtn
            {...{
              sectionName: "compareValue",
              feId,
              sx: {
                borderRadius: 0,
                ...(idx == 0 && {
                  borderTopLeftRadius: nativeTheme.subSection.borderRadius,
                }),
                borderBottomWidth: 0,
                borderRightWidth: 0,
                height: nativeTheme.comparedDealValue.height,
              },
            }}
          />
        ))}
      </View>
    </View>
  );
}
