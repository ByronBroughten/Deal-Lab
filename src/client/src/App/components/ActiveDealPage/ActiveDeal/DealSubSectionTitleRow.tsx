import React from "react";
import { FaPlay } from "react-icons/fa";
import styled from "styled-components";
import { StateValue } from "../../../sharedWithServer/SectionsMeta/values/StateValue";
import { nativeTheme } from "../../../theme/nativeTheme";
import { CheckMarkCircle } from "../../appWide/checkMarkCircle";
import { EditSectionBtn } from "../../appWide/EditSectionBtn";
import ChunkTitle from "../../general/ChunkTitle";
import { MainSectionLargeEditBtn } from "./MainSectionLargeEditBtn";

type Props = {
  completionStatus: StateValue<"completionStatus">;
  sectionTitle: React.ReactNode;
  openEditor: () => void;
};

export function DealSubSectionTitleRow({
  completionStatus,
  sectionTitle,
  openEditor,
}: Props) {
  const btnText = completionStatus === "allEmpty" ? "Start" : "Continue";
  const isCompleted = completionStatus === "allValid";
  return (
    <Styled>
      <CheckMarkCircle
        {...{
          checked: isCompleted,
          className: "DealSubSectionTitleRow-checkmarkCircle",
        }}
      />
      <ChunkTitle
        sx={{
          color: nativeTheme.primary.main,
          minWidth: "200px",
        }}
      >
        {sectionTitle}
      </ChunkTitle>
      {!isCompleted && (
        <MainSectionLargeEditBtn
          {...{
            className: "DealSubSectionTitleRow-startBtn",
            sx: {
              borderRadius: 5,
            },
            middle: btnText,
            right: <FaPlay className="DealSubSectionTitleRow-startIcon" />,
            onClick: openEditor,
          }}
        />
      )}
      {isCompleted && (
        <EditSectionBtn
          className="DealSubSectionTitleRow-editBtn"
          onClick={openEditor}
        />
      )}
    </Styled>
  );
}

const Styled = styled.div`
  display: flex;
  flex: 1;
  align-items: center;

  .DealSubSectionTitleRow-checkmarkCircle {
    margin-right: ${nativeTheme.s3};
  }

  .DealSubSectionTitleRow-startIcon {
    margin-left: ${nativeTheme.s15};
  }

  .DealSubSectionTitleRow-editBtn {
    margin-left: ${nativeTheme.s1};
  }
`;
