import React from "react";
import { DealMode } from "../../sharedWithServer/SectionsMeta/values/StateValue/dealMode";
import { timeS } from "../../sharedWithServer/utils/timeS";
import { StrictOmit } from "../../sharedWithServer/utils/types";
import { useDealModeContext } from "../customContexts/dealModeContext";
import { OnVarbSelect } from "../inputs/NumObjEditor/NumObjVarbSelector/VarbSelectorCollection";

export interface VarbSelectModalOptions {
  dealMode: DealMode<"plusMixed">;
  onVarbSelect: OnVarbSelect;
  timeSet: number;
}

export type SetVarbSelectModalOptions = StrictOmit<
  VarbSelectModalOptions,
  "timeSet"
>;
type SetModalProps = SetVarbSelectModalOptions | null;
type SetModal = (options: SetModalProps) => void;

export type VarbSelectModalState = VarbSelectModalOptions | null;

type VarbSelectModalContextReturn = {
  modalState: VarbSelectModalState;
  setModal: SetModal;
};

const VarbSelectModalContext =
  React.createContext<VarbSelectModalContextReturn>({
    modalState: null,
    setModal: () => {},
  });

export const useVarbSelectModal = () =>
  React.useContext(VarbSelectModalContext);

export const useDealModeContextVarbSelect = (onVarbSelect: OnVarbSelect) => {
  const dealMode = useDealModeContext();
  const { setModal } = useVarbSelectModal();
  return () =>
    setModal({
      dealMode,
      onVarbSelect,
    });
};

type Props = { children: React.ReactNode };
export function VarbSelectModalProvider({ children }: Props) {
  const [modalState, setModalState] =
    React.useState<VarbSelectModalState>(null);

  const setModal: SetModal = (props) => {
    setModalState(
      props === null
        ? null
        : {
            ...props,
            timeSet: timeS.now(),
          }
    );
  };
  return (
    <VarbSelectModalContext.Provider value={{ modalState, setModal }}>
      {children}
    </VarbSelectModalContext.Provider>
  );
}
