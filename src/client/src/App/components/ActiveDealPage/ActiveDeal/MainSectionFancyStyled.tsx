import React from "react";
import styled, { css } from "styled-components";
import { MainSection } from "../../appWide/GeneralSection/MainSection";
import { StandardProps } from "../../general/StandardProps";

interface Props extends StandardProps {
  noInputsTitleRow: React.ReactNode;
  inputSection: React.ReactNode;
  detailsSection?: React.ReactNode;
  showInputs: boolean;
  hide: boolean;
}
export function MainSectionFancyStyled({
  noInputsTitleRow,
  detailsSection,
  inputSection,
  showInputs,
  hide,
  ...rest
}: Props) {
  return (
    <Styled
      {...{
        ...rest,
        $showInputs: showInputs,
        $hide: hide,
      }}
    >
      <div className="MainDealSection-inactiveTitleRow">{noInputsTitleRow}</div>
      {detailsSection && (
        <div className="MainDealSection-detailsDiv">{detailsSection}</div>
      )}
      <div className="MainDealSection-inputsDiv">{inputSection}</div>
    </Styled>
  );
}

const Styled = styled(MainSection)<{
  $showInputs?: boolean;
  $hide?: boolean;
}>`
  transition: all 0.2s ease-in-out;
  .MainDealSection-inactiveTitleRow {
    display: flex;
    align-items: center;
  }
  ${({ $hide }) =>
    $hide &&
    css`
      display: none;
    `}

  ${({ $showInputs }) =>
    $showInputs
      ? css`
          .MainDealSection-detailsDiv,
          .MainDealSection-inactiveTitleRow {
            display: none;
          }
        `
      : css`
          .MainDealSection-inputsDiv {
            display: none;
          }
        `}
`;
