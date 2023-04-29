import { Box } from "@mui/material";
import React from "react";
import styled from "styled-components";
import { nativeTheme } from "../../theme/nativeTheme";
import { useInfoModal } from "../general/InfoModalProvider";
import { PlainIconBtn } from "../general/PlainIconBtn";
import { icons } from "../Icons";

type Props = {
  label: React.ReactNode;
  infoTitle: React.ReactNode;
  infoText: string;
  className?: string;
};
export function LabelWithInfo({
  label,
  infoTitle,
  className,
  infoText,
}: Props) {
  const openInfoModal = useInfoModal();
  return (
    <Styled className={className}>
      <Box>{label}</Box>
      <PlainIconBtn
        onClick={() =>
          openInfoModal({
            title: infoTitle,
            infoText,
          })
        }
        middle={icons.info({
          size: 22,
          style: {
            marginLeft: nativeTheme.s2,
            color: nativeTheme.complementary.main,
          },
        })}
      />
    </Styled>
  );
}

const Styled = styled.div`
  display: flex;
  align-items: center;
  z-index: 10;
`;
