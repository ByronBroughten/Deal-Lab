import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";

interface Props {
  [key: string]: any;
}

const ModalContext = React.createContext({
  showModal: false,
  closeModal: () => {},
  warnBeforeClose: false,
  setWarnBeforeClose: () => {},
  showWarning: false,
} as {
  showModal: boolean;
  closeModal: () => void;
  warnBeforeClose: boolean;
  setWarnBeforeClose: (value: boolean) => void;
  showWarning: boolean;
  children?: any;
});

ModalContext.displayName = "ModalContext";

const Background = styled.div<Props>`
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

export interface BigModalProps {
  showModal: boolean;
  closeModal: () => void;
  showWarning: boolean;
  setShowWarning: (value: boolean) => void;
  children?: any;
}

export function Modal({
  showModal,
  closeModal,
  showWarning,
  setShowWarning,
  children,
}: BigModalProps) {
  const modalRef = useRef();

  const [warnBeforeClose, setWarnBeforeClose] = useState(false);

  const manageCloseModal = useCallback(() => {
    if (!warnBeforeClose) {
      closeModal();
      return;
    }
    setShowWarning(true);
  }, [warnBeforeClose, closeModal, setShowWarning]);

  const closeModalBackgroundClick = (e: any) => {
    if (modalRef.current === e.target && showModal) {
      manageCloseModal();
    }
  };

  const keyPress = useCallback(
    (e) => {
      if (e.key === "Escape" && showModal) {
        manageCloseModal();
      }
    },
    [showModal, manageCloseModal]
  );

  useEffect(() => {
    document.addEventListener("keydown", keyPress);
    return () => document.removeEventListener("keydown", keyPress);
  }, [keyPress]);

  return (
    <>
      {showModal ? (
        <ModalContext.Provider
          value={{
            showModal,
            closeModal,
            warnBeforeClose,
            setWarnBeforeClose,
            showWarning,
          }}
        >
          <Background ref={modalRef} onClick={closeModalBackgroundClick}>
            {children}
          </Background>
        </ModalContext.Provider>
      ) : null}
    </>
  );
}
