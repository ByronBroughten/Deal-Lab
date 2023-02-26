import styled, { css } from "styled-components";
import { CompletionStatus } from "../../../sharedWithServer/SectionsMeta/values/StateValue/subStringValues";
import theme from "../../../theme/Theme";
import { FormSection } from "../../appWide/FormSection";
import { LabeledVarbProps } from "../../appWide/LabeledVarb";
import { StandardProps } from "../../general/StandardProps";
import { DealSubSectionDetails } from "./DealSubSectionDetails";
import { DealSubSectionTitleRow } from "./DealSubSectionTitleRow";
import { FinishBtn } from "./FinishBtn";
import { MainSubSectionFullStyled } from "./MainSubSectionFullStyled";

export interface MainDealSectionProps extends StandardProps {
  showInputs: boolean;
  hide: boolean;
  openInputs: () => void;
  sectionTitle: string;
  closeInputs: () => void;
  completionStatus: CompletionStatus;
  detailVarbPropArr: LabeledVarbProps[];
  displayName: string;
}

export function MainSubSectionFull({
  showInputs,
  hide,
  children,
  className,
  openInputs,
  closeInputs,
  sectionTitle,
  completionStatus = "allEmpty",
  detailVarbPropArr,
  displayName,
}: MainDealSectionProps) {
  const isCompleted = completionStatus === "allValid";
  return (
    <Styled
      {...{
        className: `MainSubSection ${className ?? ""}`,
        noInputsTitleRow: (
          <DealSubSectionTitleRow
            {...{
              completionStatus,
              openEditor: openInputs,
              sectionTitle,
            }}
          />
        ),
        detailsSection: (
          <DealSubSectionDetails
            {...{
              displayName,
              detailVarbPropArr,
            }}
          />
        ),
        inputSection: (
          <>
            {children}
            <FormSection>
              <FinishBtn
                styleDisabled={!isCompleted}
                className="MainSubSection-finishBtn"
                btnText="Finish"
                onClick={closeInputs}
                warningText="Please fill in all the required fields"
              />
            </FormSection>
          </>
        ),
        showInputs,
        hide,
        $completionStatus: completionStatus,
        $showInputs: showInputs,
        $hide: hide,
        ...(!showInputs && completionStatus !== "allValid"
          ? { onClick: openInputs }
          : {}),
      }}
    ></Styled>
  );
}

export const Styled = styled(MainSubSectionFullStyled)<{
  $showInputs?: boolean;
  $hide?: boolean;
  $completionStatus: CompletionStatus;
}>`
  ${({ $completionStatus, $showInputs }) => {
    if (!$showInputs) {
      if ($completionStatus !== "allValid") {
        return css`
          padding-top: ${theme.s25};
          padding-bottom: ${theme.s25};
          padding-right: ${theme.s25};
          .MainSubSection-detailsDiv {
            display: none;
          }
        `;
      } else if ($completionStatus === "allValid") {
      }
    }
  }}
`;
