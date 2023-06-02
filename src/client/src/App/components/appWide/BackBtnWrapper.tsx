import React from "react";
import { IoChevronBack } from "react-icons/io5";
import { Text, View } from "react-native";
import { nativeTheme } from "../../theme/nativeTheme";
import { GoToPageValue, useGoToPage } from "../customHooks/useGoToPage";
import { PlainIconBtn } from "../general/PlainIconBtn";
import { Row } from "../general/Row";

interface Props {
  children: React.ReactNode;
  to: GoToPageValue;
  label: string;
}
export function BackBtnWrapper({ children, to, label }: Props) {
  const goToPage = useGoToPage(to);
  return (
    <View
      style={{
        width: "100%",
        maxWidth: 828,
        flex: 1,
        alignItems: "flex-start",
      }}
    >
      <PlainIconBtn
        {...{
          sx: { marginBottom: nativeTheme.s4 },
          onClick: goToPage,
          middle: (
            <Row>
              <IoChevronBack size={25} color={nativeTheme["gray-700"]} />
              <Text
                style={{
                  fontSize: nativeTheme.fs20,
                  color: nativeTheme["gray-700"],
                }}
              >
                {label}
              </Text>
            </Row>
          ),
        }}
      />
      {children}
    </View>
  );
}
