import { Text, View, ViewStyle } from "react-native";
import { useGetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useGetterSection";
import { nativeTheme } from "../../theme/nativeTheme";
import { CompareDealRmBtn } from "./CompareDealRmBtn";

type Props = {
  feId: string;
  style?: ViewStyle;
};
export function ComparedDeal({ feId, style }: Props) {
  const compareSection = useGetterSectionOnlyOne("compareSection");
  const dealSystem = compareSection.child({
    childName: "comparedDealSystem",
    feId,
  });

  const compareValues = compareSection.children("compareValue");
  const deal = dealSystem.onlyChild("deal");
  return (
    <View
      style={{
        ...nativeTheme.subSection.borderLines,
        minWidth: nativeTheme.comparedDeal.width,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        padding: nativeTheme.comparedDealRoot.padding,
        paddingBottom: 0,
        ...style,
      }}
    >
      <View style={{ height: nativeTheme.comparedDealHead.height }}>
        <CompareDealRmBtn {...dealSystem.feInfo} />
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
          <Text
            numberOfLines={4}
            style={{
              lineHeight: nativeTheme.fs20,
              fontSize: nativeTheme.fs18,
              color: nativeTheme.primary.main,
            }}
          >
            {deal.valueNext("displayName").mainText}
          </Text>
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
                {varb.displayName}
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
    </View>
  );
}
