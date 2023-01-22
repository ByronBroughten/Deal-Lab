import { AiFillEdit } from "react-icons/ai";
import styled, { css } from "styled-components";
import theme from "../../../theme/Theme";
import { MainSection } from "../../appWide/GeneralSection/MainSection";
import { LabeledVarbProps } from "../../appWide/LabeledVarb";
import { LabeledVarbRow } from "../../appWide/LabeledVarbRow";
import { SectionTitle } from "../../appWide/SectionTitle";
import { StyledIconBtn } from "../../appWide/StyledIconBtn";
import { StandardProps } from "../../general/StandardProps";
import { FinishBtn } from "./FinishBtn";

export type CompletionStatus = "allEmpty" | "allValid" | "someInvalid";

export interface MainDealSectionProps extends StandardProps {
  feId: string;
  showInputs: boolean;
  hide: boolean;
  openInputs: () => void;
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
}: MainDealSectionProps & {
  sectionTitle: string;
  closeInputs: () => void;
  completionStatus?: CompletionStatus;
  detailVarbPropArr?: LabeledVarbProps[];
  displayName?: string;
}) {
  const completionProps = completionStatusProps[completionStatus];
  const btnTitle = completionProps.btnTitleStart + sectionTitle;
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
      <div className="MainDealSection-detailsDiv">
        <div className="MainDealSection-detailsTitleRow">
          <SectionTitle
            className="MainDealSection-showInputsTitle"
            text={sectionTitle}
          />
          <StyledIconBtn
            className="MainDealSection-editBtn"
            left={<AiFillEdit size={20} />}
            middle="Edit"
            onClick={openInputs}
          />
        </div>
        {displayName && (
          <div className="MainDealSection-displayNameDiv">{displayName}</div>
        )}
        {detailVarbPropArr && (
          <LabeledVarbRow
            {...{
              varbPropArr: detailVarbPropArr,
              className: "MainDealSection-labeledVarbRow",
            }}
          />
        )}
      </div>
      <div className="MainDealSection-btnDiv">
        <SectionTitle
          className="MainDealSection-showInputsTitle"
          text={btnTitle}
        />
      </div>
      <div className="MainDealSection-inputsDiv">
        {children}
        <FinishBtn
          className="MainDealSection-finishBtn"
          text="Finish"
          onClick={closeInputs}
        />
      </div>
    </Styled>
  );
}

export const Styled = styled(MainSection)<{
  $showInputs?: boolean;
  $hide?: boolean;
  $completionStatus: CompletionStatus;
}>`
  transition: all 0.2s ease-in-out;

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

  .MainDealSection-detailsDiv {
  }
  .MainDealSection-editBtn {
    margin-left: ${theme.s1};
  }
  .MainDealSection-detailsTitleRow {
    display: flex;
  }

  .MainDealSection-btnDiv {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 75px;
  }

  .MainDealSection-showInputsTitle {
    color: ${theme.primaryNext};
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
          .MainDealSection-btnDiv {
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
      if ($completionStatus === "allEmpty") {
        return css`
          /* border: solid 1px ${theme.info.main}; */
          .MainDealSection-showInputsTitle {
            /* color: ${theme.info.border}; */
          }
          :hover {
            /* background-color: ${theme.info.dark}; */
          }
          .MainDealSection-detailsDiv {
            display: none;
          }
          :hover {
            box-shadow: none;
            cursor: pointer;
            background-color: ${theme.secondary};
            .MainDealSection-showInputsTitle {
              color: ${theme.light};
            }
          }
        `;
      } else if ($completionStatus === "someInvalid") {
        return css`
          /* border: solid 1px ${theme.primary.light}; */
          .MainDealSection-showInputsTitle {
            /* color: ${theme.primary.main}; */
          }
          :hover {
            /* background-color: ${theme.primary.main}; */
          }
          .MainDealSection-detailsDiv {
            display: none;
          }
          :hover {
            box-shadow: none;
            cursor: pointer;
            background-color: ${theme.secondary};
            .MainDealSection-showInputsTitle {
              color: ${theme.light};
            }
          }
        `;
      } else if ($completionStatus === "allValid") {
        return css`
          .MainDealSection-btnDiv {
            display: none;
          }
        `;
      }
    }
  }}
`;
