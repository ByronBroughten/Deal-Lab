import { AiOutlineClose } from "react-icons/ai";
import styled from "styled-components";
import useOnOutsideClickRef from "../../modules/customHooks/useOnOutsideClickRef";
import theme from "../../theme/Theme";
import { ModalWrapper, ModalWrapperProps } from "../general/ModalWrapper";
import { PlainIconBtn } from "../general/PlainIconBtn";
import { MainSection } from "./GeneralSection/MainSection";
import { SectionTitleRow } from "./GeneralSection/MainSection/SectionTitleRow";
import { SectionTitle } from "./SectionTitle";

export interface ModalSectionProps extends ModalWrapperProps {
  closeModal: () => void;
  title: React.ReactNode;
}
export function ModalSection({
  children,
  className,
  closeModal,
  title,
  show,
}: ModalSectionProps) {
  const modalRef = useOnOutsideClickRef(closeModal);
  return (
    <Styled {...{ show }} className={`ModalSection-root ${className ?? ""}`}>
      <div className="ModalSection-refDiv" ref={modalRef}>
        <MainSection className="ModalSection-mainSection">
          <SectionTitleRow
            leftSide={
              <SectionTitle
                className="ModalSection-sectionTitle"
                text={title}
              />
            }
            rightSide={
              <PlainIconBtn middle={<AiOutlineClose />} onClick={closeModal} />
            }
          />
          <div className="ModalSection-content">{children}</div>
        </MainSection>
      </div>
    </Styled>
  );
}

const Styled = styled(ModalWrapper)`
  .ModalSection-mainSection {
    min-width: 250px;
  }

  .ModalSection-content {
    margin-top: ${theme.s3};
  }
`;
