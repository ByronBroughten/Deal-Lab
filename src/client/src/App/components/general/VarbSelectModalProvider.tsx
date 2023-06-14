import React from "react";
import { timeS } from "../../sharedWithServer/utils/timeS";
import { StrictOmit } from "../../sharedWithServer/utils/types";
import { useDealModeContext } from "../customContexts/dealModeContext";
import { OnVarbSelect } from "../inputs/NumObjEditor/NumObjVarbSelector/VarbSelectorCollection";
import { VarbSelectModalProps, VarbSelectorModal } from "./VarbSelectorModal";

export type VarbSelectModalOptions = StrictOmit<
  VarbSelectModalProps,
  "modalIsOpen" | "closeModal"
>;

type ModalState = VarbSelectModalOptions | null;

const VarbSelectModalContext = React.createContext<(state: ModalState) => void>(
  () => {}
);

export const useVarbSelectModal = () =>
  React.useContext(VarbSelectModalContext);

export const useDealModeContextVarbSelect = (onVarbSelect: OnVarbSelect) => {
  const dealMode = useDealModeContext();
  const setVarbSelectModal = useVarbSelectModal();
  return () =>
    setVarbSelectModal({
      dealMode,
      onVarbSelect,
    });
};

type Props = { children: React.ReactNode };
export function VarbSelectModalProvider({ children }: Props) {
  const [modalState, setModalState] = React.useState<ModalState>(null);

  const openTimeRef = React.useRef(0);
  const openInfoModal = (state: ModalState) => {
    openTimeRef.current = timeS.now();
    setModalState(state);
  };

  const closeModal = () => {
    if (openTimeRef.current && openTimeRef.current < timeS.now() - 200) {
      setModalState(null);
    }
  };

  return (
    <>
      <VarbSelectModalContext.Provider
        value={openInfoModal}
        children={children}
      />
      <VarbSelectorModal
        {...{
          modalIsOpen: Boolean(modalState),
          closeModal,
          dealMode: "mixed",
          onVarbSelect: () => {},
          ...modalState,
        }}
      />
    </>
  );
}
