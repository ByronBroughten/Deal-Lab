import React from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { Text } from "react-native";
import styled from "styled-components";
import { useToggleViewNext } from "../../modules/customHooks/useToggleView";
import theme from "../../theme/Theme";
import { PlainIconBtn } from "../general/PlainIconBtn";
import { SectionModal } from "./SectionModal";

type Props = {
  label: React.ReactNode;
  infoTitle: React.ReactNode;
  infoText: string;
  className?: string;
};
export function LabelWithInfo({
  label,
  infoTitle,
  className,
  infoText,
}: Props) {
  const { infoIsOpen, closeInfo, openInfo } = useToggleViewNext("info", false);
  return (
    <Styled className={`LabelWithInfo-root ${className ?? ""}`}>
      <span>{label}</span>
      <PlainIconBtn
        onClick={openInfo}
        middle={
          <AiOutlineInfoCircle size={20} className="LabelWithInfo-infoCircle" />
        }
      />
      <SectionModal
        {...{
          show: infoIsOpen,
          closeModal: closeInfo,
          className: "LabelWithInfo-infoModal",
          title: infoTitle,
        }}
      >
        <Text>{infoText}</Text>
      </SectionModal>
    </Styled>
  );
}

const Styled = styled.span`
  display: flex;
  align-items: flex-end;
  .LabelWithInfo-infoCircle {
    margin-left: ${theme.s2};
  }

  .LabelWithInfo-infoModal {
    .SectionModal-mainSection {
      max-width: 600px;
    }
  }
`;
