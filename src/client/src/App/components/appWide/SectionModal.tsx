import { AiOutlineClose } from "react-icons/ai";
import styled from "styled-components";
import useOnOutsideClickRef from "../../modules/customHooks/useOnOutsideClickRef";
import theme from "../../theme/Theme";
import { ModalWrapper, ModalWrapperProps } from "../general/ModalWrapper";
import { PlainIconBtn } from "../general/PlainIconBtn";
import { MainSection } from "./GeneralSection/MainSection";
import { SectionTitleRow } from "./GeneralSection/MainSection/SectionTitleRow";
import { SectionTitle } from "./SectionTitle";

interface Props extends ModalWrapperProps {
  closeModal: () => void;
  title: React.ReactNode;
}
export function SectionModal({
  children,
  className,
  closeModal,
  title,
  show,
}: Props) {
  const modalRef = useOnOutsideClickRef(closeModal);
  return (
    <Styled {...{ show }} className={`SectionModal-root ${className ?? ""}`}>
      <div className="SectionModal-refDiv" ref={modalRef}>
        <MainSection className="SectionModal-mainSection">
          <SectionTitleRow
            leftSide={<SectionTitle text={title} />}
            rightSide={
              <PlainIconBtn middle={<AiOutlineClose />} onClick={closeModal} />
            }
          />
          <div className="SectionModal-content">{children}</div>
        </MainSection>
      </div>
    </Styled>
  );
}

const Styled = styled(ModalWrapper)`
  .SectionModal-mainSection {
    min-width: 250px;
  }

  .SectionModal-content {
    margin-top: ${theme.s3};
  }
`;
