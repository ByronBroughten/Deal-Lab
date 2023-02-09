import { FaPlay } from "react-icons/fa";
import styled, { css } from "styled-components";
import theme from "../../../theme/Theme";
import { CheckMarkCircle } from "../../appWide/checkMarkCircle";
import { EditSectionBtn } from "../../appWide/EditSectionBtn";
import { FormSection } from "../../appWide/FormSection";
import { MainSection } from "../../appWide/GeneralSection/MainSection";
import { HollowBtn } from "../../appWide/HollowBtn";
import { LabeledVarbProps } from "../../appWide/LabeledVarb";
import { LabeledVarbRow } from "../../appWide/LabeledVarbRow";
import { SectionTitle } from "../../appWide/SectionTitle";
import { StandardProps } from "../../general/StandardProps";
import { FinishBtn } from "./FinishBtn";

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
        $completionStatus: completionStatus,
        $showInputs: showInputs,
        $hide: hide,
        ...(!showInputs && completionStatus !== "allValid"
          ? { onClick: openInputs }
          : {}),
      }}
    >
      <div className="MainDealSection-inactiveTitleRow">
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
        <HollowBtn
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
      </div>
      <div className="MainDealSection-detailsDiv">
        <div className="MainDealSection-displayNameDiv">{displayName}</div>
        <LabeledVarbRow
          {...{
            varbPropArr: detailVarbPropArr,
            className: "MainDealSection-labeledVarbRow",
          }}
        />
      </div>
      <div className="MainDealSection-inputsDiv">
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
      </div>
    </Styled>
  );
}
// What kind of button?
export const Styled = styled(MainSection)<{
  $showInputs?: boolean;
  $hide?: boolean;
  $completionStatus: CompletionStatus;
}>`
  transition: all 0.2s ease-in-out;
  .MainDealSection-inactiveTitleRow {
    display: flex;
    align-items: center;
  }
  .MainDealSection-checkmarkCircle {
    margin-right: ${theme.s3};
  }
  .MainDealSection-startBtn {
    margin-left: ${theme.s3};
    width: 100%;
    height: 35px;
    font-size: ${theme.infoSize};
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
  .MainDealSection-detailsTitleRow {
    display: flex;
  }

  .MainDealSection-showInputsTitle {
    color: ${theme.primaryNext};
    min-width: 110px;
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

  ${({ $completionStatus, $showInputs }) => {
    if (!$showInputs) {
      if (["allEmpty", "someInvalid"].includes($completionStatus)) {
        return css`
          .MainDealSection-detailsDiv {
            display: none;
          }
        `;
      } else if ($completionStatus === "someInvalid") {
      } else if ($completionStatus === "allValid") {
      }
    }
  }}
`;
