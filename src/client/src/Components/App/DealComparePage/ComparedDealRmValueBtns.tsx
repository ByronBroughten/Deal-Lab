import { View } from "react-native";
import { nativeTheme } from "../../../theme/nativeTheme";
import { DealCompareRmValueBtn } from "./CompareDealRmBtn";

type Props = { compareValueFeIds: string[] };
export function ComparedDealRmValueBtns({ compareValueFeIds }: Props) {
  return (
    <View
      style={{
        paddingTop: nativeTheme.comparedDealRoot.padding,
      }}
    >
      <View style={{ height: nativeTheme.comparedDealHead.height }} />
      <View>
        {compareValueFeIds.map((feId, idx) => (
          <DealCompareRmValueBtn
            {...{
              key: feId,
              feId,
              sx: {
                ...(idx === 0 && {
                  borderTopLeftRadius: nativeTheme.subSection.borderRadius,
                }),
              },
            }}
          />
        ))}
      </View>
    </View>
  );
}
