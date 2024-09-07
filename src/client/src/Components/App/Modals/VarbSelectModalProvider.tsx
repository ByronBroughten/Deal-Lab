import { EditorState } from "draft-js";
import React from "react";
import { FeVarbInfo } from "../../../sharedWithServer/StateGetters/Identifiers/FeInfo";
import { ValueInEntityInfo } from "../../../sharedWithServer/StateGetters/Identifiers/ValueInEntityInfo";
import { DealMode } from "../../../sharedWithServer/stateSchemas/StateValue/dealMode";
import { timeS } from "../../../sharedWithServer/utils/timeS";
import { StrictOmit } from "../../../sharedWithServer/utils/types";
import { SetEditorState } from "../../../utils/DraftS";
import { useDealModeContext } from "../customContexts/dealModeContext";

interface EditorOptions {
  editorState: EditorState;
  setEditorState: SetEditorState;
}

export type ModalOnVarbSelect = (
  props: ValueInEntityInfo & EditorOptions
) => void;
export type ModalViewWindow = (props: EditorOptions) => React.ReactNode;

export interface VarbSelectModalOptions {
  dealMode: DealMode<"plusMixed">;
  onVarbSelect: ModalOnVarbSelect;
  viewWindow: ModalViewWindow;
  timeSet: number;
  editorState?: EditorState;
  editorVarbInfo?: FeVarbInfo;
}

type EditorProps = {
  editorState?: EditorState;
  varbInfo?: FeVarbInfo;
};

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

export const useDealModeContextVarbSelectModal = (
  onVarbSelect: ModalOnVarbSelect,
  viewWindow: ModalViewWindow,
  editorProps?: EditorProps
) => {
  const dealMode = useDealModeContext();
  const { setModal } = useVarbSelectModal();
  return () =>
    setModal({
      dealMode,
      onVarbSelect,
      viewWindow,
      ...(editorProps && {
        editorState: editorProps.editorState,
        editorVarbInfo: editorProps.varbInfo,
      }),
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
