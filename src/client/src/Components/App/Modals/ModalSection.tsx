import { Box, ClickAwayListener, SxProps } from "@mui/material";
import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import { arrSx } from "../../../modules/utils/mui";
import { nativeTheme } from "../../../theme/nativeTheme";
import ChunkTitle from "../../general/ChunkTitle";
import { ModalWrapper, ModalWrapperProps } from "../../general/ModalWrapper";
import { PlainIconBtn } from "../../general/PlainIconBtn";
import { MainSection } from "../appWide/GeneralSection/MainSection";
import { SectionTitleRow } from "../appWide/GeneralSection/MainSection/SectionTitleRow";
import { useIsDevices } from "../customHooks/useMediaQueries";
import { FinishBtn } from "../Main/ActiveDealRoutes/ActiveDealStuff/FinishBtn";

export interface ModalSectionProps extends ModalWrapperProps {
  closeModal: () => void;
  title: React.ReactNode;
  modalWrapperProps?: { sx?: SxProps };
  modalSectionProps?: { sx?: SxProps };
  titleSx?: SxProps;
  showFinish?: boolean;
  topChild?: React.ReactNode;
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
  showFinish,
  topChild,
}: ModalSectionProps) {
  const { isPhone } = useIsDevices();
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
                  maxWidth: "95vw",
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
              leftSide={
                topChild || <ChunkTitle sx={titleSx} children={title} />
              }
              rightSide={
                <PlainIconBtn
                  sx={{
                    ml: nativeTheme.s3,
                    ...(isPhone && {
                      marginTop: nativeTheme.s2,
                      marginRight: nativeTheme.s2,
                    }),
                  }}
                  middle={<AiOutlineClose size={20} />}
                  onClick={closeModal}
                />
              }
            />
            {topChild && <ChunkTitle sx={titleSx} children={title} />}
            <Box sx={{ mt: nativeTheme.s3, mb: nativeTheme.s3 }}>
              {children}
            </Box>
            {showFinish && (
              <FinishBtn
                {...{
                  btnText: "Finish",
                  onClick: closeModal,
                  sx: {
                    marginTop: nativeTheme.s4,
                    height: "35px",
                  },
                }}
              />
            )}
          </MainSection>
        </div>
      </ClickAwayListener>
    </ModalWrapper>
  );
}
