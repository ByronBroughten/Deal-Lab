import { Box, SxProps } from "@mui/material";
import React from "react";
import { IoChevronBack } from "react-icons/io5";
import { Text } from "react-native";
import { nativeTheme } from "../../theme/nativeTheme";
import { arrSx } from "../../utils/mui";
import { GoToPageValue, useGoToPage } from "../customHooks/useGoToPage";
import { PlainIconBtn } from "../general/PlainIconBtn";
import { Row } from "../general/Row";

interface Props {
  children: React.ReactNode;
  to: GoToPageValue;
  label: string;
  sx?: SxProps;
}
export function BackBtnWrapper({ children, to, label, sx }: Props) {
  const goToPage = useGoToPage(to);
  return (
    <Box
      sx={[
        {
          width: "100%",
          maxWidth: 800,
          flex: 1,
          alignItems: "flex-start",
        },
        ...arrSx(sx),
      ]}
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
    </Box>
  );
}
