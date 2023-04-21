import React from "react";
import styled from "styled-components";
import { useToggleView } from "../../modules/customHooks/useToggleView";
import { nativeTheme } from "../../theme/nativeTheme";
import { PlainIconBtn } from "../general/PlainIconBtn";
import { icons } from "../Icons";
import { ModalText } from "./ModalText";

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
  const { infoIsOpen, closeInfo, openInfo } = useToggleView("info", false);
  return (
    <Styled className={`LabelWithInfo-root ${className ?? ""}`}>
      <span>{label}</span>
      <PlainIconBtn
        onClick={openInfo}
        middle={icons.info({
          size: 22,
          style: {
            marginLeft: nativeTheme.s2,
            color: nativeTheme.complementary.main,
          },
        })}
      />
      <ModalText
        {...{
          show: infoIsOpen,
          closeModal: closeInfo,
          className: "LabelWithInfo-infoModal",
          title: infoTitle,
        }}
      >
        {infoText}
      </ModalText>
    </Styled>
  );
}

const Styled = styled.div`
  display: flex;
  align-items: center;

  .LabelWithInfo-infoModal {
    .ModalSection-mainSection {
      max-width: 600px;
    }
  }
`;
