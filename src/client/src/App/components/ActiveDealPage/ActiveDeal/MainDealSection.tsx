import { FaPlay } from "react-icons/fa";
import styled, { css } from "styled-components";
import { nativeTheme } from "../../../theme/nativeTheme";
import theme from "../../../theme/Theme";
import { CheckMarkCircle } from "../../appWide/checkMarkCircle";
import { EditSectionBtn } from "../../appWide/EditSectionBtn";
import { FormSection } from "../../appWide/FormSection";
import { LabeledVarbProps } from "../../appWide/LabeledVarb";
import { LabeledVarbRow } from "../../appWide/LabeledVarbRow";
import { SectionTitle } from "../../appWide/SectionTitle";
import { StandardProps } from "../../general/StandardProps";
import { FinishBtn } from "./FinishBtn";
import { MainSectionFancyStyled } from "./MainSectionFancyStyled";
import { MainSectionLargeEditBtn } from "./MainSectionLargeEditBtn";

export type CompletionStatus = "allEmpty" | "allValid" | "someInvalid";

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

const completionStatusProps = {
  allEmpty: { btnTitleStart: "Start " },
  someInvalid: { btnTitleStart: "Continue " },
  allValid: { btnTitleStart: "Edit " },
};

export function MainDealSection({
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
  const btnText = completionStatus === "allEmpty" ? "Start" : "Continue";
  return (
    <Styled
      {...{
        className: `MainDealSection ${className ?? ""}`,
        noInputsTitleRow: (
          <>
            <CheckMarkCircle
              {...{
                checked: isCompleted,
                className: "MainDealSection-checkmarkCircle",
              }}
            />
            <SectionTitle
              className="MainDealSection-showInputsTitle"
              text={sectionTitle}
            />
            <MainSectionLargeEditBtn
              {...{
                className: "MainDealSection-startBtn",
                middle: btnText,
                right: <FaPlay className="MainDealSection-startIcon" />,
                onClick: openInputs,
              }}
            />
            {isCompleted && (
              <EditSectionBtn
                className="MainDealSection-editBtn"
                onClick={openInputs}
              />
            )}
          </>
        ),
        detailsSection: (
          <>
            <div className="MainDealSection-displayNameDiv">{displayName}</div>
            <LabeledVarbRow
              {...{
                varbPropArr: detailVarbPropArr,
                className: "MainDealSection-labeledVarbRow",
              }}
            />
          </>
        ),
        inputSection: (
          <>
            {children}
            <FormSection>
              <FinishBtn
                styleDisabled={!isCompleted}
                className="MainDealSection-finishBtn"
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

export const Styled = styled(MainSectionFancyStyled)<{
  $showInputs?: boolean;
  $hide?: boolean;
  $completionStatus: CompletionStatus;
}>`
  .MainDealSection-checkmarkCircle {
    margin-right: ${theme.s3};
  }
  .MainDealSection-startIcon {
    margin-left: ${theme.s15};
  }
  .MainDealSection-displayNameDiv {
    margin-top: ${theme.s25};
    font-size: ${theme.smallTitleSize};
  }
  .MainDealSection-labeledVarbRow {
    margin-top: ${theme.s25};
    margin-left: -${theme.s25};
    .LabeledVarb-label,
    .LabeledVarb-output {
      font-size: ${theme.infoSize};
    }
  }
  .MainDealSection-editBtn {
    margin-left: ${theme.s1};
  }
  .MainDealSection-showInputsTitle {
    color: ${nativeTheme.primary.main};
    min-width: 110px;
  }

  ${({ $completionStatus, $showInputs }) => {
    if (!$showInputs) {
      if ($completionStatus !== "allValid") {
        return css`
          padding-top: ${theme.s25};
          padding-bottom: ${theme.s25};
          padding-right: ${theme.s25};
          .MainDealSection-detailsDiv {
            display: none;
          }
        `;
      } else if ($completionStatus === "allValid") {
      }
    }
  }}
`;
