import { Box, SxProps } from "@mui/material";
import { AiOutlineClose } from "react-icons/ai";
import useOnOutsideClickRef from "../../modules/customHooks/useOnOutsideClickRef";
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
export function ModalSection({
  children,
  className,
  closeModal,
  title,
  show,
  modalSectionProps,
}: ModalSectionProps) {
  const modalRef = useOnOutsideClickRef(closeModal);
  return (
    <ModalWrapper
      {...{ show }}
      className={`ModalSection-root ${className ?? ""}`}
    >
      <div ref={modalRef}>
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
              <PlainIconBtn middle={<AiOutlineClose />} onClick={closeModal} />
            }
          />
          <Box sx={{ mt: nativeTheme.s3 }}>{children}</Box>
        </MainSection>
      </div>
    </ModalWrapper>
  );
}
