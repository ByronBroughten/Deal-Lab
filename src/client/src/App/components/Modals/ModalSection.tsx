import { Box, ClickAwayListener, SxProps } from "@mui/material";
import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import { nativeTheme } from "../../theme/nativeTheme";
import { arrSx } from "../../utils/mui";
import { MainSection } from "../appWide/GeneralSection/MainSection";
import { SectionTitleRow } from "../appWide/GeneralSection/MainSection/SectionTitleRow";
import ChunkTitle from "../general/ChunkTitle";
import { ModalWrapper, ModalWrapperProps } from "../general/ModalWrapper";
import { PlainIconBtn } from "../general/PlainIconBtn";

export interface ModalSectionProps extends ModalWrapperProps {
  closeModal: () => void;
  title: React.ReactNode;
  modalWrapperProps?: { sx?: SxProps };
  modalSectionProps?: { sx?: SxProps };
  titleSx?: SxProps;
}

export function ModalSection({
  children,
  className,
  closeModal,
  title,
  show,
  modalWrapperProps,
  modalSectionProps,
  titleSx,
}: ModalSectionProps) {
  return (
    <ModalWrapper {...{ show, ...modalWrapperProps }} className={className}>
      <ClickAwayListener mouseEvent="onMouseDown" onClickAway={closeModal}>
        <div>
          <MainSection
            {...{
              className: "ModalSection-mainSection",
              ...modalSectionProps,
              sx: [{ minWidth: 250 }, ...arrSx(modalSectionProps?.sx)],
            }}
          >
            <SectionTitleRow
              leftSide={<ChunkTitle sx={titleSx} children={title} />}
              rightSide={
                <PlainIconBtn
                  sx={{ ml: nativeTheme.s3 }}
                  middle={<AiOutlineClose />}
                  onClick={closeModal}
                />
              }
            />
            <Box sx={{ mt: nativeTheme.s3 }}>{children}</Box>
          </MainSection>
        </div>
      </ClickAwayListener>
    </ModalWrapper>
  );
}
