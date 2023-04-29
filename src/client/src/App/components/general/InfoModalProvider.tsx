import React from "react";
import { timeS } from "../../sharedWithServer/utils/timeS";
import { StrictOmit } from "../../sharedWithServer/utils/types";
import { InfoModal, InfoModalProps } from "./InfoModal";

export type InfoModalOptions = StrictOmit<
  InfoModalProps,
  "showModal" | "closeModal"
>;
const InfoModalContext = React.createContext<
  (options: InfoModalOptions) => void
>(() => {});

export const useInfoModal = () => React.useContext(InfoModalContext);

type Props = { children: React.ReactNode };
export function InfoModalProvider({ children }: Props) {
  const [infoModalState, setInfoModalState] =
    React.useState<InfoModalOptions | null>(null);

  const openTimeRef = React.useRef(0);
  const openInfoModal = (options: InfoModalOptions) => {
    openTimeRef.current = timeS.now();
    setInfoModalState(options);
  };

  return (
    <>
      <InfoModalContext.Provider value={openInfoModal} children={children} />
      <InfoModal
        {...{
          showModal: Boolean(infoModalState),
          closeModal: () => {
            if (
              openTimeRef.current &&
              openTimeRef.current < timeS.now() - 200
            ) {
              setInfoModalState(null);
            }
          },
          title: "",
          infoText: "",
          ...infoModalState,
        }}
      />
    </>
  );
}
