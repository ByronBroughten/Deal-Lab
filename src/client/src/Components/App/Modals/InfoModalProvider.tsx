import React from "react";
import { timeS } from "../../../sharedWithServer/utils/timeS";
import { StrictOmit } from "../../../sharedWithServer/utils/types";

export interface InfoModalOptions {
  title: React.ReactNode;
  info: string;
  moreInfoLink?: string;
  timeSet: number;
}

export type SetInfoModalOptions = StrictOmit<InfoModalOptions, "timeSet">;
type SetInfoModalProps = SetInfoModalOptions | null;
type SetModal = (options: SetInfoModalProps) => void;

export type InfoModalState = InfoModalOptions | null;

type InfoModalContextReturn = {
  modalState: InfoModalState;
  setModal: SetModal;
};

const InfoModalContext = React.createContext<InfoModalContextReturn>({
  modalState: null,
  setModal: () => {},
});

export const useInfoModal = () => React.useContext(InfoModalContext);

type Props = { children: React.ReactNode };
export function InfoModalProvider({ children }: Props) {
  const [modalState, setModalState] = React.useState<InfoModalState>(null);

  const setModal: SetModal = (options) => {
    setModalState(
      options === null
        ? null
        : {
            ...options,
            timeSet: timeS.now(),
          }
    );
  };

  return (
    <InfoModalContext.Provider value={{ modalState, setModal }}>
      {children}
    </InfoModalContext.Provider>
  );
}
