import { Box, ClickAwayListener, SxProps } from "@mui/material";
import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import { nativeTheme } from "../../theme/nativeTheme";
import { arrSx } from "../../utils/mui";
import { ModalWrapper, ModalWrapperProps } from "../general/ModalWrapper";
import { PlainIconBtn } from "../general/PlainIconBtn";
import { MainSection } from "./GeneralSection/MainSection";
import { SectionTitleRow } from "./GeneralSection/MainSection/SectionTitleRow";
import { SectionTitle } from "./SectionTitle";

export interface ModalSectionProps extends ModalWrapperProps {
  closeModal: () => void;
  title: React.ReactNode;
  modalSectionProps?: { sx?: SxProps };
}

type ShowProps = {
  lastShow: boolean;
  timeOfLastShowTrue: number;
};

export function ModalSection({
  children,
  className,
  closeModal,
  title,
  show,
  modalSectionProps,
}: ModalSectionProps) {
  // const showRef = React.useRef<ShowProps>({
  //   lastShow: show,
  //   timeOfLastShowTrue:
  //     show === true ? timeS.now() : timeS.hundredsOfYearsFromNow,
  // });

  // if (showRef.current.lastShow !== show) {
  //   showRef.current.lastShow = show;
  //   if (show) {
  //     showRef.current.timeOfLastShowTrue = timeS.now();
  //   }
  // }

  // const safeClose = () => {
  //   const now = timeS.now();
  //   if (showRef.current.timeOfLastShowTrue + 200 < timeS.now()) {
  //     console.log(
  //       `Closing with now: ${now} and timeOfLastShowTrue: ${showRef.current.timeOfLastShowTrue}`
  //     );
  //     closeModal();
  //   }
  // };
  return (
    <ModalWrapper
      {...{ show }}
      className={`ModalSection-root ${className ?? ""}`}
    >
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
              leftSide={<SectionTitle text={title} />}
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
