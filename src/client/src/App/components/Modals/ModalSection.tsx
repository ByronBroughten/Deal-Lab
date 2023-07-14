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
              ...modalSectionProps,
              sx: [
                {
                  minWidth: 250,
                  maxHeight: "95vh",
                  overflow: "auto",
                  "&::-webkit-scrollbar": {},
                  "&::-webkit-scrollbar-track": {
                    backgroundColor: nativeTheme["gray-300"],
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: nativeTheme["gray-500"],
                    border: `1px solid ${nativeTheme["gray-300"]}`,
                  },
                },
                ...arrSx(modalSectionProps?.sx),
              ],
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
