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
export function MainSubSectionFullStyled({
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
      <div className="MainSubSection-inactiveTitleRow">{noInputsTitleRow}</div>
      {detailsSection && (
        <div className="MainSubSection-detailsDiv">{detailsSection}</div>
      )}
      <div className="MainSubSection-inputsDiv">{inputSection}</div>
    </Styled>
  );
}

const Styled = styled(MainSection)<{
  $showInputs?: boolean;
  $hide?: boolean;
}>`
  transition: all 0.2s ease-in-out;
  .MainSubSection-inactiveTitleRow {
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
          .MainSubSection-detailsDiv,
          .MainSubSection-inactiveTitleRow {
            display: none;
          }
        `
      : css`
          .MainSubSection-inputsDiv {
            display: none;
          }
        `}
`;
