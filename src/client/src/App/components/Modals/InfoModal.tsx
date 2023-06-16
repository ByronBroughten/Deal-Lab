import { SxProps } from "@mui/material";
import React from "react";
import { StyleSheet, Text } from "react-native";
import { timeS } from "../../sharedWithServer/utils/timeS";
import theme from "../../theme/Theme";
import {
  InfoModalOptions,
  InfoModalState,
  useInfoModal,
} from "./InfoModalProvider";
import { ModalSection } from "./ModalSection";

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: theme.dark,
  },
});

function getInfoModalOptions(modalState: InfoModalState): InfoModalOptions {
  return {
    title: "",
    infoText: "",
    timeSet: 0,
    ...modalState,
  };
}

interface Props {
  modalWrapperProps?: { sx?: SxProps };
}
export function InfoModal({ modalWrapperProps }: Props) {
  const { modalState, setModal } = useInfoModal();
  const { infoText, timeSet, title } = getInfoModalOptions(modalState);
  return (
    <ModalSection
      {...{
        title,
        infoText,
        show: Boolean(modalState),
        closeModal: () => {
          if (timeSet && timeSet < timeS.now() - 200) {
            setModal(null);
          }
        },
        modalSectionProps: { sx: { maxWidth: 600, zIndex: 5 } },
        modalWrapperProps,
      }}
    >
      <Text style={styles.text}>{infoText}</Text>
    </ModalSection>
  );
}
