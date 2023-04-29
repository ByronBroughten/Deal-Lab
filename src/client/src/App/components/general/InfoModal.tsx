import React from "react";
import { StyleSheet, Text } from "react-native";
import theme from "../../theme/Theme";
import { ModalSection } from "../appWide/ModalSection";

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: theme.dark,
  },
});

export interface InfoModalProps {
  showModal: boolean;
  closeModal: () => void;
  title: React.ReactNode;
  infoText: string;
}
export function InfoModal({ infoText, showModal, ...rest }: InfoModalProps) {
  return (
    <ModalSection
      {...{
        ...rest,
        show: showModal,
        modalSectionProps: { sx: { maxWidth: 600 } },
      }}
    >
      <Text style={styles.text}>{infoText}</Text>
    </ModalSection>
  );
}
