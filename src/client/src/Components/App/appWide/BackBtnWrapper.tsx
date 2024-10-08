import { Box, SxProps } from "@mui/material";
import React from "react";
import { IoChevronBack } from "react-icons/io5";
import { arrSx } from "../../../modules/utils/mui";
import { nativeTheme } from "../../../theme/nativeTheme";
import { PlainIconBtn } from "../../general/PlainIconBtn";
import { Row } from "../../general/Row";
import { TextNext } from "../../general/TextNext";
import { GoToPageValue, useGoToPage } from "../customHooks/useGoToPage";

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
              <TextNext
                children={label}
                sx={{
                  fontSize: nativeTheme.fs20,
                  color: nativeTheme["gray-700"],
                }}
              />
            </Row>
          ),
        }}
      />
      {children}
    </Box>
  );
}
