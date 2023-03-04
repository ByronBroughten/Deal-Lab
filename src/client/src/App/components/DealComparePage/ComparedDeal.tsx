import { Text, View, ViewStyle } from "react-native";
import styled from "styled-components";
import {
  useGetterSection,
  useGetterSectionMulti,
} from "../../sharedWithServer/stateClassHooks/useGetterSection";
import { nativeTheme } from "../../theme/nativeTheme";
import theme from "../../theme/Theme";
import { RemoveSectionXBtn } from "../appWide/RemoveSectionXBtn";

type Props = {
  feId: string;
  compareValueFeIds: string[];
  style?: ViewStyle;
};
export function ComparedDeal({ feId, compareValueFeIds, style }: Props) {
  const compareValues = useGetterSectionMulti(
    "compareValue",
    compareValueFeIds
  );

  const dealPage = useGetterSection({ sectionName: "dealPage", feId });
  const deal = dealPage.onlyChild("deal");
  return (
    <View
      style={{
        ...nativeTheme.mainSection.main,
        padding: nativeTheme.s3,
        ...style,
      }}
    >
      <StyledRmSectionBtn
        {...{
          ...dealPage.feInfo,
          style: {
            borderRadius: nativeTheme.br0,
          },
        }}
      />
      <View
        style={{
          flex: 1,
          paddingTop: nativeTheme.s25,
          paddingBottom: nativeTheme.s25,
          alignItems: "center",
          justifyContent: "center",
          maxWidth: 200,
          height: 56,
        }}
      >
        <Text
          numberOfLines={2}
          style={{
            lineHeight: nativeTheme.fs20,
            fontSize: nativeTheme.fs18,
            color: nativeTheme.primary.main,
          }}
        >
          {deal.valueNext("displayName").mainText}
        </Text>
      </View>
      {compareValues.map((compareValue) => {
        const info = compareValue.valueEntityInfo();
        const varb = dealPage.varbByFocalMixed(info);
        return (
          <View
            key={compareValue.feId}
            style={{
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

const StyledRmSectionBtn = styled(RemoveSectionXBtn)`
  border: solid 1px ${theme["gray-400"]};

  :hover {
    background-color: ${theme.info.main};
    color: ${theme.light};
  }
`;
