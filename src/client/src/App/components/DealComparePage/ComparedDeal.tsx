import { Text, View, ViewStyle } from "react-native";
import { outputListName } from "../../sharedWithServer/defaultMaker/makeDefaultOutputSection";
import { useGetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useGetterSection";
import { nativeTheme } from "../../theme/nativeTheme";
import { icons } from "../Icons";
import { CompareDealRmBtn } from "./CompareDealRmBtn";

type Props = {
  feId: string;
  style?: ViewStyle;
};
export function ComparedDeal({ feId, style }: Props) {
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
        <CompareDealRmBtn feId={dealSystem.feId} />
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
            numberOfLines={3}
            style={{
              lineHeight: nativeTheme.fs20,
              fontSize: nativeTheme.fs18,
              color: nativeTheme.primary.main,
              ...(!displayName && {
                fontStyle: "italic",
                paddingRight: nativeTheme.s2,
              }),
            }}
          >
            {icons[deal.valueNext("dealMode")]()} {displayName || "Untitled"}
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
    </View>
  );
}
