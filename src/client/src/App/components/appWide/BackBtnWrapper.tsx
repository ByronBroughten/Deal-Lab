import React from "react";
import { IoChevronBack } from "react-icons/io5";
import { Text, View } from "react-native";
import { useNavigate } from "react-router-dom";
import { nativeTheme } from "../../theme/nativeTheme";
import { PlainIconBtn } from "../general/PlainIconBtn";
import { Row } from "../general/Row";

interface Props {
  children: React.ReactNode;
}
export function BackBtnWrapper({ children }: Props) {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
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
          onClick: goBack,
          middle: (
            <Row>
              <IoChevronBack size={25} color={nativeTheme["gray-700"]} />
              <Text
                style={{
                  fontSize: nativeTheme.fs20,
                  color: nativeTheme["gray-700"],
                }}
              >
                Back
              </Text>
            </Row>
          ),
        }}
      />
      {children}
    </View>
  );
}
