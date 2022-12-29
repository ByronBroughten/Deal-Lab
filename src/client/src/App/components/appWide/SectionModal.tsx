import { AiOutlineClose } from "react-icons/ai";
import styled from "styled-components";
import useOnOutsideClickRef from "../../modules/customHooks/useOnOutsideClickRef";
import { ModalWrapper, ModalWrapperProps } from "../general/ModalWrapper";
import PlainIconBtn from "../general/PlainIconBtn";
import { MainSection } from "./GeneralSection/MainSection";
import { SectionTitleRow } from "./GeneralSection/MainSection/SectionTitleRow";

interface Props extends ModalWrapperProps {
  closeModal: () => void;
}
export function SectionModal({ children, className, closeModal, show }: Props) {
  const modalRef = useOnOutsideClickRef(closeModal);
  return (
    <Styled {...{ show }} className={`SectionModal-root ${className ?? ""}`}>
      <div className="SectionModal-refDiv" ref={modalRef}>
        <MainSection className="SectionModal-mainSection">
          <SectionTitleRow
            sectionTitle={`Load Property`}
            rightSide={
              <PlainIconBtn onClick={closeModal}>
                <AiOutlineClose />
              </PlainIconBtn>
            }
          />
          <div className="MainSectionBody-root">{children}</div>
        </MainSection>
      </div>
    </Styled>
  );
}

const Styled = styled(ModalWrapper)`
  .SectionModal-mainSection {
    min-width: 250px;
  }
`;
